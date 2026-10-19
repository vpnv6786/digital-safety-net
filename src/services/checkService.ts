import { supabase } from '@/integrations/supabase/client';
import { runCheck, type CheckResult, type CommunitySignal, type Entity, type Verdict } from '@core/index.ts';

export interface CheckOutcome extends CheckResult {
  /** Where the answer came from: the server (with link reputation and AI when configured) or this browser. */
  source: 'server' | 'browser';
  extractedText?: string | null;
  aiUsed?: boolean;
}

export interface ScreenshotInput {
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
  base64: string;
}

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

interface ServerReply {
  verdict: Verdict;
  entities: Entity[];
  isMessage: boolean;
  lookupFailed: boolean;
  extractedText: string | null;
  ai: { used: boolean };
}

export class ScreenshotUnavailableError extends Error {}

/**
 * Check a pasted message, number, link, email or account, or a screenshot.
 * Text checks fall back to the in-browser check when the server is unreachable;
 * screenshots need the server.
 */
export async function checkInput(raw: string, opts: { bankCode?: string; image?: ScreenshotInput } = {}): Promise<CheckOutcome> {
  const { data, error } = await supabase.functions.invoke<ServerReply>('check', {
    body: { text: raw, bankCode: opts.bankCode, image: opts.image },
  });
  if (!error && data?.verdict) {
    return {
      input: raw,
      isMessage: data.isMessage,
      entities: data.entities ?? [],
      verdict: data.verdict,
      allReasons: data.verdict.reasons,
      lookupFailed: data.lookupFailed,
      source: 'server',
      extractedText: data.extractedText,
      aiUsed: data.ai?.used,
    };
  }
  if (opts.image) throw new ScreenshotUnavailableError(error?.message ?? 'check function unavailable');
  const local = await runCheck(raw, lookupCommunity, { bankCode: opts.bankCode });
  return { ...local, source: 'browser' };
}

const MAX_SIDE = 1600;

/** Shrink a screenshot to at most 1600 px on its longest side and encode it as JPEG. */
export async function prepareScreenshot(file: File): Promise<ScreenshotInput> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return { mediaType: 'image/jpeg', base64: dataUrl.slice(dataUrl.indexOf(',') + 1) };
}
