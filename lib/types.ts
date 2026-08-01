export type PropertyLocation = "wales" | "england" | "scotland" | "northern_ireland" | "other";

export type OwnershipStatus =
  | "sole_owner"
  | "joint_owner"
  | "private_landlord"
  | "social_landlord"
  | "business_owned"
  | "tenant"
  | "other";

export type OccupancyStatus =
  | "main_residence"
  | "second_home"
  | "holiday_home"
  | "rental_property"
  | "commercial"
  | "other";

export type YesNoNotSure = "yes" | "no" | "not_sure";
export type YesNo = "yes" | "no";

export type ExistingHeating =
  | "mains_gas"
  | "oil"
  | "lpg"
  | "coal"
  | "direct_electric"
  | "storage_heaters"
  | "existing_heat_pump"
  | "other";

export type PropertyType =
  | "detached_house"
  | "semi_detached_house"
  | "terraced_house"
  | "bungalow"
  | "flat"
  | "maisonette"
  | "other";

/** Standardised, case-sensitive values -- also used verbatim as the Privyr
 * "funding_route" field, so these strings must never be altered ad hoc. */
export type FundingRoute =
  | "potential_enhanced_bus"
  | "potential_standard_bus"
  | "potential_green_homes_wales"
  | "potential_both_routes"
  | "manual_review"
  | "outside_welsh_service_area"
  | "unlikely_eligible";

export interface QualificationAnswers {
  propertyLocation: PropertyLocation | null;
  ownershipStatus: OwnershipStatus | null;
  occupancyStatus: OccupancyStatus | null;
  listedProperty: YesNoNotSure | null;
  newBuildUnderSixMonths: YesNo | null;
  mainsGasGrid: YesNoNotSure | null;
  existingHeating: ExistingHeating | null;
  propertyType: PropertyType | null;
  postcode: string;
}

export interface ContactAnswers {
  fullName: string;
  phone: string;
  email: string;
}

export interface ConsentAnswers {
  enquiryConsent: boolean;
  marketingConsent: boolean;
}

export interface EligibilityFormState {
  qualification: QualificationAnswers;
  contact: ContactAnswers;
  consent: ConsentAnswers;
}

export interface AttributionData {
  landingUrl: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  firstVisitAt: string | null;
}

export interface LeadSubmission extends EligibilityFormState {
  attribution: AttributionData;
  honeypot?: string;
  formLoadedAt?: number;
  submissionId: string;
  turnstileToken?: string;
}

export interface EligibilityResult {
  fundingRoute: FundingRoute;
  reasons: string[];
}
