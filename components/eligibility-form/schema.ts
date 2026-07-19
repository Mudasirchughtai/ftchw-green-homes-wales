import type {
  CurrentHeating,
  Improvement,
  ListedStatus,
  MainsGasConnection,
  OwnershipStatus,
  PropertyAge,
  PropertyType,
  ReplacementTimescale,
  YesNo,
} from "@/lib/types";

export interface OptionDef<T extends string> {
  value: T;
  label: string;
}

interface SingleQuestion<T extends string> {
  type: "single";
  id: string;
  stepNumber: 1 | 2 | 3;
  question: string;
  options: OptionDef<T>[];
}

interface MultiQuestion<T extends string> {
  type: "multi";
  id: string;
  stepNumber: 1 | 2 | 3;
  question: string;
  helpText?: string;
  options: OptionDef<T>[];
}

export type Question = SingleQuestion<string> | MultiQuestion<string>;

// CLAUDE.md -> "MULTI-STEP ELIGIBILITY FORM": one question per screen, with
// a visible "Step X of 4" indicator. stepNumber groups related questions
// under the same progress label while still rendering one question at a
// time.
export const QUESTIONS: Question[] = [
  {
    type: "single",
    id: "inWales",
    stepNumber: 1,
    question: "Is the property located in Wales?",
    options: [
      { value: "yes" satisfies YesNo, label: "Yes" },
      { value: "no" satisfies YesNo, label: "No" },
    ],
  },
  {
    type: "single",
    id: "ownership",
    stepNumber: 1,
    question: "Do you own the property?",
    options: [
      { value: "yes" satisfies OwnershipStatus, label: "Yes" },
      { value: "joint_owner" satisfies OwnershipStatus, label: "Joint owner" },
      { value: "no" satisfies OwnershipStatus, label: "No" },
      { value: "landlord" satisfies OwnershipStatus, label: "Landlord" },
    ],
  },
  {
    type: "single",
    id: "mainResidence",
    stepNumber: 1,
    question: "Is this property your main residence?",
    options: [
      { value: "yes" satisfies YesNo, label: "Yes" },
      { value: "no" satisfies YesNo, label: "No" },
    ],
  },
  {
    type: "single",
    id: "currentHeating",
    stepNumber: 2,
    question: "How is your home currently heated?",
    options: [
      { value: "heating_oil" satisfies CurrentHeating, label: "Heating oil" },
      { value: "lpg" satisfies CurrentHeating, label: "LPG" },
      { value: "mains_gas" satisfies CurrentHeating, label: "Mains gas" },
      { value: "electric_storage" satisfies CurrentHeating, label: "Electric storage heaters" },
      { value: "direct_electric" satisfies CurrentHeating, label: "Direct electric heating" },
      { value: "coal" satisfies CurrentHeating, label: "Coal" },
      { value: "biomass" satisfies CurrentHeating, label: "Biomass" },
      { value: "existing_heat_pump" satisfies CurrentHeating, label: "Existing heat pump" },
      { value: "no_central_heating" satisfies CurrentHeating, label: "No central heating" },
      { value: "other" satisfies CurrentHeating, label: "Other" },
      { value: "not_sure" satisfies CurrentHeating, label: "Not sure" },
    ],
  },
  {
    type: "single",
    id: "onMainsGas",
    stepNumber: 2,
    question: "Is your property connected to the mains gas network?",
    options: [
      { value: "yes" satisfies MainsGasConnection, label: "Yes" },
      { value: "no" satisfies MainsGasConnection, label: "No" },
      { value: "not_sure" satisfies MainsGasConnection, label: "Not sure" },
    ],
  },
  {
    type: "single",
    id: "replacementTimescale",
    stepNumber: 2,
    question: "Are you considering replacing your current heating system?",
    options: [
      { value: "asap" satisfies ReplacementTimescale, label: "Yes, as soon as possible" },
      { value: "within_3_months" satisfies ReplacementTimescale, label: "Within three months" },
      { value: "within_6_months" satisfies ReplacementTimescale, label: "Within six months" },
      { value: "researching" satisfies ReplacementTimescale, label: "Researching my options" },
      { value: "not_sure" satisfies ReplacementTimescale, label: "Not sure" },
    ],
  },
  {
    type: "single",
    id: "propertyType",
    stepNumber: 3,
    question: "What type of property is it?",
    options: [
      { value: "detached" satisfies PropertyType, label: "Detached" },
      { value: "semi_detached" satisfies PropertyType, label: "Semi-detached" },
      { value: "terraced" satisfies PropertyType, label: "Terraced" },
      { value: "bungalow" satisfies PropertyType, label: "Bungalow" },
      { value: "flat" satisfies PropertyType, label: "Flat or apartment" },
      { value: "other" satisfies PropertyType, label: "Other" },
    ],
  },
  {
    type: "single",
    id: "propertyAge",
    stepNumber: 3,
    question: "Approximately when was the property built?",
    options: [
      { value: "before_1900" satisfies PropertyAge, label: "Before 1900" },
      { value: "1900_1949" satisfies PropertyAge, label: "1900–1949" },
      { value: "1950_1979" satisfies PropertyAge, label: "1950–1979" },
      { value: "1980_1999" satisfies PropertyAge, label: "1980–1999" },
      { value: "2000_2020" satisfies PropertyAge, label: "2000–2020" },
      { value: "within_6_months" satisfies PropertyAge, label: "Within the last six months" },
      { value: "not_sure" satisfies PropertyAge, label: "Not sure" },
    ],
  },
  {
    type: "single",
    id: "listed",
    stepNumber: 3,
    question: "Is the property listed?",
    options: [
      { value: "yes" satisfies ListedStatus, label: "Yes" },
      { value: "no" satisfies ListedStatus, label: "No" },
      { value: "not_sure" satisfies ListedStatus, label: "Not sure" },
    ],
  },
  {
    type: "multi",
    id: "improvements",
    stepNumber: 3,
    question: "Which improvements are you interested in?",
    helpText: "Select all that apply.",
    options: [
      { value: "air_source_heat_pump" satisfies Improvement, label: "Air-source heat pump" },
      { value: "ground_source_heat_pump" satisfies Improvement, label: "Ground-source heat pump" },
      { value: "solar_panels" satisfies Improvement, label: "Solar panels" },
      { value: "battery_storage" satisfies Improvement, label: "Battery storage" },
      { value: "insulation" satisfies Improvement, label: "Insulation" },
      { value: "heating_controls" satisfies Improvement, label: "Heating controls" },
      { value: "windows_glazing" satisfies Improvement, label: "Windows and glazing" },
      { value: "lowering_bills" satisfies Improvement, label: "Lowering energy bills" },
      { value: "not_sure" satisfies Improvement, label: "Not sure — I need advice" },
    ],
  },
];

export const TOTAL_STEPS = 4;
