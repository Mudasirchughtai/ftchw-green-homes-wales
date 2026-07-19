export type YesNo = "yes" | "no";

export type OwnershipStatus = "yes" | "joint_owner" | "no" | "landlord";

export type CurrentHeating =
  | "heating_oil"
  | "lpg"
  | "mains_gas"
  | "electric_storage"
  | "direct_electric"
  | "coal"
  | "biomass"
  | "existing_heat_pump"
  | "no_central_heating"
  | "other"
  | "not_sure";

export type MainsGasConnection = "yes" | "no" | "not_sure";

export type ReplacementTimescale =
  | "asap"
  | "within_3_months"
  | "within_6_months"
  | "researching"
  | "not_sure";

export type PropertyType =
  | "detached"
  | "semi_detached"
  | "terraced"
  | "bungalow"
  | "flat"
  | "other";

export type PropertyAge =
  | "before_1900"
  | "1900_1949"
  | "1950_1979"
  | "1980_1999"
  | "2000_2020"
  | "within_6_months"
  | "not_sure";

export type ListedStatus = "yes" | "no" | "not_sure";

export type Improvement =
  | "air_source_heat_pump"
  | "ground_source_heat_pump"
  | "solar_panels"
  | "battery_storage"
  | "insulation"
  | "heating_controls"
  | "windows_glazing"
  | "lowering_bills"
  | "not_sure";

export type PreferredContactMethod = "telephone" | "whatsapp" | "sms" | "email";
export type BestContactTime = "morning" | "afternoon" | "evening" | "anytime";

export interface Step1Answers {
  inWales: YesNo | null;
  ownership: OwnershipStatus | null;
  mainResidence: YesNo | null;
}

export interface Step2Answers {
  currentHeating: CurrentHeating | null;
  onMainsGas: MainsGasConnection | null;
  replacementTimescale: ReplacementTimescale | null;
}

export interface Step3Answers {
  propertyType: PropertyType | null;
  propertyAge: PropertyAge | null;
  listed: ListedStatus | null;
  improvements: Improvement[];
}

export interface Step4Answers {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  postcode: string;
  addressLine1: string;
  preferredContactMethod: PreferredContactMethod | null;
  bestContactTime: BestContactTime | null;
}

export interface ConsentAnswers {
  serviceContactConsent: boolean;
  marketingConsent: boolean;
}

export interface EligibilityFormState {
  step1: Step1Answers;
  step2: Step2Answers;
  step3: Step3Answers;
  step4: Step4Answers;
  consent: ConsentAnswers;
}

export interface AttributionData {
  pageUrl: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  gclid: string | null;
}

export type ResultType = "A" | "B" | "C" | "D" | "E";

export type LeadPriority = "high" | "standard" | "manual_review" | "out_of_area" | "low";

export interface LeadSubmission extends EligibilityFormState {
  attribution: AttributionData;
  honeypot?: string;
}

export interface LeadResult {
  result: ResultType;
  priority: LeadPriority;
  tags: string[];
}
