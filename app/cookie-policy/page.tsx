import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = { title: "Cookie Policy | First Time Central Heating Wales" };

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <p>
        This page is a placeholder. A full cookie policy — listing the analytics, advertising and
        essential cookies used on this site (Google Tag Manager, Google Analytics 4, Meta Pixel,
        Microsoft Clarity and any others), their purpose and how to manage consent — will be
        published here once tracking is configured and cookie-consent management is live.
      </p>
    </LegalPageLayout>
  );
}
