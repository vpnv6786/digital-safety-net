// Quality gate for the fixed rules (no model, no network). Run with `npm run eval`
// for the per-sample table. Raise the thresholds as rules improve; never lower
// them to make a change pass.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runCheck, type CommunitySignal } from '@core/index.ts';

interface Sample {
  id: string;
  label: 'scam' | 'legit';
  typology?: string;
  text: string;
}

const { samples } = JSON.parse(readFileSync(new URL('./golden.json', import.meta.url), 'utf8')) as { samples: Sample[] };
const none = async (): Promise<CommunitySignal> => ({
  found: false,
  verifiedReports: 0,
  unverifiedReporters: 0,
  lastVerifiedAt: null,
  lastReportAt: null,
  categories: [],
});

export const THRESHOLDS = {
  /** Share of scam samples answered "danger" or "warning". */
  scamAlarmRate: 0.9,
  /** Legitimate samples answered "danger": must stay at zero. */
  legitDanger: 0,
  /** Legitimate samples answered "warning". */
  legitWarningMax: 1,
};

describe('golden set (fixed rules only)', async () => {
  const results = await Promise.all(samples.map(async (s) => ({ s, level: (await runCheck(s.text, none)).verdict.level })));
  const scam = results.filter((r) => r.s.label === 'scam');
  const legit = results.filter((r) => r.s.label === 'legit');
  const alarm = (l: string) => l === 'danger' || l === 'warning';
  const scamAlarm = scam.filter((r) => alarm(r.level)).length / scam.length;
  const scamDanger = scam.filter((r) => r.level === 'danger').length / scam.length;

  console.table(results.map((r) => ({ id: r.s.id, label: r.s.label, level: r.level, text: r.s.text.slice(0, 60) })));
  console.log(
    `scam: ${(scamAlarm * 100).toFixed(0)}% flagged (${(scamDanger * 100).toFixed(0)}% danger); ` +
      `legit: ${legit.filter((r) => r.level === 'danger').length} danger, ${legit.filter((r) => r.level === 'warning').length} warning`,
  );

  it(`flags at least ${THRESHOLDS.scamAlarmRate * 100}% of scam samples`, () => {
    const missed = scam.filter((r) => !alarm(r.level)).map((r) => r.s.id);
    expect(scamAlarm, `missed: ${missed.join(', ')}`).toBeGreaterThanOrEqual(THRESHOLDS.scamAlarmRate);
  });

  it('never calls a legitimate message dangerous', () => {
    expect(legit.filter((r) => r.level === 'danger').map((r) => r.s.id)).toEqual([]);
  });

  it(`raises at most ${THRESHOLDS.legitWarningMax} warning on legitimate messages`, () => {
    expect(legit.filter((r) => r.level === 'warning').length).toBeLessThanOrEqual(THRESHOLDS.legitWarningMax);
  });
});
