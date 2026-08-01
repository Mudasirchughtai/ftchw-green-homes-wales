import type { LeadSubmission, FundingRoute } from "@/lib/types";
import { CONSENT_VERSION } from "@/config/consent";
import {
  ELIGIBILITY_SUMMARY,
  FUNDING_ROUTE_LABELS,
  HEATING_LABELS,
  OCCUPANCY_LABELS,
  OWNERSHIP_LABELS,
  PROPERTY_LOCATION_LABELS,
  PROPERTY_TYPE_LABELS,
  yesNoLabel,
} from "@/lib/privyrFieldLabels";

/** Readable summary for Privyr's Additional Client Details / Notes field. */
export function formatLeadNotes(lead: LeadSubmission, fundingRoute: FundingRoute): string {
  const { qualification: q, attribution } = lead;
  return `GREEN HOMES WALES ELIGIBILITY ENQUIRY

Potential Route: ${FUNDING_ROUTE_LABELS[fundingRoute]}
Property Location: ${q.propertyLocation ? PROPERTY_LOCATION_LABELS[q.propertyLocation] : "Not answered"}
Ownership: ${q.ownershipStatus ? OWNERSHIP_LABELS[q.ownershipStatus] : "Not answered"}
Occupancy: ${q.occupancyStatus ? OCCUPANCY_LABELS[q.occupancyStatus] : "Not answered"}
Property Type: ${q.propertyType ? PROPERTY_TYPE_LABELS[q.propertyType] : "Not answered"}
Listed Property: ${yesNoLabel(q.listedProperty)}
Recent New Build: ${yesNoLabel(q.newBuildUnderSixMonths)}
Mains Gas Grid: ${yesNoLabel(q.mainsGasGrid)}
Existing Heating: ${q.existingHeating ? HEATING_LABELS[q.existingHeating] : "Not answered"}
Postcode: ${q.postcode}

Eligibility Summary:
${ELIGIBILITY_SUMMARY[fundingRoute]} Final eligibility and grant level require assessment by the relevant accredited installer and scheme administrator.

Attribution:
Source: ${attribution.utmSource ?? "Direct"}
Campaign: ${attribution.utmCampaign ?? "-"}
Landing Page: ${attribution.landingUrl || "-"}

Consent:
Enquiry Contact Consent: ${lead.consent.enquiryConsent ? "Yes" : "No"}
Marketing Consent: ${lead.consent.marketingConsent ? "Yes" : "No"}
Consent Version: ${CONSENT_VERSION}
Submitted: ${new Date().toISOString()}
Submission ID: ${lead.submissionId}`;
}

interface PrivyrPayload {
  name: string;
  phone: string;
  email: string;
  lead_source: string;
  form_reference: string;
  funding_route: string;
  eligibility_summary: string;
  property_location: string;
  ownership_status: string;
  occupancy_status: string;
  listed_property: string;
  new_build_under_six_months: string;
  mains_gas_grid: string;
  existing_heating: string;
  property_type: string;
  postcode: string;
  original_phone: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  landing_page: string;
  referrer: string;
  enquiry_consent: string;
  marketing_consent: string;
  consent_version: string;
  submitted_at: string;
  submission_id: string;
  notes: string;
}

function buildPrivyrPayload(
  lead: LeadSubmission,
  fundingRoute: FundingRoute,
  normalizedPhone: string,
  originalPhone: string,
): PrivyrPayload {
  const { qualification: q, attribution } = lead;

  // Per delivery requirements: don't send empty optional properties --
  // Privyr's field mapping behaves better with absent keys than empty
  // strings for UTM/click-id parameters that weren't present on this visit.
  const optional: Partial<PrivyrPayload> = {};
  if (attribution.utmSource) optional.utm_source = attribution.utmSource;
  if (attribution.utmMedium) optional.utm_medium = attribution.utmMedium;
  if (attribution.utmCampaign) optional.utm_campaign = attribution.utmCampaign;
  if (attribution.utmContent) optional.utm_content = attribution.utmContent;
  if (attribution.utmTerm) optional.utm_term = attribution.utmTerm;
  if (attribution.gclid) optional.gclid = attribution.gclid;
  if (attribution.fbclid) optional.fbclid = attribution.fbclid;

  return {
    name: lead.contact.fullName,
    phone: normalizedPhone,
    email: lead.contact.email,
    lead_source: "Green Homes Wales Landing Page",
    form_reference: "green-homes-wales",
    funding_route: FUNDING_ROUTE_LABELS[fundingRoute],
    eligibility_summary: ELIGIBILITY_SUMMARY[fundingRoute],
    property_location: q.propertyLocation ? PROPERTY_LOCATION_LABELS[q.propertyLocation] : "",
    ownership_status: q.ownershipStatus ? OWNERSHIP_LABELS[q.ownershipStatus] : "",
    occupancy_status: q.occupancyStatus ? OCCUPANCY_LABELS[q.occupancyStatus] : "",
    listed_property: yesNoLabel(q.listedProperty),
    new_build_under_six_months: yesNoLabel(q.newBuildUnderSixMonths),
    mains_gas_grid: yesNoLabel(q.mainsGasGrid),
    existing_heating: q.existingHeating ? HEATING_LABELS[q.existingHeating] : "",
    property_type: q.propertyType ? PROPERTY_TYPE_LABELS[q.propertyType] : "",
    postcode: q.postcode,
    original_phone: originalPhone,
    landing_page: attribution.landingUrl,
    referrer: attribution.referrer,
    enquiry_consent: lead.consent.enquiryConsent ? "Yes" : "No",
    marketing_consent: lead.consent.marketingConsent ? "Yes" : "No",
    consent_version: CONSENT_VERSION,
    submitted_at: new Date().toISOString(),
    submission_id: lead.submissionId,
    notes: formatLeadNotes(lead, fundingRoute),
    ...optional,
  };
}

/**
 * Sends the lead to Privyr's webhook endpoint. The exact field-mapping
 * behaviour (Custom Client Fields vs. Notes) depends on how the receiving
 * Privyr webhook/Zapier-style integration is configured on the account --
 * see docs/PRIVYR_SETUP.md. Retries up to 3 times. Never throws; callers
 * decide what "delivered" means and fall back to durable local storage.
 */
export async function sendLeadToPrivyr(
  lead: LeadSubmission,
  fundingRoute: FundingRoute,
  normalizedPhone: string,
  originalPhone: string,
): Promise<{ delivered: boolean; error?: string }> {
  const webhookUrl = process.env.PRIVYR_WEBHOOK_URL;
  if (!webhookUrl) {
    return { delivered: false, error: "PRIVYR_WEBHOOK_URL not configured" };
  }

  const payload = buildPrivyrPayload(lead, fundingRoute, normalizedPhone, originalPhone);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { delivered: true };
    } catch {
      // fall through to retry
    }
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }

  return { delivered: false, error: "Privyr webhook failed after 3 attempts" };
}
