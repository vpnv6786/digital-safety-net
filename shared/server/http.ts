// HTTP layer for the public check API and the agent API. Platform-neutral:
// the Cloudflare Worker builds the dependencies from its environment and
// passes requests here; tests pass fakes.
//
//   POST /api/check          { text?, bankCode?, image? }  or  { feedback: { level, choice } }
//   GET  /api/agent/queue    x-agent-token required
//   GET  /api/agent/summary
//   POST /api/agent/proposals

import { MAX_INPUT_CHARS } from '../core/text.ts';
import type { CommunityLookup } from '../core/check.ts';
import type { Reason } from '../core/types.ts';
import { handleAgentRequest, type AgentStore } from './agentApi.ts';
import { serverCheck } from './checkServer.ts';
import { feedbackCounter, METRIC_LIMIT } from './feedback.ts';
import type { AnalyzeInput, Assessment } from './llm.ts';

const MAX_IMAGE_BASE64 = 5_000_000;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface ApiDeps {
  lookup: CommunityLookup;
  /**
   * consume_quota: true when today's count for `kind` is still under `limit`, false when over,
   * null when the database could not answer. Unknown lets a caller's check through (the check
   * itself is cheap) but keeps paid AI calls off.
   */
  consume: (kind: string, limit: number) => Promise<boolean | null>;
  webRisk?: (url: string) => Promise<Reason | null>;
  domainAge?: (domain: string) => Promise<Reason | null>;
  analyze?: (input: AnalyzeInput) => Promise<Assessment | null>;
  agentStore: AgentStore;
  /** Shared secret for the agent API; when unset the agent API answers 503. */
  agentToken?: string;
  /** Salt for hashing caller addresses in the rate limiter. */
  salt: string;
  limits: { perCallerPerDay: number; llmPerDay: number; visionPerDay: number };
  allowedOrigins: string[];
}

function cors(origin: string | null, allowed: string[]): Record<string, string> {
  const allow = allowed.includes('*') ? '*' : origin && allowed.includes(origin) ? origin : allowed[0] ?? '';
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    vary: 'Origin',
  };
}

function json(body: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...extra } });
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Compare fixed-length digests so the time taken does not depend on the token. */
async function tokenMatches(given: string | null, expected: string): Promise<boolean> {
  if (!given) return false;
  const [a, b] = await Promise.all([sha256Hex(given), sha256Hex(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function handleCheck(req: Request, callerIp: string, deps: ApiDeps): Promise<Response> {
  const headers = cors(req.headers.get('origin'), deps.allowedOrigins);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, headers);

  let body: { text?: unknown; bankCode?: unknown; image?: { mediaType?: unknown; base64?: unknown }; feedback?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, headers);
  }
  if (!body || typeof body !== 'object') return json({ error: 'invalid_json' }, 400, headers);

  const callerKind = `caller:${(await sha256Hex(deps.salt + callerIp)).slice(0, 32)}`;

  if (body.feedback !== undefined) {
    const counter = feedbackCounter(body.feedback);
    if (!counter) return json({ error: 'invalid_feedback' }, 400, headers);
    if ((await deps.consume(callerKind, deps.limits.perCallerPerDay)) === false) return json({ error: 'rate_limited' }, 429, headers);
    await deps.consume(counter, METRIC_LIMIT);
    return json({ ok: true }, 200, headers);
  }

  const text = typeof body.text === 'string' ? body.text.slice(0, MAX_INPUT_CHARS) : '';
  const bankCode = typeof body.bankCode === 'string' ? body.bankCode.slice(0, 10) : undefined;
  let image: AnalyzeInput['image'];
  if (body.image) {
    const { mediaType, base64 } = body.image;
    if (typeof mediaType !== 'string' || !IMAGE_TYPES.has(mediaType) || typeof base64 !== 'string' || base64.length > MAX_IMAGE_BASE64) {
      return json({ error: 'invalid_image' }, 400, headers);
    }
    image = { mediaType: mediaType as 'image/jpeg', base64 };
  }
  if (!text.trim() && !image) return json({ error: 'empty_input' }, 400, headers);
  if ((await deps.consume(callerKind, deps.limits.perCallerPerDay)) === false) return json({ error: 'rate_limited' }, 429, headers);

  const result = await serverCheck(
    { text, bankCode, image },
    {
      lookup: deps.lookup,
      webRisk: deps.webRisk,
      domainAge: deps.domainAge,
      analyze: deps.analyze,
      allow: async (kind) => (await deps.consume(kind, kind === 'vision' ? deps.limits.visionPerDay : deps.limits.llmPerDay)) === true,
    },
  );
  await deps.consume(`verdict:${result.verdict.level}`, METRIC_LIMIT);
  return json(
    {
      verdict: result.verdict,
      entities: result.entities,
      isMessage: result.isMessage,
      lookupFailed: result.lookupFailed,
      extractedText: result.extractedText ?? null,
      ai: result.ai,
    },
    200,
    headers,
  );
}

export async function handleAgent(req: Request, subpath: string, deps: ApiDeps): Promise<Response> {
  if (!deps.agentToken) return json({ error: 'agent_api_disabled' }, 503);
  if (!(await tokenMatches(req.headers.get('x-agent-token'), deps.agentToken))) return json({ error: 'unauthorized' }, 401);
  let body: unknown = null;
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }
  }
  try {
    const res = await handleAgentRequest(
      { method: req.method, path: subpath || '/', query: new URL(req.url).searchParams, body },
      deps.agentStore,
    );
    return json(res.body, res.status);
  } catch (error) {
    console.error('agent api failed', error instanceof Error ? error.message : error);
    return json({ error: 'internal_error' }, 500);
  }
}

/** Route an /api/* request. Returns null for paths this API does not own. */
export async function handleApi(req: Request, callerIp: string, deps: ApiDeps): Promise<Response | null> {
  const path = new URL(req.url).pathname.replace(/\/+$/, '');
  if (path === '/api/check') return handleCheck(req, callerIp, deps);
  if (path === '/api/agent' || path.startsWith('/api/agent/')) return handleAgent(req, path.slice('/api/agent'.length), deps);
  if (path.startsWith('/api/')) return json({ error: 'not_found' }, 404);
  return null;
}
