// Text helpers. Scam messages are attacker-written, so everything here treats
// input as data: strip invisible characters, cap length, fold diacritics.

export const MAX_INPUT_CHARS = 4000;

// Zero-width and bidi control characters used to hide text from people but not machines.
const INVISIBLE = /[\u00AD\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF]/g;

export function sanitizeInput(input: string): string {
  return input.replace(INVISIBLE, '').replace(/\r\n?/g, '\n').slice(0, MAX_INPUT_CHARS).trim();
}

/** Lowercase, remove Vietnamese diacritics (đ -> d) and collapse whitespace, for rule matching. */
export function foldVietnamese(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
