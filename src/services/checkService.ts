import { supabase } from '@/integrations/supabase/client';
import { runCheck, type CheckResult, type CommunitySignal, type Entity } from '@core/index.ts';

async function lookupCommunity(entity: Entity): Promise<CommunitySignal> {
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
  };
}

/** Check a pasted message, phone number, link, email or bank account. */
export function checkInput(raw: string, bankCode?: string): Promise<CheckResult> {
  return runCheck(raw, lookupCommunity, { bankCode });
}
