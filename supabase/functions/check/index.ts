// POST /functions/v1/check
// Body: { text?: string, bankCode?: string, image?: { mediaType, base64 } }
// Runs the shared check on the server, adding Web Risk, domain age and an AI
// explanation when they are configured. Nothing the caller sends is stored.
//
// Environment:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   set by Supabase
//   ANTHROPIC_API_KEY                         optional: AI explanation and screenshot reading
//   LLM_MODEL                                 optional, default claude-opus-5-5
//   WEB_RISK_API_KEY                          optional: Google Web Risk lookups
//   LLM_DAILY_LIMIT, VISION_DAILY_LIMIT       optional, default 500 and 200 calls per day
//   CHECKS_PER_CALLER_PER_DAY                 optional, default 200
//   ALLOWED_ORIGINS                           optional, comma-separated; default *

import Anthropic from 'npm:@anthropic-ai/sdk@0.135.0';
import { createClient } from 'npm:@supabase/supabase-js@2.50.0';
import type { CommunitySignal, Entity } from '../_shared/core/types.ts';
import { MAX_INPUT_CHARS } from '../_shared/core/text.ts';
import { serverCheck, type ServerCheckDeps } from '../_shared/server/checkServer.ts';
import { domainAgeReason, domainRegisteredAt, webRiskReason } from '../_shared/server/external.ts';
import { buildAnalyzeRequest, DEFAULT_MODEL, parseAnalyzeResponse, type AnalyzeInput } from '../_shared/server/llm.ts';

const MAX_IMAGE_BASE64 = 5_000_000;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const env = (name: string) => Deno.env.get(name)?.trim() || undefined;
const intEnv = (name: string, fallback: number) => {
  const n = Number(env(name));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const supabase = createClient(env('SUPABASE_URL')!, env('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});
const anthropicKey = env('ANTHROPIC_API_KEY');
const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey, maxRetries: 1, timeout: 25_000 }) : null;
const model = env('LLM_MODEL') ?? DEFAULT_MODEL;
const webRiskKey = env('WEB_RISK_API_KEY');
const allowedOrigins = (env('ALLOWED_ORIGINS') ?? '*').split(',').map((o) => o.trim());
// Salt for hashing caller IPs in the rate limiter; a new one per cold start is fine for a daily limit.
const ipSalt = env('RATE_LIMIT_SALT') ?? crypto.randomUUID();

function corsHeaders(origin: string | null): HeadersInit {
  const allow = allowedOrigins.includes('*') ? '*' : origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function consume(kind: string, limit: number): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_quota', { p_kind: kind, p_limit: limit });
  if (error) {
    console.error('consume_quota failed', error.message);
    return false;
  }
  return data === true;
}

async function lookup(entity: Entity): Promise<CommunitySignal> {
  const { data, error } = await supabase.rpc('lookup_entity', { p_kind: entity.kind, p_value: entity.key });
  if (error) throw error;
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    verifiedReports: Number(d.verified_reports ?? 0),
    unverifiedReporters: Number(d.unverified_reporters ?? 0),
    lastVerifiedAt: (d.last_verified_at as string | null) ?? null,
    lastReportAt: (d.last_report_at as string | null) ?? null,
    categories: Array.isArray(d.categories) ? (d.categories as string[]) : [],
    appealPending: d.appeal_pending === true,
  };
}

async function analyze(input: AnalyzeInput) {
  if (!anthropic) return null;
  try {
    const params = buildAnalyzeRequest(input, model) as unknown as Anthropic.Beta.MessageCreateParamsNonStreaming;
    const message = await anthropic.beta.messages.create(params);
    return parseAnalyzeResponse(message);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.warn('model rate limited');
    else if (error instanceof Anthropic.APIError) console.error(`model error ${error.status}`);
    else console.error('model call failed');
    return null;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin);

  let body: { text?: unknown; bankCode?: unknown; image?: { mediaType?: unknown; base64?: unknown } };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  const text = typeof body.text === 'string' ? body.text.slice(0, MAX_INPUT_CHARS) : '';
  const bankCode = typeof body.bankCode === 'string' ? body.bankCode.slice(0, 10) : undefined;
  let image: AnalyzeInput['image'];
  if (body.image) {
    const { mediaType, base64 } = body.image;
    if (typeof mediaType !== 'string' || !IMAGE_TYPES.has(mediaType) || typeof base64 !== 'string' || base64.length > MAX_IMAGE_BASE64) {
      return json({ error: 'invalid_image' }, 400, origin);
    }
    image = { mediaType: mediaType as 'image/jpeg', base64 };
  }
  if (!text.trim() && !image) return json({ error: 'empty_input' }, 400, origin);

  const caller = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!(await consume(`caller:${(await sha256(ipSalt + caller)).slice(0, 32)}`, intEnv('CHECKS_PER_CALLER_PER_DAY', 200)))) {
    return json({ error: 'rate_limited' }, 429, origin);
  }

  const deps: ServerCheckDeps = {
    lookup,
    webRisk: webRiskKey ? (url) => webRiskReason(url, webRiskKey, fetch) : undefined,
    domainAge: async (domain) => domainAgeReason(domain, await domainRegisteredAt(domain, fetch)),
    analyze: anthropic ? analyze : undefined,
    allow: (kind) => consume(kind, kind === 'vision' ? intEnv('VISION_DAILY_LIMIT', 200) : intEnv('LLM_DAILY_LIMIT', 500)),
  };

  const result = await serverCheck({ text, bankCode, image }, deps);
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
    origin,
  );
});
