import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = { title: "How We Select Installers | First Time Central Heating Wales" };

export default function HowWeSelectInstallersPage() {
  return (
    <LegalPageLayout title="How We Select Installers">
      <p>
        Installers and retrofit professionals introduced through First Time Central Heating
        Wales are expected to hold the registrations and accreditations appropriate to the work
        they undertake, which may include MCS certification, NICEIC registration, RECC
        membership, TrustMark registration and PAS 2035 compliance.
      </p>
      <p>
        Installer accreditations and memberships are checked before introductions are made. First
        Time Central Heating Wales does not itself hold these accreditations and does not carry
        out installation work.
      </p>
      <p>This page is a placeholder for the full installer-vetting criteria and process.</p>
    </LegalPageLayout>
  );
}
