import { describe, expect, it } from 'vitest';
import { summarizeMetrics } from '../src/lib/metrics';

describe('summarizeMetrics', () => {
  it('computes the stop rate over risky answers only', () => {
    const s = summarizeMetrics([
      { day: '2026-10-18', kind: 'verdict:danger', count: 10 },
      { day: '2026-10-19', kind: 'verdict:unknown', count: 30 },
      { day: '2026-10-19', kind: 'feedback:danger:stopped', count: 6 },
      { day: '2026-10-19', kind: 'feedback:warning:continued', count: 2 },
      { day: '2026-10-19', kind: 'feedback:warning:unsure', count: 2 },
      { day: '2026-10-19', kind: 'feedback:unknown:stopped', count: 50 },
      { day: '2026-10-19', kind: 'feedback:danger:wrong', count: 1 },
      { day: '2026-10-19', kind: 'llm', count: 4 },
    ]);
    expect(s.totalChecks).toBe(40);
    expect(s.stopRate).toBeCloseTo(0.6);
    expect(s.wrongRate).toBeCloseTo(1 / 61);
    expect(s.aiCalls).toBe(4);
  });

  it('reports no rate when nobody answered', () => {
    expect(summarizeMetrics([]).stopRate).toBeNull();
  });
});
