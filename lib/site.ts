/**
 * NEXT_PUBLIC_SITE_URL is the single source of truth for canonical URLs.
 * Falls back to the Vercel-provided preview URL in dev/preview so links
 * still resolve, but that fallback must never be indexed -- see
 * isIndexableEnvironment().
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/**
 * True only on the approved production domain/deploy. Vercel sets
 * VERCEL_ENV to "production" only for the domain(s) assigned as
 * production; preview deployments (including the default
 * *.vercel.app URL) get "preview". Everything else (local dev) is
 * also non-indexable.
 */
export function isIndexableEnvironment(): boolean {
  return process.env.VERCEL_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
