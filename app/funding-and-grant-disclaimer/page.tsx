import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { BOILER_UPGRADE_SCHEME_NOTICE, FUNDING_BODY_COPY, GREEN_HOMES_WALES_FUNDING_COPY } from "@/config/funding";

export const metadata: Metadata = { title: "Funding and Grant Disclaimer | First Time Central Heating Wales" };

export default function FundingAndGrantDisclaimerPage() {
  return (
    <LegalPageLayout title="Funding and Grant Disclaimer">
      <p>{FUNDING_BODY_COPY}</p>
      <p>{BOILER_UPGRADE_SCHEME_NOTICE}</p>
      <p>{GREEN_HOMES_WALES_FUNDING_COPY}</p>
      <p>
        First Time Central Heating Wales is an independent marketing and installer-introduction
        service. It does not award grants, approve finance or guarantee any outcome. Final
        eligibility is determined by the relevant scheme administrator, finance provider,
        installer or retrofit professional following an assessment of the applicant, the property
        and the proposed work.
      </p>
    </LegalPageLayout>
  );
}
