import { qualifiesForEnhancedGrant } from "@/config/funding";
import type { EligibilityFormState, LeadResult } from "@/lib/types";

/**
 * Maps the CLAUDE.md "LEAD SCORING LOGIC" + "DYNAMIC RESULT PAGES" sections
 * onto a single result. Two assumptions not made fully explicit in the
 * brief:
 *  - "Out of Wales" reuses Result E copy (not currently eligible) but is
 *    tagged "Out of Area" for Privyr, so it is still recorded separately.
 *  - A non-owner who isn't a landlord (i.e. answered "No") isn't listed
 *    under any scoring bucket, so they fall through to Result E.
 */
export function determineResult(form: EligibilityFormState, now: Date = new Date()): LeadResult {
  const { step1, step2, step3 } = form;
  const tags: string[] = [];

  if (step1.inWales === "no") {
    return { result: "E", priority: "out_of_area", tags: ["Out of Area"] };
  }

  const isOwner = step1.ownership === "yes" || step1.ownership === "joint_owner";
  const isLandlord = step1.ownership === "landlord";
  const isMainResidence = step1.mainResidence === "yes";
  const isListed = step3.listed === "yes";
  const isNewBuild = step3.propertyAge === "within_6_months";
  const isFlat = step3.propertyType === "flat";
  const hasExistingHeatPump = step2.currentHeating === "existing_heat_pump";
  const heatingUnsure = step2.currentHeating === "not_sure";
  const uncertainOwnership = step1.ownership === null;

  const manualReviewReasons: string[] = [];
  if (isListed) manualReviewReasons.push("Listed property");
  if (isNewBuild) manualReviewReasons.push("New build");
  if (isLandlord) manualReviewReasons.push("Landlord or Ownership Issue");
  if (hasExistingHeatPump) manualReviewReasons.push("Existing Heat Pump");
  if (uncertainOwnership) manualReviewReasons.push("Uncertain ownership");
  if (isFlat) manualReviewReasons.push("Flat or mixed-use building");
  if (heatingUnsure) manualReviewReasons.push("Unsure about existing heating");

  if (manualReviewReasons.length > 0) {
    return { result: "D", priority: "manual_review", tags: manualReviewReasons };
  }

  const isReplacing =
    step2.replacementTimescale === "asap" ||
    step2.replacementTimescale === "within_3_months" ||
    step2.replacementTimescale === "within_6_months";

  const wantsHeatPump =
    step3.improvements.includes("air_source_heat_pump") ||
    step3.improvements.includes("ground_source_heat_pump");

  const isOffGasGrid = step2.onMainsGas === "no";
  const isOilOrLpg = step2.currentHeating === "heating_oil" || step2.currentHeating === "lpg";

  const isHighPriorityEnhancedBus =
    isOwner &&
    isMainResidence &&
    isOffGasGrid &&
    isOilOrLpg &&
    isReplacing &&
    wantsHeatPump;

  if (isHighPriorityEnhancedBus) {
    const enhancedActive = qualifiesForEnhancedGrant({
      onMainsGas: false,
      currentHeating: step2.currentHeating,
      now,
    });
    tags.push("Enhanced BUS - Oil/LPG - High Priority");
    return {
      result: enhancedActive ? "A" : "B",
      priority: "high",
      tags,
    };
  }

  const isStandardBus =
    isOwner &&
    isReplacing &&
    (step2.currentHeating === "mains_gas" ||
      step2.currentHeating === "electric_storage" ||
      step2.currentHeating === "direct_electric" ||
      step2.currentHeating === "coal" ||
      step2.currentHeating === "biomass" ||
      step2.currentHeating === "other") &&
    wantsHeatPump;

  if (isStandardBus) {
    return { result: "B", priority: "standard", tags: ["Standard BUS - Potentially Eligible"] };
  }

  const nonHeatPumpImprovements = step3.improvements.filter(
    (i) => i !== "air_source_heat_pump" && i !== "ground_source_heat_pump" && i !== "not_sure",
  );
  const isGreenHomesWalesLead =
    isOwner &&
    isMainResidence &&
    (nonHeatPumpImprovements.length >= 2 || step3.improvements.length > 0);

  if (isGreenHomesWalesLead) {
    const extraTags: string[] = ["Green Homes Wales - Funding Interest"];
    if (
      step3.improvements.includes("solar_panels") ||
      step3.improvements.includes("battery_storage")
    ) {
      extraTags.push("Solar and Battery Interest");
    }
    if (step3.improvements.includes("insulation")) {
      extraTags.push("Retrofit and Insulation Interest");
    }
    return { result: "C", priority: "standard", tags: extraTags };
  }

  return { result: "E", priority: "low", tags: ["Not Currently Eligible"] };
}
