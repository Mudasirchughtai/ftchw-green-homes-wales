import type { FundingRoute, LeadSubmission } from "@/lib/types";
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

/**
 * Column order must exactly match row 1 of the "Leads" tab and the
 * COLUMNS array in docs/google-apps-script/Code.gs. See
 * docs/GOOGLE_SHEETS_SETUP.md.
 */
interface SheetsRow {
  submission_id: string;
  submitted_at: string;
  full_name: string;
  phone: string;
  email: string;
  postcode: string;
  property_location: string;
  ownership_status: string;
  occupancy_status: string;
  property_type: string;
  listed_property: string;
  new_build_under_six_months: string;
  mains_gas_grid: string;
  existing_heating: string;
  funding_route: string;
  eligibility_summary: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  landing_page: string;
  referrer: string;
  enquiry_consent: string;
  marketing_consent: string;
  consent_version: string;
  privyr_status: string;
  google_sheets_status: string;
}

function buildRow(
  lead: LeadSubmission,
  fundingRoute: FundingRoute,
  normalizedPhone: string,
  privyrStatus: "sent" | "failed",
  consentVersion: string,
): SheetsRow {
  const { qualification: q, attribution } = lead;
  return {
    submission_id: lead.submissionId,
    submitted_at: new Date().toISOString(),
    full_name: lead.contact.fullName,
    phone: normalizedPhone,
    email: lead.contact.email,
    postcode: q.postcode,
    property_location: q.propertyLocation ? PROPERTY_LOCATION_LABELS[q.propertyLocation] : "",
    ownership_status: q.ownershipStatus ? OWNERSHIP_LABELS[q.ownershipStatus] : "",
    occupancy_status: q.occupancyStatus ? OCCUPANCY_LABELS[q.occupancyStatus] : "",
    property_type: q.propertyType ? PROPERTY_TYPE_LABELS[q.propertyType] : "",
    listed_property: yesNoLabel(q.listedProperty),
    new_build_under_six_months: yesNoLabel(q.newBuildUnderSixMonths),
    mains_gas_grid: yesNoLabel(q.mainsGasGrid),
    existing_heating: q.existingHeating ? HEATING_LABELS[q.existingHeating] : "",
    funding_route: FUNDING_ROUTE_LABELS[fundingRoute],
    eligibility_summary: ELIGIBILITY_SUMMARY[fundingRoute],
    utm_source: attribution.utmSource ?? "",
    utm_medium: attribution.utmMedium ?? "",
    utm_campaign: attribution.utmCampaign ?? "",
    utm_content: attribution.utmContent ?? "",
    utm_term: attribution.utmTerm ?? "",
    gclid: attribution.gclid ?? "",
    gbraid: attribution.gbraid ?? "",
    wbraid: attribution.wbraid ?? "",
    fbclid: attribution.fbclid ?? "",
    landing_page: attribution.landingUrl,
    referrer: attribution.referrer,
    enquiry_consent: lead.consent.enquiryConsent ? "Yes" : "No",
    marketing_consent: lead.consent.marketingConsent ? "Yes" : "No",
    consent_version: consentVersion,
    privyr_status: privyrStatus,
    google_sheets_status: "pending",
  };
}

/**
 * Appends the lead as a row via the Apps Script Web App deployed from
 * docs/google-apps-script/Code.gs. Skips (returns delivered: false,
 * skipped: true) if not configured -- Google Sheets is a reporting copy,
 * not the source of truth, so a missing/failing Sheet must never block
 * the customer's success screen or lose the lead (Supabase already has
 * it). Retries up to 3 times. Never throws.
 */
export async function appendLeadToGoogleSheets(
  lead: LeadSubmission,
  fundingRoute: FundingRoute,
  normalizedPhone: string,
  privyrStatus: "sent" | "failed",
  consentVersion: string,
): Promise<{ delivered: boolean; skipped: boolean; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const token = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;
  if (!webhookUrl || !token) {
    return { delivered: false, skipped: true, error: "GOOGLE_SHEETS_WEBHOOK_URL/TOKEN not configured" };
  }

  const row = buildRow(lead, fundingRoute, normalizedPhone, privyrStatus, consentVersion);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Apps Script's web app response goes through a redirect to a
          // googleusercontent.com "echo" URL; without a browser-like
          // User-Agent/Accept pair that hop reliably 404s for plain
          // server-to-server fetches even though the script itself ran
          // and completed successfully -- confirmed via the Apps Script
          // executions log while debugging this exact behaviour.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        body: JSON.stringify({ token, lead: row }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && data?.ok) return { delivered: true, skipped: false };
    } catch {
      // fall through to retry
    }
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }

  return { delivered: false, skipped: false, error: "Google Sheets webhook failed after 3 attempts" };
}
