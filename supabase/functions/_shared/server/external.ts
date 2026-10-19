// External reputation signals for links: Google Web Risk and domain age (RDAP).
// Each lookup is optional and fails quietly: a failed lookup adds no reason,
// it never makes a link look safer.

import type { Reason } from '../core/types.ts';

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const TIMEOUT_MS = 4000;

async function getJson(fetchFn: FetchLike, url: string): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetchFn(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const THREAT_TEXT: Record<string, { vi: string; en: string }> = {
  SOCIAL_ENGINEERING: { vi: 'lừa đảo, giả mạo', en: 'phishing / social engineering' },
  MALWARE: { vi: 'mã độc', en: 'malware' },
  UNWANTED_SOFTWARE: { vi: 'phần mềm không mong muốn', en: 'unwanted software' },
};

/** Google Web Risk Lookup API. Commercial use must go through Web Risk, not the Safe Browsing API. */
export async function webRiskReason(url: string, apiKey: string, fetchFn: FetchLike): Promise<Reason | null> {
  const params = new URLSearchParams();
  for (const t of Object.keys(THREAT_TEXT)) params.append('threatTypes', t);
  params.set('uri', url);
  params.set('key', apiKey);
  const data = (await getJson(fetchFn, `https://webrisk.googleapis.com/v1/uris:search?${params}`)) as
    | { threat?: { threatTypes?: string[] } }
    | null;
  const types = data?.threat?.threatTypes ?? [];
  if (types.length === 0) return null;
  const vi = types.map((t) => THREAT_TEXT[t]?.vi ?? t).join(', ');
  const en = types.map((t) => THREAT_TEXT[t]?.en ?? t).join(', ');
  return {
    code: 'web_risk',
    severity: 'danger',
    source: 'external',
    typology: 'brand_impersonation',
    action: 'do_not_click',
    vi: `Google Web Risk xếp link này vào danh sách nguy hiểm (${vi}).`,
    en: `Google Web Risk lists this link as dangerous (${en}).`,
  };
}

export const NEW_DOMAIN_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Registration date from RDAP, or null when the registry does not answer (many ccTLDs, including .vn). */
export async function domainRegisteredAt(domain: string, fetchFn: FetchLike): Promise<Date | null> {
  const data = (await getJson(fetchFn, `https://rdap.org/domain/${encodeURIComponent(domain)}`)) as
    | { events?: { eventAction?: string; eventDate?: string }[] }
    | null;
  const date = data?.events?.find((e) => e.eventAction === 'registration')?.eventDate;
  const parsed = date ? new Date(date) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

export function domainAgeReason(domain: string, registeredAt: Date | null, now: Date = new Date()): Reason | null {
  if (!registeredAt) return null;
  const days = Math.floor((now.getTime() - registeredAt.getTime()) / DAY_MS);
  if (days < 0 || days >= NEW_DOMAIN_DAYS) return null;
  return {
    code: 'new_domain',
    severity: 'warning',
    source: 'external',
    action: 'do_not_click',
    vi: `Tên miền ${domain} mới đăng ký ${days} ngày trước. Trang lừa đảo thường dùng tên miền vừa tạo.`,
    en: `${domain} was registered ${days} days ago. Scam sites usually use freshly created domains.`,
  };
}
