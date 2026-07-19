const UK_MOBILE_RE = /^(?:\+44|0)7\d{9}$/;
const UK_POSTCODE_RE =
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeUkPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+44")) return digits;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return digits;
}

export function isValidUkMobile(raw: string): boolean {
  return UK_MOBILE_RE.test(raw.replace(/\s+/g, ""));
}

export function isValidUkPostcode(raw: string): boolean {
  return UK_POSTCODE_RE.test(raw.trim());
}

export function normalizeUkPostcode(raw: string): string {
  const compact = raw.trim().toUpperCase().replace(/\s+/g, "");
  return compact.length > 3
    ? `${compact.slice(0, -3)} ${compact.slice(-3)}`
    : compact;
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim());
}
