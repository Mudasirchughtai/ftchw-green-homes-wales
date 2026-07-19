import type { LeadResult, LeadSubmission } from "@/lib/types";

const RESULT_LABELS: Record<LeadResult["result"], string> = {
  A: "Potential enhanced £9,000 BUS prospect",
  B: "Potential £7,500 BUS prospect",
  C: "Green Homes Wales funding interest",
  D: "Manual eligibility review required",
  E: "Not currently eligible",
};

const YES_NO_LABEL: Record<string, string> = { yes: "Yes", no: "No" };

/**
 * Mobile-readable lead notes, matching the exact template in
 * docs/original-brief.md -> "PRIVYR LEAD NOTES FORMAT".
 */
export function formatLeadNotes(lead: LeadSubmission, scored: LeadResult): string {
  const { step1, step2, step3, step4, attribution, consent } = lead;
  return `GREEN HOMES WALES / BUS ENQUIRY

Priority: ${scored.priority.toUpperCase()}

Initial result:
${RESULT_LABELS[scored.result]}

Property:
Postcode: ${step4.postcode}
Owner-occupier: ${step1.ownership ?? "Not answered"}
Main residence: ${step1.mainResidence ? YES_NO_LABEL[step1.mainResidence] : "Not answered"}
Property type: ${step3.propertyType ?? "Not answered"}
Approximate age: ${step3.propertyAge ?? "Not answered"}
Listed property: ${step3.listed ?? "Not answered"}

Heating:
Current heating: ${step2.currentHeating ?? "Not answered"}
Mains gas connection: ${step2.onMainsGas ?? "Not answered"}
Replacement timescale: ${step2.replacementTimescale ?? "Not answered"}

Interested in:
${step3.improvements.length > 0 ? step3.improvements.join(", ") : "Not specified"}

Contact:
Preferred method: ${step4.preferredContactMethod ?? "Not answered"}
Best time: ${step4.bestContactTime ?? "Not answered"}

Campaign:
Source: ${attribution.utmSource ?? "Direct"}
Campaign: ${attribution.utmCampaign ?? "-"}
Advert: ${attribution.utmContent ?? "-"}

Consent:
Service contact: ${consent.serviceContactConsent ? "Yes" : "No"}
Marketing: ${consent.marketingConsent ? "Yes" : "No"}
Consent version: v1`;
}

interface PrivyrLeadPayload {
  license_code: string;
  source: string;
  full_name: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address: string;
  postcode: string;
  tags: string[];
  notes: string;
}

function buildPrivyrPayload(lead: LeadSubmission, scored: LeadResult): PrivyrLeadPayload {
  return {
    license_code: process.env.PRIVYR_LICENSE_CODE ?? "",
    source: process.env.PRIVYR_SOURCE_NAME || "FTCHW - Green Homes Wales / BUS",
    full_name: `${lead.step4.firstName} ${lead.step4.lastName}`.trim(),
    first_name: lead.step4.firstName,
    last_name: lead.step4.lastName,
    mobile: lead.step4.mobile,
    email: lead.step4.email,
    address: lead.step4.addressLine1,
    postcode: lead.step4.postcode,
    tags: scored.tags,
    notes: formatLeadNotes(lead, scored),
  };
}

/**
 * Sends the lead to Privyr's webhook endpoint. PRIVYR_WEBHOOK_URL / field
 * mapping should be confirmed against Privyr's actual webhook contract
 * before going live -- this generic JSON shape is a reasonable placeholder
 * given only the credential names in .env.example.
 *
 * Retries up to 3 times per CLAUDE.md's lead-delivery reliability
 * requirement. Never throws -- callers decide what "delivered" means.
 */
export async function sendLeadToPrivyr(
  lead: LeadSubmission,
  scored: LeadResult,
): Promise<{ delivered: boolean; error?: string }> {
  const webhookUrl = process.env.PRIVYR_WEBHOOK_URL;
  if (!webhookUrl) {
    return { delivered: false, error: "PRIVYR_WEBHOOK_URL not configured" };
  }

  const payload = buildPrivyrPayload(lead, scored);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.PRIVYR_API_KEY
            ? { Authorization: `Bearer ${process.env.PRIVYR_API_KEY}` }
            : {}),
        },
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
