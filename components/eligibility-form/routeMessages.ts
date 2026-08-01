import { getEnhancedGrantHeadline } from "@/config/funding";
import type { FundingRoute } from "@/lib/types";

/**
 * Indicative, non-committal language only -- never "you qualify", "approved"
 * or a guaranteed figure. See CLAUDE.md's funding wording rules and
 * docs/ELIGIBILITY_LOGIC.md.
 */
export function getRouteMessage(route: FundingRoute): { headline: string; copy: string } {
  switch (route) {
    case "potential_enhanced_bus":
      return {
        headline: "You May Be Eligible for the Enhanced Boiler Upgrade Scheme Route",
        copy: `Your answers indicate a potential enhanced Boiler Upgrade Scheme route for an off-gas-grid property replacing oil or LPG heating. ${getEnhancedGrantHeadline()} Further property and scheme assessment is required, and the amount remains subject to the relevant technology, property circumstances, scheme period, installer assessment and applicable rules.`,
      };
    case "potential_standard_bus":
      return {
        headline: "You May Be Eligible for a Standard Boiler Upgrade Scheme Route",
        copy: "Your answers indicate a potential Boiler Upgrade Scheme route for your existing heating replacement. Funding remains subject to scheme rules, assessment and approval.",
      };
    case "potential_green_homes_wales":
      return {
        headline: "You May Be Eligible for Green Homes Wales Funding",
        copy: "Your answers indicate a potential route to Green Homes Wales interest-free funding. Funding remains subject to scheme rules, assessment and approval.",
      };
    case "potential_both_routes":
      return {
        headline: "Potential BUS Grant + Green Homes Wales Funding",
        copy: "Your answers indicate you may potentially access both the Boiler Upgrade Scheme and Green Homes Wales funding. These routes may potentially be combined, but the installer, finance provider and relevant scheme administrators must confirm eligibility and compatibility.",
      };
    case "manual_review":
      return {
        headline: "Your Enquiry Needs a Quick Manual Review",
        copy: "Some of your answers need a closer look before we can indicate a route. A member of the team will review your enquiry and explain which options may still be available.",
      };
    case "outside_welsh_service_area":
      return {
        headline: "Outside Our Current Welsh Service Area",
        copy: "Your answers indicate a property located outside Wales, which is outside this service's current coverage area. A member of the team will confirm whether we can still help.",
      };
    case "unlikely_eligible":
      return {
        headline: "This Particular Scheme May Not Be the Best Match",
        copy: "Based on your answers, you may not currently match the initial criteria for Green Homes Wales or the Boiler Upgrade Scheme. Other support options may still be available, so a member of the team will follow up.",
      };
  }
}
