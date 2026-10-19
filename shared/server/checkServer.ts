// Server-side check: the shared core plus signals the browser cannot get
// (Web Risk, domain age, the model). Dependencies are injected so tests and
// the Cloudflare Worker share this code.

import { runCheck, type CheckResult, type CommunityLookup } from '../core/check.ts';
import { decide } from '../core/verdict.ts';
import type { Reason } from '../core/types.ts';
import { assessmentReason, type AnalyzeInput, type Assessment } from './llm.ts';

export interface ServerCheckInput {
  text: string;
  bankCode?: string;
  image?: AnalyzeInput['image'];
}

export interface ServerCheckDeps {
  lookup: CommunityLookup;
  /** Web Risk lookup for one URL; omit when no API key is configured. */
  webRisk?: (url: string) => Promise<Reason | null>;
  /** Domain-age reason for one registrable domain; omit to skip. */
  domainAge?: (domain: string) => Promise<Reason | null>;
  /** Model call; omit when no model is configured. */
  analyze?: (input: AnalyzeInput) => Promise<Assessment | null>;
  /** Returns false when today's budget for this kind of call is used up. */
  allow?: (kind: 'llm' | 'vision') => Promise<boolean>;
  now?: Date;
}

export interface ServerCheckResult extends CheckResult {
  extractedText?: string;
  ai: { used: boolean; skipped?: 'not_configured' | 'budget' | 'failed' | 'not_needed' };
}

const MAX_EXTERNAL_URLS = 3;

export async function serverCheck(input: ServerCheckInput, deps: ServerCheckDeps): Promise<ServerCheckResult> {
  const allow = deps.allow ?? (async () => true);
  let extractedText: string | undefined;
  let assessment: Assessment | null = null;
  let ai: ServerCheckResult['ai'] = { used: false, skipped: deps.analyze ? 'not_needed' : 'not_configured' };

  // 1. Screenshots: the model reads the text first, so the fixed rules can run on it.
  if (input.image) {
    if (!deps.analyze) {
      ai = { used: false, skipped: 'not_configured' };
    } else if (!(await allow('vision'))) {
      ai = { used: false, skipped: 'budget' };
    } else {
      assessment = await deps.analyze({ text: input.text, image: input.image, knownFindings: [] }).catch(() => null);
      ai = assessment ? { used: true } : { used: false, skipped: 'failed' };
      extractedText = assessment?.extractedText || undefined;
    }
  }

  const text = [input.text, extractedText].filter(Boolean).join('\n');
  const base = await runCheck(text, deps.lookup, { bankCode: input.bankCode, now: deps.now });
  const reasons: Reason[] = [...base.allReasons];

  // 2. Link reputation.
  const urls = base.entities.filter((e) => e.kind === 'url' && e.url && e.domain).slice(0, MAX_EXTERNAL_URLS);
  const external = await Promise.all(
    urls.flatMap((e) => [
      deps.webRisk ? deps.webRisk(e.url!).catch(() => null) : Promise.resolve(null),
      deps.domainAge ? deps.domainAge(e.domain!).catch(() => null) : Promise.resolve(null),
    ]),
  );
  reasons.push(...external.filter((r): r is Reason => r !== null));

  // 3. Messages without a screenshot: ask the model only when there is something to read.
  if (!input.image && base.isMessage && deps.analyze) {
    if (!(await allow('llm'))) {
      ai = { used: false, skipped: 'budget' };
    } else {
      assessment = await deps
        .analyze({ text, knownFindings: reasons.filter((r) => r.severity !== 'info').map((r) => r.en) })
        .catch(() => null);
      ai = assessment ? { used: true } : { used: false, skipped: 'failed' };
    }
  }

  const aiReason = assessment ? assessmentReason(assessment) : null;
  if (aiReason) reasons.push(aiReason);

  const verdict = decide({ reasons, lookupFailed: base.lookupFailed });
  return { ...base, input: text, verdict, allReasons: reasons, extractedText, ai };
}
