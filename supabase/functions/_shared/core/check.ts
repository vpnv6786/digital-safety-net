// The whole check, minus I/O: the caller supplies a lookup function, so the web
// app can call the database RPC and an Edge Function can call it server-side.

import type { CommunitySignal, Entity, Reason, Verdict } from './types.ts';
import { classifyInput } from './normalize.ts';
import { evaluateEntity, evaluateText } from './rules.ts';
import { communityReasons, decide } from './verdict.ts';

export type CommunityLookup = (entity: Entity) => Promise<CommunitySignal>;

export interface CheckResult {
  input: string;
  isMessage: boolean;
  entities: Entity[];
  verdict: Verdict;
  /** Every reason found, before trimming to the few shown first. */
  allReasons: Reason[];
  /** True when at least one community lookup failed. */
  lookupFailed: boolean;
}

export async function runCheck(raw: string, lookup: CommunityLookup, opts: { bankCode?: string; now?: Date } = {}): Promise<CheckResult> {
  const { text, isMessage, entities } = classifyInput(raw, opts.bankCode);
  const reasons: Reason[] = [];

  if (isMessage) reasons.push(...evaluateText(text, entities.some((e) => e.kind === 'url')));
  for (const entity of entities) reasons.push(...evaluateEntity(entity));

  let lookupFailed = false;
  const signals = await Promise.all(
    entities.map(async (entity) => {
      try {
        return { entity, signal: await lookup(entity) };
      } catch {
        lookupFailed = true;
        return null;
      }
    }),
  );
  for (const s of signals) if (s) reasons.push(...communityReasons(s.entity, s.signal, opts.now));

  const verdict = decide({ reasons, lookupFailed });
  return { input: text, isMessage, entities, verdict, allReasons: reasons, lookupFailed };
}
