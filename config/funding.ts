/**
 * Central configuration for the £9,000 vs £7,500 Boiler Upgrade Scheme
 * wording. CLAUDE.md -> "CRITICAL FUNDING WORDING RULES" requires this to be
 * a single config/date switch, not hardcoded copy scattered through the UI.
 *
 * To change the activation date or retire the enhanced-grant messaging,
 * update ENHANCED_GRANT_ACTIVE_DATE (env var) or this file only.
 */

const DEFAULT_ENHANCED_GRANT_ACTIVE_DATE = "2026-07-21";

export const ENHANCED_GRANT_ACTIVE_DATE =
  process.env.ENHANCED_GRANT_ACTIVE_DATE || DEFAULT_ENHANCED_GRANT_ACTIVE_DATE;

export function isEnhancedGrantActive(now: Date = new Date()): boolean {
  return now.getTime() >= new Date(ENHANCED_GRANT_ACTIVE_DATE).getTime();
}

/** Hero / funding-card headline copy — switches at the activation date. */
export function getEnhancedGrantHeadline(now: Date = new Date()): string {
  return isEnhancedGrantActive(now)
    ? "Check whether your home could qualify for up to £9,000 towards an eligible heat pump."
    : "Up to £9,000 available from 21 July 2026 for eligible off-gas-grid homes.";
}

/** Long-form accurate wording used in body copy / eligibility sections. */
export const FUNDING_BODY_COPY =
  "Eligible homeowners may receive £7,500 towards an air-source or ground-source heat pump. From 21 July 2026, eligible off-gas-grid homes replacing oil or LPG heating may qualify for an increased grant of £9,000.";

export const BOILER_UPGRADE_SCHEME_NOTICE =
  "The £9,000 grant is not available to every applicant. From 21 July 2026, it applies to specific eligible off-gas-grid properties replacing oil or LPG with an eligible heat pump. Other qualifying installations may receive £7,500.";

export const GREEN_HOMES_WALES_FUNDING_COPY =
  "Interest-free Green Homes Wales funding from £1,000 to £25,000, subject to status, affordability, credit checks, scheme criteria and final approval.";

export const RETROFIT_SUPPORT_COPY =
  "Fully funded expert retrofit assessment and coordination support may be available through Green Homes Wales.";

/**
 * Whether a specific lead's answers currently qualify for the enhanced
 * £9,000 messaging (Result A), vs. the standard £7,500 messaging (Result B).
 * Off-gas-grid + oil/LPG heating is required by the scheme AND the
 * activation date must have passed.
 */
export function qualifiesForEnhancedGrant(input: {
  onMainsGas: boolean | null;
  currentHeating: string | null;
  now?: Date;
}): boolean {
  const { onMainsGas, currentHeating, now } = input;
  const isOffGasGrid = onMainsGas === false;
  const isOilOrLpg = currentHeating === "heating_oil" || currentHeating === "lpg";
  return isEnhancedGrantActive(now) && isOffGasGrid && isOilOrLpg;
}
