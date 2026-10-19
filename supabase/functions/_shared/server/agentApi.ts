// Agent API: how operating agents (triage, intel, content) read the work
// queue and hand back proposals. Pull-based, so an agent runtime on a local
// machine (MiteClaw) needs no inbound address.
//
//   GET  /queue            pending reports (redacted), unpublished alerts, appeal count
//   GET  /summary?days=7   report counts per day, category and status
//   POST /proposals        { agent, proposals: [{ kind, target_id?, confidence?, rationale, payload? }] }
//
// Proposals change nothing until a moderator accepts them (decide_proposal).

import { redactPersonalData } from '../core/redact.ts';

export interface QueueReport {
  id: string;
  created_at: string;
  scam_category: string;
  description: string;
  evidence_count: number;
  entity_type: string | null;
  /** E.164 phone, URL key or email as reported; bank accounts only as masked digits. */
  entity: string | null;
}

export interface AgentStore {
  pendingReports(limit: number): Promise<QueueReport[]>;
  pendingAlerts(limit: number): Promise<{ id: string; title: string; description: string; created_at: string; source_type: string | null }[]>;
  pendingAppealCount(): Promise<number>;
  summary(days: number): Promise<{ day: string; scam_category: string; status: string; reports: number }[]>;
  insertProposals(rows: ProposalRow[]): Promise<string[]>;
}

export interface ProposalRow {
  agent: string;
  kind: string;
  target_id: string | null;
  confidence: number | null;
  rationale: string;
  payload: Record<string, unknown>;
}

export interface AgentRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
}

export interface AgentResponse {
  status: number;
  body: unknown;
}

export const PROPOSAL_KINDS = [
  'verify_report',
  'reject_report',
  'publish_alert',
  'hide_alert',
  'draft_alert',
  'cluster_reports',
  'takedown_request',
] as const;

const NEEDS_TARGET = new Set(['verify_report', 'reject_report', 'publish_alert', 'hide_alert']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const AGENT_NAME = /^[a-z0-9_-]{1,60}$/;
const MAX_PROPOSALS = 20;
const MAX_PAYLOAD_BYTES = 4096;

export function validateProposals(body: unknown): { ok: true; rows: ProposalRow[] } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'body must be an object' };
  const { agent, proposals } = body as { agent?: unknown; proposals?: unknown };
  if (typeof agent !== 'string' || !AGENT_NAME.test(agent)) return { ok: false, error: 'agent must match [a-z0-9_-]{1,60}' };
  if (!Array.isArray(proposals) || proposals.length === 0 || proposals.length > MAX_PROPOSALS) {
    return { ok: false, error: `proposals must be an array of 1 to ${MAX_PROPOSALS}` };
  }
  const rows: ProposalRow[] = [];
  for (const [i, p] of proposals.entries()) {
    if (!p || typeof p !== 'object') return { ok: false, error: `proposals[${i}] must be an object` };
    const { kind, target_id, confidence, rationale, payload } = p as Record<string, unknown>;
    if (typeof kind !== 'string' || !(PROPOSAL_KINDS as readonly string[]).includes(kind)) {
      return { ok: false, error: `proposals[${i}].kind is not one of ${PROPOSAL_KINDS.join(', ')}` };
    }
    if (target_id !== undefined && target_id !== null && (typeof target_id !== 'string' || !UUID.test(target_id))) {
      return { ok: false, error: `proposals[${i}].target_id must be a UUID` };
    }
    if (NEEDS_TARGET.has(kind) && !target_id) return { ok: false, error: `proposals[${i}].target_id is required for ${kind}` };
    if (confidence !== undefined && confidence !== null && (typeof confidence !== 'number' || confidence < 0 || confidence > 1)) {
      return { ok: false, error: `proposals[${i}].confidence must be between 0 and 1` };
    }
    if (typeof rationale !== 'string' || rationale.trim().length === 0 || rationale.length > 2000) {
      return { ok: false, error: `proposals[${i}].rationale must be 1 to 2000 characters` };
    }
    const data = payload ?? {};
    if (typeof data !== 'object' || Array.isArray(data) || new TextEncoder().encode(JSON.stringify(data)).length > MAX_PAYLOAD_BYTES) {
      return { ok: false, error: `proposals[${i}].payload must be an object under ${MAX_PAYLOAD_BYTES} bytes` };
    }
    rows.push({
      agent,
      kind,
      target_id: (target_id as string | undefined) ?? null,
      confidence: (confidence as number | undefined) ?? null,
      rationale: rationale.trim(),
      payload: data as Record<string, unknown>,
    });
  }
  return { ok: true, rows };
}

export async function handleAgentRequest(req: AgentRequest, store: AgentStore): Promise<AgentResponse> {
  const route = `${req.method} ${req.path.replace(/\/+$/, '')}`;
  switch (route) {
    case 'GET /queue': {
      const [reports, alerts, appeals] = await Promise.all([store.pendingReports(50), store.pendingAlerts(50), store.pendingAppealCount()]);
      return {
        status: 200,
        body: {
          reports: reports.map((r) => ({ ...r, description: redactPersonalData(r.description) })),
          alerts: alerts.map((a) => ({ ...a, description: redactPersonalData(a.description) })),
          pending_appeals: appeals,
        },
      };
    }
    case 'GET /summary': {
      const days = Math.min(90, Math.max(1, Number(req.query.get('days') ?? 7) || 7));
      return { status: 200, body: { days, rows: await store.summary(days) } };
    }
    case 'POST /proposals': {
      const checked = validateProposals(req.body);
      if (checked.ok === false) return { status: 400, body: { error: checked.error } };
      const ids = await store.insertProposals(checked.rows);
      return { status: 201, body: { ids, note: 'Proposals wait for a moderator; nothing has changed yet.' } };
    }
    default:
      return { status: 404, body: { error: 'not_found' } };
  }
}
