// Cloudflare Worker: serves the web app (static files from dist/) and the API.
// The database stays on Supabase; this Worker reaches it with the service-role
// key, which never leaves Cloudflare.
//
// Settings (wrangler.jsonc vars, or secrets set by the deploy workflow):
//   SUPABASE_URL                 var
//   SUPABASE_SERVICE_ROLE_KEY    secret, required for the API
//   AGENT_API_TOKEN              secret, enables /api/agent/*
//   ANTHROPIC_API_KEY            secret, optional: screenshots and AI explanations
//   WEB_RISK_API_KEY             secret, optional: Google Web Risk
//   RATE_LIMIT_SALT              secret, optional
//   LLM_MODEL, LLM_DAILY_LIMIT, VISION_DAILY_LIMIT, CHECKS_PER_CALLER_PER_DAY, ALLOWED_ORIGINS   vars, optional

import Anthropic from '@anthropic-ai/sdk';
import { handleApi, type ApiDeps } from '../shared/server/http.ts';
import { agentStore, communityLookup, quota, supabaseRest } from '../shared/server/supabaseRest.ts';
import { domainAgeReason, domainRegisteredAt, webRiskReason } from '../shared/server/external.ts';
import { buildAnalyzeRequest, DEFAULT_MODEL, parseAnalyzeResponse, type AnalyzeInput } from '../shared/server/llm.ts';

export interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  AGENT_API_TOKEN?: string;
  ANTHROPIC_API_KEY?: string;
  WEB_RISK_API_KEY?: string;
  RATE_LIMIT_SALT?: string;
  LLM_MODEL?: string;
  LLM_DAILY_LIMIT?: string;
  VISION_DAILY_LIMIT?: string;
  CHECKS_PER_CALLER_PER_DAY?: string;
  ALLOWED_ORIGINS?: string;
}

const intVar = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return value && Number.isFinite(n) && n >= 0 ? n : fallback;
};

function analyzer(env: Env) {
  if (!env.ANTHROPIC_API_KEY) return undefined;
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 25_000 });
  const model = env.LLM_MODEL || DEFAULT_MODEL;
  return async (input: AnalyzeInput) => {
    try {
      return parseAnalyzeResponse(await client.beta.messages.create(buildAnalyzeRequest(input, model)));
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) console.warn('model rate limited');
      else if (error instanceof Anthropic.APIError) console.error(`model error ${error.status}`);
      else console.error('model call failed');
      return null;
    }
  };
}

export function depsFromEnv(env: Env): ApiDeps | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const db = supabaseRest(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const webRiskKey = env.WEB_RISK_API_KEY;
  return {
    lookup: communityLookup(db),
    consume: quota(db),
    webRisk: webRiskKey ? (url) => webRiskReason(url, webRiskKey, fetch) : undefined,
    domainAge: async (domain) => domainAgeReason(domain, await domainRegisteredAt(domain, fetch)),
    analyze: analyzer(env),
    agentStore: agentStore(db),
    agentToken: env.AGENT_API_TOKEN || undefined,
    // Without a configured salt, a per-isolate one still keeps hashes useless outside today's limiter.
    salt: env.RATE_LIMIT_SALT || crypto.randomUUID(),
    limits: {
      perCallerPerDay: intVar(env.CHECKS_PER_CALLER_PER_DAY, 200),
      llmPerDay: intVar(env.LLM_DAILY_LIMIT, 500),
      visionPerDay: intVar(env.VISION_DAILY_LIMIT, 200),
    },
    allowedOrigins: (env.ALLOWED_ORIGINS || '*').split(',').map((o) => o.trim()),
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (new URL(req.url).pathname.startsWith('/api/')) {
      const deps = depsFromEnv(env);
      if (!deps) return Response.json({ error: 'api_not_configured' }, { status: 503 });
      const res = await handleApi(req, req.headers.get('cf-connecting-ip') ?? 'unknown', deps);
      if (res) return res;
    }
    return env.ASSETS.fetch(req);
  },
};
