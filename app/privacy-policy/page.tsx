import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = { title: "Privacy Policy | First Time Central Heating Wales" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        This page is a placeholder. A full privacy policy — covering what personal data First
        Time Central Heating Wales collects through the eligibility check, how it is stored,
        which accredited installers and retrofit professionals it may be shared with, retention
        periods and your data protection rights — will be published here before the site goes
        live.
      </p>
      <p>
        In the meantime, if you have a question about how your data is handled, contact{" "}
        {CONTACT_EMAIL}.
      </p>
    </LegalPageLayout>
  );
}
