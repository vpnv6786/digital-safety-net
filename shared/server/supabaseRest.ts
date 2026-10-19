// The few Supabase (PostgREST) calls the API needs, over plain fetch with the
// service-role key. Runs on Cloudflare Workers without extra packages.

import type { CommunitySignal, Entity } from '../core/types.ts';
import type { AgentStore, QueueReport } from './agentApi.ts';
import type { FetchLike } from './external.ts';

export interface SupabaseRest {
  rpc<T>(fn: string, args: Record<string, unknown>): Promise<T>;
  select<T>(pathAndQuery: string): Promise<T>;
  count(pathAndQuery: string): Promise<number>;
  insert<T>(table: string, rows: unknown[], returning: string): Promise<T>;
}

export function supabaseRest(url: string, serviceKey: string, fetchFn: FetchLike = fetch): SupabaseRest {
  const base = `${url.replace(/\/+$/, '')}/rest/v1`;
  const headers = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, 'content-type': 'application/json' };
  const ok = async (res: Response, what: string) => {
    if (!res.ok) throw new Error(`supabase ${what} answered ${res.status}`);
    return res;
  };
  return {
    async rpc(fn, args) {
      const res = await ok(await fetchFn(`${base}/rpc/${fn}`, { method: 'POST', headers, body: JSON.stringify(args) }), `rpc ${fn}`);
      return res.json();
    },
    async select(pathAndQuery) {
      const res = await ok(await fetchFn(`${base}/${pathAndQuery}`, { headers }), 'select');
      return res.json();
    },
    async count(pathAndQuery) {
      const res = await ok(
        await fetchFn(`${base}/${pathAndQuery}`, { method: 'HEAD', headers: { ...headers, prefer: 'count=exact' } }),
        'count',
      );
      const total = res.headers.get('content-range')?.split('/')[1];
      return total && total !== '*' ? Number(total) : 0;
    },
    async insert(table, rows, returning) {
      const res = await ok(
        await fetchFn(`${base}/${table}?select=${encodeURIComponent(returning)}`, {
          method: 'POST',
          headers: { ...headers, prefer: 'return=representation' },
          body: JSON.stringify(rows),
        }),
        `insert ${table}`,
      );
      return res.json();
    },
  };
}

export function communityLookup(db: SupabaseRest) {
  return async (entity: Entity): Promise<CommunitySignal> => {
    const d = ((await db.rpc('lookup_entity', { p_kind: entity.kind, p_value: entity.key })) ?? {}) as Record<string, unknown>;
    return {
      found: Boolean(d.found),
      verifiedReports: Number(d.verified_reports ?? 0),
      unverifiedReporters: Number(d.unverified_reporters ?? 0),
      lastVerifiedAt: (d.last_verified_at as string | null) ?? null,
      lastReportAt: (d.last_report_at as string | null) ?? null,
      categories: Array.isArray(d.categories) ? (d.categories as string[]) : [],
      appealPending: d.appeal_pending === true,
    };
  };
}

/** Today's quota check: true under the limit, false over it, null when the database could not answer. */
export function quota(db: SupabaseRest) {
  return async (kind: string, limit: number): Promise<boolean | null> => {
    try {
      return (await db.rpc<boolean>('consume_quota', { p_kind: kind, p_limit: limit })) === true;
    } catch (error) {
      console.error('consume_quota failed', error instanceof Error ? error.message : error);
      return null;
    }
  };
}

export function agentStore(db: SupabaseRest): AgentStore {
  return {
    async pendingReports(limit) {
      const rows = await db.select<
        {
          id: string;
          created_at: string;
          scam_category: string;
          description: string;
          evidence_urls: string[] | null;
          entity: { entity_type: string; display_value: string | null; normalized_value: string | null } | null;
        }[]
      >(
        `reports?select=id,created_at,scam_category,description,evidence_urls,entity:entities(entity_type,display_value,normalized_value)` +
          `&status=eq.pending&order=created_at.asc&limit=${limit}`,
      );
      return rows.map(
        (r): QueueReport => ({
          id: r.id,
          created_at: r.created_at,
          scam_category: r.scam_category,
          description: r.description,
          evidence_count: (r.evidence_urls ?? []).length,
          entity_type: r.entity?.entity_type ?? null,
          entity: r.entity?.entity_type === 'bank_account' ? r.entity.display_value : (r.entity?.normalized_value ?? null),
        }),
      );
    },
    pendingAlerts: (limit) =>
      db.select(`community_alerts?select=id,title,description,created_at,source_type&is_verified=eq.false&expires_at=is.null&order=created_at.asc&limit=${limit}`),
    pendingAppealCount: () => db.count('appeals?select=id&status=eq.pending'),
    async summary(days) {
      const rows = await db.rpc<{ day: string; scam_category: string; status: string; reports: number }[]>('report_summary', { p_days: days });
      return (rows ?? []).map((r) => ({ ...r, reports: Number(r.reports) }));
    },
    async insertProposals(rows) {
      const inserted = await db.insert<{ id: string }[]>('agent_proposals', rows, 'id');
      return inserted.map((r) => r.id);
    },
    async existingDedupeKeys(agent, keys, since) {
      // agent and keys are validated to [a-z0-9._:-], so they need no quoting beyond the list syntax.
      const rows = await db.select<{ key: string }[]>(
        `agent_proposals?select=key:payload->>dedupe_key&agent=eq.${encodeURIComponent(agent)}` +
          `&created_at=gte.${encodeURIComponent(since.toISOString())}` +
          `&payload->>dedupe_key=in.(${keys.map((k) => encodeURIComponent(`"${k}"`)).join(',')})`,
      );
      return rows.map((r) => r.key);
    },
  };
}
