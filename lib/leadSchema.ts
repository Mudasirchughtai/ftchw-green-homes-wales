import { z } from "zod";
import { isValidEmail, isValidFullName, isValidUkPhone, isValidUkPostcode } from "@/lib/validation";

const yesNoNotSure = z.enum(["yes", "no", "not_sure"]);
const yesNo = z.enum(["yes", "no"]);

export const propertyLocationSchema = z.enum(["wales", "england", "scotland", "northern_ireland", "other"]);
export const ownershipStatusSchema = z.enum([
  "sole_owner",
  "joint_owner",
  "private_landlord",
  "social_landlord",
  "business_owned",
  "tenant",
  "other",
]);
export const occupancyStatusSchema = z.enum([
  "main_residence",
  "second_home",
  "holiday_home",
  "rental_property",
  "commercial",
  "other",
]);
export const existingHeatingSchema = z.enum([
  "mains_gas",
  "oil",
  "lpg",
  "coal",
  "direct_electric",
  "storage_heaters",
  "existing_heat_pump",
  "other",
]);
export const propertyTypeSchema = z.enum([
  "detached_house",
  "semi_detached_house",
  "terraced_house",
  "bungalow",
  "flat",
  "maisonette",
  "other",
]);

export const qualificationSchema = z.object({
  propertyLocation: propertyLocationSchema,
  ownershipStatus: ownershipStatusSchema,
  occupancyStatus: occupancyStatusSchema,
  listedProperty: yesNoNotSure,
  newBuildUnderSixMonths: yesNo,
  mainsGasGrid: yesNoNotSure,
  existingHeating: existingHeatingSchema,
  propertyType: propertyTypeSchema,
  postcode: z.string().refine(isValidUkPostcode, "Enter a valid UK postcode"),
});

export const contactSchema = z.object({
  fullName: z.string().refine(isValidFullName, "Enter your full name"),
  phone: z.string().refine(isValidUkPhone, "Enter a valid UK phone number"),
  email: z.string().refine(isValidEmail, "Enter a valid email address"),
});

export const consentSchema = z.object({
  enquiryConsent: z.literal(true, {
    errorMap: () => ({ message: "Enquiry consent is required" }),
  }),
  marketingConsent: z.boolean(),
});

const nullableString = z.string().nullable();

export const attributionSchema = z.object({
  landingUrl: z.string(),
  referrer: z.string(),
  utmSource: nullableString,
  utmMedium: nullableString,
  utmCampaign: nullableString,
  utmContent: nullableString,
  utmTerm: nullableString,
  gclid: nullableString,
  gbraid: nullableString,
  wbraid: nullableString,
  fbclid: nullableString,
  firstVisitAt: nullableString,
});

export const leadSubmissionSchema = z.object({
  qualification: qualificationSchema,
  contact: contactSchema,
  consent: consentSchema,
  attribution: attributionSchema,
  honeypot: z.string().optional(),
  formLoadedAt: z.number().optional(),
  submissionId: z.string().min(1, "Missing submission id"),
  turnstileToken: z.string().optional(),
});

export type ValidatedLeadSubmission = z.infer<typeof leadSubmissionSchema>;
