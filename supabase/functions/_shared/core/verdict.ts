// Combine rule hits, official lists and community reports into one answer.
// Unknown is the default. Nothing here can produce "safe".

import type { ActionCode, CommunitySignal, Entity, Reason, Typology, Verdict, VerdictLevel } from './types.ts';

const SEVERITY_RANK: Record<Reason['severity'], number> = { danger: 3, warning: 2, info: 1, official: 0 };

/** A verified phone report this old may be about a number the carrier has since given to someone else. */
export const PHONE_REPORT_STALE_DAYS = 365;

const DAY_MS = 24 * 60 * 60 * 1000;

export function communityReasons(entity: Entity, signal: CommunitySignal, now: Date = new Date()): Reason[] {
  if (!signal.found) return [];
  const label = entity.kind === 'bank_account' ? 'tài khoản' : entity.kind === 'phone' ? 'số' : entity.kind === 'email' ? 'email' : 'trang';
  const labelEn = entity.kind === 'bank_account' ? 'account' : entity.kind === 'phone' ? 'number' : entity.kind === 'email' ? 'email' : 'site';
  const reasons: Reason[] = [];

  if (signal.verifiedReports > 0) {
    const ageDays = signal.lastVerifiedAt ? (now.getTime() - new Date(signal.lastVerifiedAt).getTime()) / DAY_MS : 0;
    const stale = entity.kind === 'phone' && ageDays > PHONE_REPORT_STALE_DAYS;
    reasons.push({
      code: stale ? 'community_verified_stale' : 'community_verified',
      severity: stale ? 'warning' : 'danger',
      source: 'community_verified',
      action: entity.kind === 'bank_account' ? 'do_not_transfer' : entity.kind === 'url' ? 'do_not_click' : 'hang_up_call_official',
      vi: stale
        ? `Có ${signal.verifiedReports} báo cáo lừa đảo đã được kiểm duyệt xác minh về ${label} này, nhưng đã hơn một năm; số có thể đã đổi chủ.`
        : `Có ${signal.verifiedReports} báo cáo lừa đảo đã được kiểm duyệt xác minh về ${label} này.`,
      en: stale
        ? `${signal.verifiedReports} moderator-verified scam report(s) about this ${labelEn}, but over a year old; the number may have a new owner.`
        : `${signal.verifiedReports} moderator-verified scam report(s) about this ${labelEn}.`,
    });
  }
  if (signal.unverifiedReporters > 0) {
    const several = signal.unverifiedReporters >= 2;
    reasons.push({
      code: 'community_unverified',
      severity: several ? 'warning' : 'info',
      source: 'community_unverified',
      vi: `${signal.unverifiedReporters} người đã báo cáo ${label} này, chưa được kiểm duyệt xác minh.`,
      en: `${signal.unverifiedReporters} people reported this ${labelEn}; not yet verified by a moderator.`,
    });
  }
  return reasons;
}

export interface DecideInput {
  reasons: Reason[];
  /** True when the community lookup failed, so the answer says it could not check. */
  lookupFailed?: boolean;
}

export const MAX_REASONS_SHOWN = 3;

export function decide({ reasons, lookupFailed }: DecideInput): Verdict {
  const all = [...reasons];
  const hasOfficial = all.some((r) => r.severity === 'official');
  // An official domain cannot be pushed to "warning" by unverified reports alone: anyone can mass-report a bank's real site.
  const effective = hasOfficial ? all.filter((r) => r.source !== 'community_unverified') : all;

  if (lookupFailed) {
    effective.push({
      code: 'lookup_failed',
      severity: 'info',
      source: 'system',
      vi: 'Chưa tra được dữ liệu cộng đồng lúc này, nên kết luận chỉ dựa trên dấu hiệu trong nội dung.',
      en: 'Community data could not be checked right now, so this answer only uses signals in the content.',
    });
  }

  const top = effective.reduce((max, r) => Math.max(max, SEVERITY_RANK[r.severity]), 0);
  let level: VerdictLevel;
  if (top === 3) level = 'danger';
  else if (top === 2) level = 'warning';
  else if (hasOfficial) level = 'official';
  else level = 'unknown';

  const sorted = effective
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const rank = (x: Reason) => (x.severity === 'official' && level === 'official' ? 4 : SEVERITY_RANK[x.severity]);
      return rank(b.r) - rank(a.r) || a.i - b.i;
    })
    .map(({ r }) => r);

  const lead = sorted.find((r) => r.severity === 'danger' || r.severity === 'warning');
  const typology: Typology = lead?.typology ?? sorted.find((r) => r.typology)?.typology ?? 'unknown';
  let action: ActionCode;
  if (lead?.action) action = lead.action;
  else if (level === 'official') action = 'never_share_otp';
  else action = sorted.find((r) => r.action)?.action ?? 'verify_official';

  return { level, typology, reasons: sorted.slice(0, MAX_REASONS_SHOWN), action };
}
