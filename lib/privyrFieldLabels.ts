import type {
  ExistingHeating,
  FundingRoute,
  OccupancyStatus,
  OwnershipStatus,
  PropertyLocation,
  PropertyType,
} from "@/lib/types";

/**
 * Exact, case-sensitive display values used both in the Privyr
 * "funding_route" field and in human-readable notes. Do not introduce
 * variant casing/wording -- Privyr distribution rules filter on these
 * literal strings. See docs/PRIVYR_SETUP.md.
 */
export const FUNDING_ROUTE_LABELS: Record<FundingRoute, string> = {
  potential_enhanced_bus: "Potential £9k BUS",
  potential_standard_bus: "Potential Standard BUS",
  potential_green_homes_wales: "Green Homes Wales Finance",
  potential_both_routes: "Potential BUS + Green Homes Wales",
  manual_review: "Manual Review",
  outside_welsh_service_area: "Outside Welsh Service Area",
  unlikely_eligible: "Unlikely Eligible",
};

export const ELIGIBILITY_SUMMARY: Record<FundingRoute, string> = {
  potential_enhanced_bus: "Answers indicate a potential enhanced Boiler Upgrade Scheme route.",
  potential_standard_bus: "Answers indicate a potential standard Boiler Upgrade Scheme route.",
  potential_green_homes_wales: "Answers indicate potential access to Green Homes Wales interest-free funding.",
  potential_both_routes: "Answers indicate potential access to both the Boiler Upgrade Scheme and Green Homes Wales funding.",
  manual_review: "Answers require a manual review before a route can be indicated.",
  outside_welsh_service_area: "Property is outside Wales, outside this service's current coverage area.",
  unlikely_eligible: "Answers do not currently indicate a match for either scheme.",
};

export const PROPERTY_LOCATION_LABELS: Record<PropertyLocation, string> = {
  wales: "Wales",
  england: "England",
  scotland: "Scotland",
  northern_ireland: "Northern Ireland",
  other: "Other",
};

export const OWNERSHIP_LABELS: Record<OwnershipStatus, string> = {
  sole_owner: "Sole owner",
  joint_owner: "Joint owner",
  private_landlord: "Private landlord",
  social_landlord: "Social landlord",
  business_owned: "Business owned",
  tenant: "Tenant",
  other: "Other",
};

export const OCCUPANCY_LABELS: Record<OccupancyStatus, string> = {
  main_residence: "Main residence",
  second_home: "Second home",
  holiday_home: "Holiday home",
  rental_property: "Rental property",
  commercial: "Commercial",
  other: "Other",
};

export const HEATING_LABELS: Record<ExistingHeating, string> = {
  mains_gas: "Mains gas",
  oil: "Oil",
  lpg: "LPG",
  coal: "Coal",
  direct_electric: "Direct electric",
  storage_heaters: "Storage heaters",
  existing_heat_pump: "Existing heat pump",
  other: "Other",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  detached_house: "Detached house",
  semi_detached_house: "Semi-detached house",
  terraced_house: "Terraced house",
  bungalow: "Bungalow",
  flat: "Flat",
  maisonette: "Maisonette",
  other: "Other",
};

const YES_NO_LABELS: Record<string, string> = { yes: "Yes", no: "No", not_sure: "Not sure" };
export function yesNoLabel(value: string | null): string {
  return value ? (YES_NO_LABELS[value] ?? value) : "Not answered";
}
