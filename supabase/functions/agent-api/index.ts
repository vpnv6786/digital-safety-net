// /functions/v1/agent-api/{queue,summary,proposals}
// For operating agents only. Requires header  x-agent-token: <AGENT_API_TOKEN>.
// Deploy with --no-verify-jwt: agents authenticate with their own token, not a Supabase user JWT.
//
// Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (set by Supabase), AGENT_API_TOKEN (required).

import { createClient } from 'npm:@supabase/supabase-js@2.50.0';
import { handleAgentRequest, type AgentStore, type QueueReport } from '../_shared/server/agentApi.ts';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});
const agentToken = Deno.env.get('AGENT_API_TOKEN')?.trim();

async function digest(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

/** Compare fixed-length digests so the check takes the same time whatever the token. */
async function tokenMatches(given: string | null): Promise<boolean> {
  if (!agentToken || !given) return false;
  const [a, b] = await Promise.all([digest(given), digest(agentToken)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const store: AgentStore = {
  async pendingReports(limit) {
    const { data, error } = await supabase
      .from('reports')
      .select('id, created_at, scam_category, description, evidence_urls, entity:entities(entity_type, display_value, normalized_value)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((r): QueueReport => {
      const entity = r.entity as unknown as { entity_type: string; display_value: string | null; normalized_value: string | null } | null;
      return {
        id: r.id,
        created_at: r.created_at,
        scam_category: r.scam_category,
        description: r.description,
        evidence_count: (r.evidence_urls ?? []).length,
        entity_type: entity?.entity_type ?? null,
        entity: entity?.entity_type === 'bank_account' ? entity.display_value : (entity?.normalized_value ?? null),
      };
    });
  },
  async pendingAlerts(limit) {
    const { data, error } = await supabase
      .from('community_alerts')
      .select('id, title, description, created_at, source_type')
      .eq('is_verified', false)
      .is('expires_at', null)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },
  async pendingAppealCount() {
    const { count, error } = await supabase.from('appeals').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    if (error) throw error;
    return count ?? 0;
  },
  async summary(days) {
    const { data, error } = await supabase.rpc('report_summary', { p_days: days });
    if (error) throw error;
    return (data ?? []).map((r: { day: string; scam_category: string; status: string; reports: number }) => ({ ...r, reports: Number(r.reports) }));
  },
  async insertProposals(rows) {
    const { data, error } = await supabase.from('agent_proposals').insert(rows).select('id');
    if (error) throw error;
    return (data ?? []).map((r) => r.id as string);
  },
};

Deno.serve(async (req) => {
  if (!(await tokenMatches(req.headers.get('x-agent-token')))) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/agent-api/, '') || '/';
  let body: unknown = null;
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid_json' }, { status: 400 });
    }
  }
  try {
    const res = await handleAgentRequest({ method: req.method, path, query: url.searchParams, body }, store);
    return Response.json(res.body, { status: res.status });
  } catch (error) {
    console.error('agent-api failed', error instanceof Error ? error.message : error);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
});
