// Mask personal data in free text before it leaves the database for an agent
// or a model: long digit runs (phone, account, ID numbers) keep only their last
// three digits; emails keep only their domain.

const DIGIT_RUN = /(?<![\p{L}\d])\+?\d(?:[\s.-]?\d){7,}(?![\p{L}\d])/gu;
const EMAIL = /[^\s@<>"']+@((?:[a-z0-9-]+\.)+[a-z]{2,})/gi;

export function redactPersonalData(text: string): string {
  return text
    .replace(EMAIL, (_m, domain: string) => `•••@${domain}`)
    .replace(DIGIT_RUN, (m) => `••••${m.replace(/\D/g, '').slice(-3)}`);
}
