import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = { title: "Terms of Use | First Time Central Heating Wales" };

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout title="Terms of Use">
      <p>
        This page is a placeholder. Full terms of use — covering acceptable use of this website,
        intellectual property, liability and the independent, non-advisory nature of the
        enquiry service — will be published here before the site goes live.
      </p>
      <p>
        First Time Central Heating Wales is an independent marketing and installer-introduction
        service. It does not award grants, approve finance or carry out installations.
      </p>
    </LegalPageLayout>
  );
}
