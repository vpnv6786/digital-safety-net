// Site-wide settings. The contact email is shown only once the owner sets
// VITE_CONTACT_EMAIL to an address they control.
export const SITE_NAME = 'Vệ Binh Mạng';
export const CONTACT_EMAIL: string | null = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || null;
