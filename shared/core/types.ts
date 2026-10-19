// Shared types for the scam-check core. This folder is plain TypeScript with
// no platform APIs, so the web app (Vite), the Cloudflare Worker and the agents
// run exactly the same logic.

export type EntityKind = 'phone' | 'url' | 'bank_account' | 'email';

export interface Entity {
  kind: EntityKind;
  /** What the user typed or what was found in the text. */
  raw: string;
  /** Lookup key: E.164 for phones, host/path key for URLs, digits for bank accounts, lowercase email. */
  key: string;
  /** Bank short code when known (bank accounts only). */
  bankCode?: string;
  /** Normalised URL (URLs only). */
  url?: string;
  /** Registrable domain (URLs only). */
  domain?: string;
}

/** Four answers. There is deliberately no "safe": unknown is the default. */
export type VerdictLevel = 'danger' | 'warning' | 'unknown' | 'official';

export type ReasonSeverity = 'danger' | 'warning' | 'info' | 'official';

export type ReasonSource =
  | 'rule'
  | 'community_verified'
  | 'community_unverified'
  | 'official_list'
  | 'external'
  | 'ai'
  | 'system';

export type ActionCode =
  | 'do_not_transfer'
  | 'do_not_install'
  | 'never_share_otp'
  | 'hang_up_call_official'
  | 'do_not_click'
  | 'verify_in_person'
  | 'verify_official'
  | 'stop_recovery_offer';

export type Typology =
  | 'impersonate_authority'
  | 'fake_app_apk'
  | 'remote_control'
  | 'bank_phishing'
  | 'job_task'
  | 'investment'
  | 'prize'
  | 'delivery'
  | 'loan_fee'
  | 'recovery_scam'
  | 'brand_impersonation'
  | 'unknown';

export interface Reason {
  code: string;
  severity: ReasonSeverity;
  source: ReasonSource;
  vi: string;
  en: string;
  action?: ActionCode;
  typology?: Typology;
}

/** Aggregates returned by the lookup_entity RPC. Never contains reporter identities or report text. */
export interface CommunitySignal {
  found: boolean;
  verifiedReports: number;
  unverifiedReporters: number;
  lastVerifiedAt: string | null;
  lastReportAt: string | null;
  categories: string[];
  /** The owner has asked moderators to review the reports. */
  appealPending?: boolean;
}

export interface Verdict {
  level: VerdictLevel;
  typology: Typology;
  reasons: Reason[];
  action: ActionCode;
}
