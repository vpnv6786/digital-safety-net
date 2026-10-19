import { supabase } from '@/integrations/supabase/client';

export interface PendingReport {
  id: string;
  created_at: string;
  scam_category: string;
  description: string;
  evidence_urls: string[] | null;
  reporter_user_id: string;
  entity: { entity_type: string; display_value: string | null; normalized_value: string | null; bank_code: string | null } | null;
}

export async function isModerator(userId: string): Promise<boolean> {
  const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'moderator' });
  return data === true;
}

export async function pendingReports(): Promise<PendingReport[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, created_at, scam_category, description, evidence_urls, reporter_user_id, entity:entities(entity_type, display_value, normalized_value, bank_code)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as PendingReport[];
}

/** Short-lived links to evidence images; only the reporter and moderators can create them. */
export async function evidenceLinks(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const { data } = await supabase.storage.from('evidence').createSignedUrls(paths, 300);
  return (data ?? []).map((d) => d.signedUrl).filter((u): u is string => !!u);
}

export async function moderateReport(id: string, decision: 'verified' | 'rejected', note: string) {
  const { error } = await supabase.rpc('moderate_report', { p_report_id: id, p_decision: decision, p_note: note || null });
  if (error) throw error;
}

export async function pendingAlerts() {
  const { data, error } = await supabase
    .from('community_alerts')
    .select('id, title, description, alert_type, severity, created_at, reporter_user_id')
    .eq('is_verified', false)
    .is('expires_at', null)
    .order('created_at', { ascending: true })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function moderateAlert(id: string, decision: 'verify' | 'hide', note: string) {
  const { error } = await supabase.rpc('moderate_alert', { p_alert_id: id, p_decision: decision, p_note: note || null });
  if (error) throw error;
}

export async function pendingAppeals() {
  const { data, error } = await supabase
    .from('appeals')
    .select('id, entity_type, display_value, reason, contact, created_at, user_id')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function resolveAppeal(id: string, decision: 'accepted' | 'rejected', note: string) {
  const { error } = await supabase.rpc('resolve_appeal', { p_appeal_id: id, p_decision: decision, p_note: note || null });
  if (error) throw error;
}

export async function submitAppeal(kind: string, value: string, reason: string, contact: string) {
  const { data, error } = await supabase.rpc('submit_appeal', {
    p_kind: kind,
    p_value: value,
    p_reason: reason,
    p_contact: contact || null,
  });
  if (error) throw error;
  return data;
}
