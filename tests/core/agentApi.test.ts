import { describe, expect, it } from 'vitest';
import { redactPersonalData } from '@core/index.ts';
import { handleAgentRequest, validateProposals, type AgentStore, type ProposalRow } from '../../shared/server/agentApi.ts';

const ID = '11111111-2222-3333-4444-555555555555';

function fakeStore(inserted: ProposalRow[] = [], existingKeys: string[] = []): AgentStore {
  return {
    pendingReports: async () => [
      {
        id: ID,
        created_at: '2026-10-19T00:00:00Z',
        scam_category: 'bank_phishing',
        description: 'Nó gọi từ 0912 345 678, bắt chuyển vào STK 190345678901, email lừa: abc@gmail.com',
        evidence_count: 1,
        entity_type: 'phone',
        entity: '+84912345678',
      },
    ],
    pendingAlerts: async () => [],
    pendingAppealCount: async () => 2,
    summary: async () => [{ day: '2026-10-19', scam_category: 'bank_phishing', status: 'pending', reports: 3 }],
    insertProposals: async (rows) => {
      inserted.push(...rows);
      return rows.map((_, i) => `id-${i}`);
    },
    existingDedupeKeys: async (_agent, keys) => keys.filter((k) => existingKeys.includes(k)),
  };
}

describe('redactPersonalData', () => {
  it('masks phone, account and ID numbers and email names', () => {
    const out = redactPersonalData('Gọi 0912 345 678 hoặc +84 987.654.321, STK 190345678901, CCCD 079123456789, mail a.b@gmail.com');
    expect(out).not.toMatch(/0912|987\.654|1903456|0791234|a\.b@/);
    expect(out).toContain('••••678');
    expect(out).toContain('•••@gmail.com');
  });

  it('leaves amounts, dates and short numbers alone', () => {
    expect(redactPersonalData('Chuyển 5.000.000đ lúc 10:15 ngày 18/10, mã đơn 4821')).toBe('Chuyển 5.000.000đ lúc 10:15 ngày 18/10, mã đơn 4821');
  });
});

describe('agent API', () => {
  it('serves the queue with redacted descriptions', async () => {
    const res = await handleAgentRequest({ method: 'GET', path: '/queue', query: new URLSearchParams(), body: null }, fakeStore());
    const body = res.body as { reports: { description: string }[]; pending_appeals: number };
    expect(res.status).toBe(200);
    expect(body.reports[0].description).not.toContain('190345678901');
    expect(body.reports[0].description).not.toContain('abc@');
    expect(body.pending_appeals).toBe(2);
  });

  it('clamps summary days', async () => {
    const res = await handleAgentRequest({ method: 'GET', path: '/summary', query: new URLSearchParams('days=999'), body: null }, fakeStore());
    expect((res.body as { days: number }).days).toBe(90);
  });

  it('stores valid proposals and says nothing changed yet', async () => {
    const inserted: ProposalRow[] = [];
    const res = await handleAgentRequest(
      {
        method: 'POST',
        path: '/proposals/',
        query: new URLSearchParams(),
        body: { agent: 'triage', proposals: [{ kind: 'verify_report', target_id: ID, confidence: 0.8, rationale: 'Matches the safe-account script' }] },
      },
      fakeStore(inserted),
    );
    expect(res.status).toBe(201);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ agent: 'triage', kind: 'verify_report', target_id: ID });
  });

  it('skips proposals whose dedupe key was used recently or repeats in the batch', async () => {
    const inserted: ProposalRow[] = [];
    const takedown = (key: string) => ({ kind: 'takedown_request', rationale: 'lookalike', payload: { dedupe_key: key } });
    const res = await handleAgentRequest(
      {
        method: 'POST',
        path: '/proposals',
        query: new URLSearchParams(),
        body: { agent: 'intel', proposals: [takedown('old.com'), takedown('new.com'), takedown('new.com'), { kind: 'cluster_reports', rationale: 'x' }] },
      },
      fakeStore(inserted, ['old.com']),
    );
    expect(res.status).toBe(201);
    expect((res.body as { skipped: number }).skipped).toBe(2);
    expect(inserted.map((r) => r.payload.dedupe_key ?? r.kind)).toEqual(['new.com', 'cluster_reports']);
  });

  it('rejects malformed proposals', () => {
    const bad: unknown[] = [
      null,
      { agent: 'Bad Name!', proposals: [{ kind: 'verify_report', target_id: ID, rationale: 'x' }] },
      { agent: 'triage', proposals: [] },
      { agent: 'triage', proposals: [{ kind: 'delete_everything', rationale: 'x' }] },
      { agent: 'triage', proposals: [{ kind: 'verify_report', rationale: 'no target' }] },
      { agent: 'triage', proposals: [{ kind: 'verify_report', target_id: 'not-a-uuid', rationale: 'x' }] },
      { agent: 'triage', proposals: [{ kind: 'draft_alert', confidence: 2, rationale: 'x' }] },
      { agent: 'triage', proposals: [{ kind: 'draft_alert', rationale: '' }] },
      { agent: 'triage', proposals: [{ kind: 'draft_alert', rationale: 'x', payload: { big: 'y'.repeat(5000) } }] },
      { agent: 'intel', proposals: [{ kind: 'takedown_request', rationale: 'x', payload: { dedupe_key: 'Bad Key"),(' } }] },
      { agent: 'triage', proposals: Array.from({ length: 21 }, () => ({ kind: 'cluster_reports', rationale: 'x' })) },
    ];
    for (const body of bad) expect(validateProposals(body).ok, JSON.stringify(body)?.slice(0, 80)).toBe(false);
  });

  it('answers 404 for unknown routes', async () => {
    const res = await handleAgentRequest({ method: 'DELETE', path: '/queue', query: new URLSearchParams(), body: null }, fakeStore());
    expect(res.status).toBe(404);
  });
});
