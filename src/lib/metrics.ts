export interface MetricRow {
  day: string;
  kind: string;
  count: number;
}

export interface MetricsSummary {
  checks: Record<string, number>;
  totalChecks: number;
  feedback: Record<string, Record<string, number>>;
  /** Of people who got "danger" or "warning" and answered, the share who said they would stop. */
  stopRate: number | null;
  /** Answers saying the result was wrong, as a share of all answers. */
  wrongRate: number | null;
  aiCalls: number;
}

export function summarizeMetrics(rows: MetricRow[]): MetricsSummary {
  const checks: Record<string, number> = {};
  const feedback: Record<string, Record<string, number>> = {};
  let aiCalls = 0;
  for (const r of rows) {
    const [type, level, choice] = r.kind.split(':');
    if (type === 'verdict' && level) checks[level] = (checks[level] ?? 0) + r.count;
    else if (type === 'feedback' && level && choice) {
      feedback[level] = feedback[level] ?? {};
      feedback[level][choice] = (feedback[level][choice] ?? 0) + r.count;
    } else if (r.kind === 'llm' || r.kind === 'vision') aiCalls += r.count;
  }
  const risky = ['danger', 'warning'].map((l) => feedback[l] ?? {});
  const stopped = risky.reduce((n, f) => n + (f.stopped ?? 0), 0);
  const decided = risky.reduce((n, f) => n + (f.stopped ?? 0) + (f.continued ?? 0) + (f.unsure ?? 0), 0);
  const allAnswers = Object.values(feedback).reduce((n, f) => n + Object.values(f).reduce((a, b) => a + b, 0), 0);
  const wrong = Object.values(feedback).reduce((n, f) => n + (f.wrong ?? 0), 0);
  return {
    checks,
    totalChecks: Object.values(checks).reduce((a, b) => a + b, 0),
    feedback,
    stopRate: decided ? stopped / decided : null,
    wrongRate: allAnswers ? wrong / allAnswers : null,
    aiCalls,
  };
}
