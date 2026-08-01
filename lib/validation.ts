import { parsePhoneNumberFromString } from "libphonenumber-js";

// Letters (any script), spaces, apostrophes, hyphens -- deliberately not
// ASCII-only, so names like "Siân", "O'Brien" or "Llywelyn-Jones" validate.
const NAME_RE = /^[\p{L}][\p{L}\s'-]{1,98}[\p{L}]$/u;
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidFullName(raw: string): boolean {
  return NAME_RE.test(raw.trim());
}

/** Parses/validates a UK number (mobile or landline) via libphonenumber-js
 * rather than a simplistic regex/length check, per delivery requirements. */
export function isValidUkPhone(raw: string): boolean {
  const parsed = parsePhoneNumberFromString(raw, "GB");
  return Boolean(parsed?.isValid());
}

/** E.164 form (e.g. +447911123456) for storage/CRM delivery. Falls back to
 * the trimmed original if parsing fails validation upstream should already
 * have caught. */
export function normalizeUkPhone(raw: string): string {
  const parsed = parsePhoneNumberFromString(raw, "GB");
  return parsed?.isValid() ? parsed.number : raw.trim();
}

export function isValidUkPostcode(raw: string): boolean {
  return UK_POSTCODE_RE.test(raw.trim());
}

export function normalizeUkPostcode(raw: string): string {
  const compact = raw.trim().toUpperCase().replace(/\s+/g, "");
  return compact.length > 3 ? `${compact.slice(0, -3)} ${compact.slice(-3)}` : compact;
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(normalizeEmail(raw));
}
