// "What will you do now?" answers, counted per verdict level. Nothing else is kept.

export const FEEDBACK_CHOICES = ['stopped', 'continued', 'unsure', 'wrong'] as const;
export type FeedbackChoice = (typeof FEEDBACK_CHOICES)[number];
const LEVELS = ['danger', 'warning', 'unknown', 'official'];

/** Counter name for a feedback body, or null when it is not valid. */
export function feedbackCounter(feedback: unknown): string | null {
  if (!feedback || typeof feedback !== 'object') return null;
  const { level, choice } = feedback as { level?: unknown; choice?: unknown };
  if (typeof level !== 'string' || !LEVELS.includes(level)) return null;
  if (typeof choice !== 'string' || !(FEEDBACK_CHOICES as readonly string[]).includes(choice)) return null;
  return `feedback:${level}:${choice}`;
}

export const METRIC_LIMIT = 1_000_000_000;
