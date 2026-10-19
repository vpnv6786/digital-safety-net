// Turn what people paste into stable lookup keys, so "0912 345 678",
// "+84912345678" and "84-912-345-678" are one phone, and "https://www.abc.com/"
// and "abc.com" are one website.

import type { Entity } from './types.ts';
import { foldVietnamese, sanitizeInput } from './text.ts';
import { findBankCode } from './banks.ts';

// Mobile prefixes renumbered from 11 to 10 digits in 2018.
const LEGACY_MOBILE_PREFIX: Record<string, string> = {
  '0120': '070', '0121': '079', '0122': '077', '0126': '076', '0128': '078',
  '0123': '083', '0124': '084', '0125': '085', '0127': '081', '0129': '082',
  '0162': '032', '0163': '033', '0164': '034', '0165': '035', '0166': '036',
  '0167': '037', '0168': '038', '0169': '039',
  '0186': '056', '0188': '058', '0199': '059',
};

export type PhoneType = 'mobile' | 'landline' | 'service' | 'international';

export interface NormalizedPhone {
  key: string;
  type: PhoneType;
}

export function normalizePhone(raw: string): NormalizedPhone | null {
  const s = raw.trim().replace(/[\s.\-()]/g, '');
  if (!/^\+?\d+$/.test(s)) return null;

  let national: string;
  if (s.startsWith('+')) {
    if (!s.startsWith('+84')) {
      const digits = s.slice(1);
      return digits.length >= 7 && digits.length <= 15 ? { key: `+${digits}`, type: 'international' } : null;
    }
    national = `0${s.slice(3)}`;
  } else if (s.startsWith('0084')) {
    national = `0${s.slice(4)}`;
  } else if (s.startsWith('84') && (s.length === 11 || s.length === 12)) {
    national = `0${s.slice(2)}`;
  } else {
    national = s;
  }

  if (/^1\d{2}$/.test(national) || /^(1800|1900)\d{4,6}$/.test(national)) {
    return { key: national, type: 'service' };
  }
  if (national.length === 11 && LEGACY_MOBILE_PREFIX[national.slice(0, 4)]) {
    national = LEGACY_MOBILE_PREFIX[national.slice(0, 4)] + national.slice(4);
  }
  if (/^0[35789]\d{8}$/.test(national)) return { key: `+84${national.slice(1)}`, type: 'mobile' };
  if (/^02\d{9}$/.test(national)) return { key: `+84${national.slice(1)}`, type: 'landline' };
  return null;
}

// Two-label public suffixes we meet in Vietnam. Not the full Public Suffix List:
// an unknown suffix falls back to "last two labels", which only makes keys coarser.
const MULTI_LABEL_SUFFIXES = new Set([
  'com.vn', 'net.vn', 'org.vn', 'edu.vn', 'gov.vn', 'ac.vn', 'info.vn', 'biz.vn', 'name.vn',
  'pro.vn', 'health.vn', 'int.vn', 'id.vn', 'io.vn',
  'co.uk', 'com.au', 'com.sg', 'co.jp', 'com.cn', 'com.hk', 'com.tw', 'co.th', 'com.my',
  'co.kr', 'co.id', 'com.ph', 'com.kh', 'com.la',
]);

// Platforms where every tenant gets a subdomain: the host is the unit, never the platform.
const SUBDOMAIN_TENANT_DOMAINS = new Set([
  'github.io', 'blogspot.com', 'wordpress.com', 'wixsite.com', 'weebly.com', 'vercel.app',
  'netlify.app', 'pages.dev', 'workers.dev', 'web.app', 'firebaseapp.com', 'herokuapp.com',
  'glitch.me', 'notion.site', 'canva.site', 'onrender.com', 'replit.app', 'ngrok-free.app',
  'azurewebsites.net', 'myshopify.com', 'webflow.io', 'framer.website', 'gitbook.io',
]);

// Platforms where every tenant gets a path: key on host + first path segments.
const PATH_TENANT_HOSTS: Record<string, number> = {
  'facebook.com': 1, 'fb.com': 1, 'fb.me': 1, 'm.me': 1, 'zalo.me': 1, 't.me': 1,
  'telegram.me': 1, 'tiktok.com': 1, 'instagram.com': 1, 'x.com': 1, 'twitter.com': 1,
  'youtube.com': 1, 'linktr.ee': 1, 'shopee.vn': 1, 'docs.google.com': 3, 'sites.google.com': 2,
  'drive.google.com': 3, 'forms.gle': 1, 'play.google.com': 3,
};

export const URL_SHORTENERS = new Set([
  'bit.ly', 'bitly.com', 'tinyurl.com', 'cutt.ly', 'rb.gy', 't.ly', 'is.gd', 'v.gd', 's.id',
  'shorturl.at', 'tiny.cc', 'ow.ly', 'rebrand.ly', 'goo.gl', 'shorten.asia', 'tinyurl.vn',
]);

export function isIpHost(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');
}

export function registrableDomain(host: string): string {
  if (isIpHost(host)) return host;
  const labels = host.split('.');
  if (labels.length <= 2) return host;
  const lastTwo = labels.slice(-2).join('.');
  return MULTI_LABEL_SUFFIXES.has(lastTwo) ? labels.slice(-3).join('.') : lastTwo;
}

export interface NormalizedUrl {
  url: string;
  host: string;
  domain: string;
  path: string;
  key: string;
}

export function normalizeUrl(raw: string): NormalizedUrl | null {
  let s = raw.trim().replace(/[.,;:!?)\]}'"]+$/, '');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^[^:/]+:\d+/.test(s)) return null; // javascript:, data:, mailto:
    s = `http://${s}`;
  }
  let parsed: URL;
  try {
    parsed = new URL(s);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

  const host = parsed.hostname.toLowerCase().replace(/\.$/, '').replace(/^(www\d?|m)\./, '');
  if (!isIpHost(host) && !/^([a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/.test(host)) return null;

  const port = parsed.port ? `:${parsed.port}` : '';
  const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '');
  const url = `${parsed.protocol}//${host}${port}${path || '/'}${parsed.search}`;
  const domain = registrableDomain(host);

  let key = domain;
  if (URL_SHORTENERS.has(host)) {
    key = `${host}${path}`;
  } else if (SUBDOMAIN_TENANT_DOMAINS.has(domain)) {
    key = host;
  } else {
    const segments = PATH_TENANT_HOSTS[host] ?? PATH_TENANT_HOSTS[domain];
    if (segments) {
      const parts = path.split('/').filter(Boolean).slice(0, segments);
      key = parts.length ? `${host}/${parts.join('/')}` : host;
    }
  }
  return { url, host, domain, path, key: key.toLowerCase() };
}

export function normalizeEmail(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  return /^[^\s@]+@([a-z0-9-]+\.)+[a-z]{2,}$/.test(s) ? s : null;
}

export function normalizeBankAccount(raw: string): string | null {
  const digits = raw.replace(/[\s.-]/g, '');
  return /^\d{6,19}$/.test(digits) ? digits : null;
}

/** Classify a single pasted value, or extract every entity from a pasted message. */
export function classifyInput(raw: string, bankCode?: string): { text: string; isMessage: boolean; entities: Entity[] } {
  const text = sanitizeInput(raw);
  if (!text) return { text, isMessage: false, entities: [] };

  if (!/\s/.test(text) || /^[+\d\s.\-()]+$/.test(text)) {
    const single = classifySingle(text, bankCode);
    if (single) return { text, isMessage: false, entities: [single] };
  }
  return { text, isMessage: true, entities: extractEntities(text) };
}

function classifySingle(value: string, bankCode?: string): Entity | null {
  const email = normalizeEmail(value);
  if (email) return { kind: 'email', raw: value, key: email };

  if (bankCode) {
    const account = normalizeBankAccount(value);
    if (account) return { kind: 'bank_account', raw: value, key: account, bankCode };
  }

  const phone = normalizePhone(value);
  if (phone) return { kind: 'phone', raw: value, key: phone.key };

  const account = normalizeBankAccount(value);
  if (account) return { kind: 'bank_account', raw: value, key: account };

  if (/[a-z0-9]\.[a-z]{2,}/i.test(value)) {
    const url = normalizeUrl(value);
    if (url) return { kind: 'url', raw: value, key: url.key, url: url.url, domain: url.domain };
  }
  return null;
}

const MAX_ENTITIES = 8;
const URL_PATTERN =
  /(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\b[a-z0-9][a-z0-9-]{0,62}(?:\.[a-z0-9-]{1,63})*\.(?:vn|com|net|org|info|xyz|top|online|site|shop|store|club|vip|cc|me|io|app|link|click|icu|buzz|live|pro|asia|biz|co|ly|gl|gd|id|tk|ml|ga|cf|gq|sbs|cfd|bond|lat)\b(?:\/[^\s<>"']*)?)/gi;
const PHONE_PATTERN = /(?<![\d+])(?:\+?84|0)(?:[\s.-]?\d){8,10}(?!\d)/g;
const EMAIL_PATTERN = /[^\s@<>"']+@(?:[a-z0-9-]+\.)+[a-z]{2,}/gi;
const ACCOUNT_LABEL = /(?:stk|so tai khoan|so tk|tai khoan|tk)\s*(?:so\s*)?[:-]?\s*(\d[\d\s.-]{4,24}\d)/g;

export function extractEntities(text: string): Entity[] {
  const found = new Map<string, Entity>();
  const add = (e: Entity) => {
    const id = `${e.kind}:${e.key}`;
    if (!found.has(id) && found.size < MAX_ENTITIES) found.set(id, e);
  };

  const emails: string[] = text.match(EMAIL_PATTERN) ?? [];
  for (const m of emails) {
    const email = normalizeEmail(m);
    if (email) add({ kind: 'email', raw: m, key: email });
  }
  const withoutEmails = emails.reduce((t, m) => t.replace(m, ' '), text);

  for (const m of withoutEmails.match(URL_PATTERN) ?? []) {
    if (/^\d+(\.\d+)+$/.test(m) && !/^\d{1,3}(\.\d{1,3}){3}$/.test(m)) continue; // "1.000.000" is money, not a host
    const url = normalizeUrl(m);
    if (url) add({ kind: 'url', raw: m, key: url.key, url: url.url, domain: url.domain });
  }

  const folded = foldVietnamese(withoutEmails);
  const labelledAccounts = new Set<string>();
  for (const m of folded.matchAll(ACCOUNT_LABEL)) {
    const account = normalizeBankAccount(m[1]);
    if (!account) continue;
    labelledAccounts.add(account);
    const window = folded.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + m[0].length + 60);
    add({ kind: 'bank_account', raw: m[1], key: account, bankCode: findBankCode(window) });
  }

  for (const m of withoutEmails.match(PHONE_PATTERN) ?? []) {
    const digits = m.replace(/\D/g, '');
    if (labelledAccounts.has(digits)) continue;
    const phone = normalizePhone(m);
    if (phone) add({ kind: 'phone', raw: m.trim(), key: phone.key });
  }
  return [...found.values()];
}
