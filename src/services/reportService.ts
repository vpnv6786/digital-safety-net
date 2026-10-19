import { supabase } from '@/integrations/supabase/client';
import { normalizeBankAccount, normalizeEmail, normalizePhone, normalizeUrl, type EntityKind } from '@core/index.ts';

export interface NewReport {
  kind: EntityKind;
  value: string;
  bankCode?: string;
  category: string;
  description: string;
}

export type ReportError =
  | 'not_authenticated'
  | 'invalid_value'
  | 'invalid_description'
  | 'already_reported'
  | 'rate_limited'
  | 'unknown';

export const REPORT_ERROR_TEXT: Record<ReportError, { vi: string; en: string }> = {
  not_authenticated: { vi: 'Bạn cần đăng nhập để gửi báo cáo.', en: 'Please sign in to send a report.' },
  invalid_value: { vi: 'Số, link, email hoặc số tài khoản chưa đúng định dạng.', en: 'The number, link, email or account is not in a valid format.' },
  invalid_description: { vi: 'Mô tả cần từ 10 đến 2.000 ký tự.', en: 'The description needs 10 to 2,000 characters.' },
  already_reported: { vi: 'Bạn đã báo cáo mục này rồi. Cảm ơn bạn.', en: 'You already reported this. Thank you.' },
  rate_limited: { vi: 'Bạn đã gửi 10 báo cáo trong 24 giờ. Vui lòng thử lại sau.', en: 'You sent 10 reports in 24 hours. Please try again later.' },
  unknown: { vi: 'Chưa gửi được báo cáo. Vui lòng thử lại.', en: 'The report could not be sent. Please try again.' },
};

/** The lookup key the database expects, or null when the value is not valid for its kind. */
export function reportKey(kind: EntityKind, value: string): string | null {
  switch (kind) {
    case 'phone':
      return normalizePhone(value)?.key ?? null;
    case 'url':
      return normalizeUrl(value)?.key ?? null;
    case 'email':
      return normalizeEmail(value);
    case 'bank_account':
      return normalizeBankAccount(value);
  }
}

export async function submitReport(report: NewReport): Promise<{ ok: true; id: string } | { ok: false; error: ReportError }> {
  const key = reportKey(report.kind, report.value);
  if (!key) return { ok: false, error: 'invalid_value' };
  if (report.description.trim().length < 10 || report.description.length > 2000) return { ok: false, error: 'invalid_description' };

  const { data, error } = await supabase.rpc('submit_report', {
    p_kind: report.kind,
    p_value: key,
    p_category: report.category,
    p_description: report.description.trim(),
    p_bank_code: report.kind === 'bank_account' ? report.bankCode ?? null : null,
  });
  if (error) {
    const known: ReportError[] = ['not_authenticated', 'invalid_value', 'invalid_description', 'already_reported', 'rate_limited'];
    return { ok: false, error: known.find((code) => error.message?.includes(code)) ?? 'unknown' };
  }
  return { ok: true, id: data as string };
}
