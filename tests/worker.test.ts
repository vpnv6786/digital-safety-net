import { describe, expect, it, vi } from 'vitest';
import { handleApi, type ApiDeps } from '../shared/server/http.ts';
import { agentStore, communityLookup, quota, supabaseRest } from '../shared/server/supabaseRest.ts';
import worker, { depsFromEnv } from '../worker/index.ts';

function fakeDeps(overrides: Partial<ApiDeps> = {}): ApiDeps & { counters: Map<string, number> } {
  const counters = new Map<string, number>();
  return {
    counters,
    lookup: async () => ({ found: false, verifiedReports: 0, unverifiedReporters: 0, lastVerifiedAt: null, lastReportAt: null, categories: [] }),
    consume: async (kind, limit) => {
      const n = (counters.get(kind) ?? 0) + 1;
      if (n > limit) return false;
      counters.set(kind, n);
      return true;
    },
    agentStore: {
      pendingReports: async () => [],
      pendingAlerts: async () => [],
      pendingAppealCount: async () => 0,
      summary: async () => [],
      insertProposals: async (rows) => rows.map((_, i) => `p${i}`),
    },
    agentToken: 'secret-token',
    salt: 'salt',
    limits: { perCallerPerDay: 3, llmPerDay: 10, visionPerDay: 10 },
    allowedOrigins: ['https://vebinhmang.example'],
    ...overrides,
  };
}

const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`https://x${path}`, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers });

describe('/api/check', () => {
  it('checks a message and counts the verdict', async () => {
    const deps = fakeDeps();
    const res = await handleApi(post('/api/check', { text: 'Anh đọc giúp em mã OTP vừa gửi về máy nhé' }), '1.2.3.4', deps);
    expect(res!.status).toBe(200);
    expect((await res!.json()).verdict.level).toBe('danger');
    expect(deps.counters.get('verdict:danger')).toBe(1);
    expect(res!.headers.get('access-control-allow-origin')).toBe('https://vebinhmang.example');
  });

  it('rate-limits each caller by hashed address', async () => {
    const deps = fakeDeps();
    for (let i = 0; i < 3; i++) expect((await handleApi(post('/api/check', { text: '0912345678' }), '1.2.3.4', deps))!.status).toBe(200);
    expect((await handleApi(post('/api/check', { text: '0912345678' }), '1.2.3.4', deps))!.status).toBe(429);
    expect((await handleApi(post('/api/check', { text: '0912345678' }), '5.6.7.8', deps))!.status).toBe(200);
    expect([...deps.counters.keys()].some((k) => k.includes('1.2.3.4'))).toBe(false);
  });

  it('keeps checking, without AI, when the quota database is unreachable', async () => {
    const analyze = vi.fn(async () => null);
    const deps = fakeDeps({ consume: async () => null, analyze });
    const res = await handleApi(post('/api/check', { text: 'Tin nhắn lạ gửi cho bạn, hãy xem thử' }), 'ip', deps);
    expect(res!.status).toBe(200);
    expect(analyze).not.toHaveBeenCalled();
  });

  it('rejects bad input', async () => {
    const deps = fakeDeps();
    expect((await handleApi(post('/api/check', '{oops'), 'ip', deps))!.status).toBe(400);
    expect((await handleApi(post('/api/check', { text: '  ' }), 'ip', deps))!.status).toBe(400);
    expect((await handleApi(post('/api/check', { image: { mediaType: 'image/gif', base64: 'AA' } }), 'ip', deps))!.status).toBe(400);
    expect((await handleApi(new Request('https://x/api/check'), 'ip', deps))!.status).toBe(405);
  });

  it('counts feedback', async () => {
    const deps = fakeDeps();
    expect((await handleApi(post('/api/check', { feedback: { level: 'danger', choice: 'stopped' } }), 'ip', deps))!.status).toBe(200);
    expect(deps.counters.get('feedback:danger:stopped')).toBe(1);
    expect((await handleApi(post('/api/check', { feedback: { level: 'danger', choice: 'x' } }), 'ip', deps))!.status).toBe(400);
  });
});

describe('/api/agent', () => {
  it('requires the token', async () => {
    const deps = fakeDeps();
    expect((await handleApi(new Request('https://x/api/agent/queue'), 'ip', deps))!.status).toBe(401);
    expect((await handleApi(new Request('https://x/api/agent/queue', { headers: { 'x-agent-token': 'nope' } }), 'ip', deps))!.status).toBe(401);
    const ok = await handleApi(new Request('https://x/api/agent/queue', { headers: { 'x-agent-token': 'secret-token' } }), 'ip', deps);
    expect(ok!.status).toBe(200);
  });

  it('is off when no token is configured', async () => {
    const res = await handleApi(new Request('https://x/api/agent/queue', { headers: { 'x-agent-token': '' } }), 'ip', fakeDeps({ agentToken: undefined }));
    expect(res!.status).toBe(503);
  });

  it('stores proposals', async () => {
    const res = await handleApi(
      post('/api/agent/proposals', { agent: 'triage', proposals: [{ kind: 'cluster_reports', rationale: 'same number' }] }, { 'x-agent-token': 'secret-token' }),
      'ip',
      fakeDeps(),
    );
    expect(res!.status).toBe(201);
  });
});

describe('routing', () => {
  it('leaves non-API paths to the static site', async () => {
    expect(await handleApi(new Request('https://x/tro-giup'), 'ip', fakeDeps())).toBeNull();
    expect((await handleApi(new Request('https://x/api/unknown'), 'ip', fakeDeps()))!.status).toBe(404);
  });

  it('serves assets and refuses the API when Supabase is not configured', async () => {
    const assets = { fetch: vi.fn(async () => new Response('<html>')) };
    expect(await (await worker.fetch(new Request('https://x/'), { ASSETS: assets })).text()).toBe('<html>');
    expect((await worker.fetch(new Request('https://x/api/check', { method: 'POST' }), { ASSETS: assets })).status).toBe(503);
    expect(depsFromEnv({ ASSETS: assets, SUPABASE_URL: 'https://s', SUPABASE_SERVICE_ROLE_KEY: 'k' })?.analyze).toBeUndefined();
  });
});

describe('supabase REST client', () => {
  it('calls RPCs with the service key and maps lookups', async () => {
    const fetchFn = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify({ found: true, verified_reports: 2, appeal_pending: true })));
    const db = supabaseRest('https://proj.supabase.co/', 'svc', fetchFn);
    const signal = await communityLookup(db)({ kind: 'phone', raw: '0912', key: '+84912345678' });
    expect(signal).toMatchObject({ found: true, verifiedReports: 2, appealPending: true });
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://proj.supabase.co/rest/v1/rpc/lookup_entity');
    expect((init!.headers as Record<string, string>).apikey).toBe('svc');
  });

  it('reports unknown on quota errors and reads counts from content-range', async () => {
    expect(await quota(supabaseRest('https://p', 'k', async () => new Response('', { status: 500 })))('x', 1)).toBeNull();
    const counting = supabaseRest('https://p', 'k', async () => new Response(null, { headers: { 'content-range': '0-0/7' } }));
    expect(await agentStore(counting).pendingAppealCount()).toBe(7);
  });

  it('masks bank accounts in the agent queue', async () => {
    const rows = [
      { id: 'r', created_at: 't', scam_category: 'c', description: 'd', evidence_urls: ['a'], entity: { entity_type: 'bank_account', display_value: '••••1234', normalized_value: 'h:abc' } },
    ];
    const db = supabaseRest('https://p', 'k', async () => new Response(JSON.stringify(rows)));
    expect((await agentStore(db).pendingReports(5))[0]).toMatchObject({ entity: '••••1234', evidence_count: 1 });
  });
});
