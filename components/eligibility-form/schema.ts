import {
  ExistingHeating,
  OccupancyStatus,
  OwnershipStatus,
  PropertyLocation,
  PropertyType,
  YesNo,
  YesNoNotSure,
} from "@/lib/types";

export interface OptionDef<T extends string> {
  value: T;
  label: string;
}

export interface SingleChoiceQuestion<T extends string> {
  id: string;
  question: string;
  options: OptionDef<T>[];
}

/** 8 of the 11 total screens -- postcode, contact and consent are handled
 * as their own dedicated screen components in EligibilityForm. */
export const QUALIFICATION_QUESTIONS: [
  SingleChoiceQuestion<PropertyLocation>,
  SingleChoiceQuestion<OwnershipStatus>,
  SingleChoiceQuestion<OccupancyStatus>,
  SingleChoiceQuestion<YesNoNotSure>,
  SingleChoiceQuestion<YesNo>,
  SingleChoiceQuestion<YesNoNotSure>,
  SingleChoiceQuestion<ExistingHeating>,
  SingleChoiceQuestion<PropertyType>,
] = [
  {
    id: "propertyLocation",
    question: "Where is the property located?",
    options: [
      { value: "wales", label: "Wales" },
      { value: "england", label: "England" },
      { value: "scotland", label: "Scotland" },
      { value: "northern_ireland", label: "Northern Ireland" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "ownershipStatus",
    question: "What is your ownership status?",
    options: [
      { value: "sole_owner", label: "Sole owner" },
      { value: "joint_owner", label: "Joint owner" },
      { value: "private_landlord", label: "Private landlord" },
      { value: "social_landlord", label: "Social landlord" },
      { value: "business_owned", label: "Business owned" },
      { value: "tenant", label: "Tenant" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "occupancyStatus",
    question: "How is the property occupied?",
    options: [
      { value: "main_residence", label: "Main residence" },
      { value: "second_home", label: "Second home" },
      { value: "holiday_home", label: "Holiday home" },
      { value: "rental_property", label: "Rental property" },
      { value: "commercial", label: "Commercial" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "listedProperty",
    question: "Is the property a listed building?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "newBuildUnderSixMonths",
    question: "Was the property completed as a new build within the last six months?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "mainsGasGrid",
    question: "Is the property connected to the mains gas network?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "existingHeating",
    question: "How is the property currently heated?",
    options: [
      { value: "mains_gas", label: "Mains gas" },
      { value: "oil", label: "Oil" },
      { value: "lpg", label: "LPG" },
      { value: "coal", label: "Coal" },
      { value: "direct_electric", label: "Direct electric" },
      { value: "storage_heaters", label: "Storage heaters" },
      { value: "existing_heat_pump", label: "Existing heat pump" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "propertyType",
    question: "What type of property is it?",
    options: [
      { value: "detached_house", label: "Detached house" },
      { value: "semi_detached_house", label: "Semi-detached house" },
      { value: "terraced_house", label: "Terraced house" },
      { value: "bungalow", label: "Bungalow" },
      { value: "flat", label: "Flat" },
      { value: "maisonette", label: "Maisonette" },
      { value: "other", label: "Other" },
    ],
  },
];

// 8 qualification questions + postcode + contact + consent = 11 total.
export const TOTAL_SCREENS = QUALIFICATION_QUESTIONS.length + 3;
