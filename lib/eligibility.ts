import type { EligibilityResult, QualificationAnswers } from "@/lib/types";

/**
 * Indicative marketing eligibility only -- never a formal grant decision.
 * See docs/ELIGIBILITY_LOGIC.md for the full rule table and worked examples.
 */
export function determineFundingRoute(answers: QualificationAnswers): EligibilityResult {
  const reasons: string[] = [];

  if (answers.propertyLocation !== "wales") {
    return {
      fundingRoute: "outside_welsh_service_area",
      reasons: ["Property is not located in Wales -- outside this service's current coverage area."],
    };
  }

  // Anything unusual or not safely categorisable goes to manual review,
  // rather than forcing a definitive automated decision. Matches CLAUDE.md's
  // manual-review trigger list (listed / new build / landlord / existing
  // heat pump / uncertain ownership).
  const manualReviewTriggers: string[] = [];
  if (answers.listedProperty === "yes") manualReviewTriggers.push("Listed property");
  if (answers.listedProperty === "not_sure") manualReviewTriggers.push("Listed status not confirmed");
  if (answers.newBuildUnderSixMonths === "yes") manualReviewTriggers.push("New build within the last six months");
  if (answers.ownershipStatus === "private_landlord") manualReviewTriggers.push("Private landlord");
  if (answers.ownershipStatus === "social_landlord") manualReviewTriggers.push("Social landlord");
  if (answers.ownershipStatus === "other") manualReviewTriggers.push("Uncertain ownership status");
  if (answers.occupancyStatus === "other") manualReviewTriggers.push("Uncertain occupancy status");
  if (answers.existingHeating === "existing_heat_pump") manualReviewTriggers.push("Existing heat pump already installed");
  if (answers.existingHeating === "other") manualReviewTriggers.push("Existing heating system not specified");
  if (answers.propertyType === "other") manualReviewTriggers.push("Property type not specified");

  if (manualReviewTriggers.length > 0) {
    return { fundingRoute: "manual_review", reasons: manualReviewTriggers };
  }

  // Green Homes Wales: owner-occupier (sole/joint), main residence, not a
  // business. Second homes, holiday homes, rentals, commercial and business
  // ownership are excluded but are clear-cut, not ambiguous, so they don't
  // need manual review.
  const isOwner = answers.ownershipStatus === "sole_owner" || answers.ownershipStatus === "joint_owner";
  const isMainResidence = answers.occupancyStatus === "main_residence";
  const ghwEligible = isOwner && isMainResidence;
  if (ghwEligible) {
    reasons.push("Wales, owner-occupier, main residence -- may meet initial Green Homes Wales criteria.");
  }

  // Boiler Upgrade Scheme: independent of GHW eligibility, EXCEPT a tenant
  // cannot authorise or receive a grant for a property they don't own --
  // without that gate, "tenant" would still fall into a BUS route purely
  // from their heating answer, which is never correct.
  const canApplyForBus = answers.ownershipStatus !== "tenant";
  const isOilOrLpg = answers.existingHeating === "oil" || answers.existingHeating === "lpg";
  const isOffGasGrid = answers.mainsGasGrid === "no";
  const isEnhancedBus = canApplyForBus && isOilOrLpg && isOffGasGrid;
  const isStandardBusHeating =
    answers.existingHeating === "mains_gas" ||
    answers.existingHeating === "coal" ||
    answers.existingHeating === "direct_electric" ||
    answers.existingHeating === "storage_heaters" ||
    (isOilOrLpg && !isOffGasGrid);
  const isStandardBus = canApplyForBus && !isEnhancedBus && isStandardBusHeating;

  if (isEnhancedBus) {
    reasons.push("Off-gas-grid property replacing oil or LPG -- may meet initial enhanced Boiler Upgrade Scheme criteria.");
  } else if (isStandardBus) {
    reasons.push("Existing heating system may qualify for a standard Boiler Upgrade Scheme replacement.");
  }

  const hasBusRoute = isEnhancedBus || isStandardBus;

  if (hasBusRoute && ghwEligible) {
    return { fundingRoute: "potential_both_routes", reasons };
  }
  if (isEnhancedBus) {
    return { fundingRoute: "potential_enhanced_bus", reasons };
  }
  if (isStandardBus) {
    return { fundingRoute: "potential_standard_bus", reasons };
  }
  if (ghwEligible) {
    return { fundingRoute: "potential_green_homes_wales", reasons };
  }

  return {
    fundingRoute: "unlikely_eligible",
    reasons: ["Answers do not currently indicate a match for Green Homes Wales or the Boiler Upgrade Scheme."],
  };
}
