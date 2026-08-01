/**
 * Legal entity details for the footer disclaimer. Trading name and contact
 * details are already confirmed; the remaining fields are genuinely unknown
 * until the client supplies them -- do not invent placeholder-looking real
 * values. See scripts/check-production-readiness.mjs, which fails a real
 * Vercel production deployment (VERCEL_ENV=production) if these are still
 * unset, so this can't ship silently.
 */
export const TRADING_NAME = "First Time Central Heating Wales";

export const LEGAL_ENTITY_NAME = process.env.LEGAL_ENTITY_NAME || null;
export const COMPANY_NUMBER = process.env.COMPANY_NUMBER || null;
export const REGISTERED_ADDRESS = process.env.REGISTERED_ADDRESS || null;
export const ICO_REGISTRATION_NUMBER = process.env.ICO_REGISTRATION_NUMBER || null;

export const isLegalEntityConfigured = Boolean(
  LEGAL_ENTITY_NAME && COMPANY_NUMBER && REGISTERED_ADDRESS,
);

export function getLegalEntityLine(): string {
  if (isLegalEntityConfigured) {
    return `${LEGAL_ENTITY_NAME} (company number ${COMPANY_NUMBER}), registered office ${REGISTERED_ADDRESS}.`;
  }
  return "LEGAL ENTITY DETAILS NOT YET CONFIGURED -- set LEGAL_ENTITY_NAME, COMPANY_NUMBER and REGISTERED_ADDRESS before production launch.";
}
