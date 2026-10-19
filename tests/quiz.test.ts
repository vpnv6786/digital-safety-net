import { describe, expect, it } from 'vitest';
import { QUIZ, QUIZ_ROUND } from '../src/data/quiz';
import { runCheck, type CommunitySignal } from '@core/index.ts';

const none = async (): Promise<CommunitySignal> => ({
  found: false,
  verifiedReports: 0,
  unverifiedReporters: 0,
  lastVerifiedAt: null,
  lastReportAt: null,
  categories: [],
});

describe('practice items', () => {
  it('has enough items, unique ids, and both kinds', () => {
    expect(QUIZ.length).toBeGreaterThanOrEqual(QUIZ_ROUND);
    expect(new Set(QUIZ.map((q) => q.id)).size).toBe(QUIZ.length);
    expect(QUIZ.some((q) => q.scam)).toBe(true);
    expect(QUIZ.some((q) => !q.scam)).toBe(true);
  });

  // The practice teaches the same signs the checker uses; they must agree.
  it('agrees with the checker on every item', async () => {
    for (const q of QUIZ) {
      const level = (await runCheck(q.message, none)).verdict.level;
      const alarmed = level === 'danger' || level === 'warning';
      expect(alarmed, `${q.id}: checker said ${level}`).toBe(q.scam);
    }
  });
});
