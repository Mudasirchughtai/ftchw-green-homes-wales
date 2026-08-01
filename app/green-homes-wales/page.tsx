import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MainDisclaimer } from "@/components/layout/MainDisclaimer";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { TopInfoBar } from "@/components/layout/TopInfoBar";
import { Hero } from "@/components/hero/Hero";
import { TrustSection } from "@/components/trust/TrustSection";
import { FundingOffer } from "@/components/funding/FundingOffer";
import { EstimateGrant } from "@/components/estimate/EstimateGrant";
import { WhyHeatPump } from "@/components/benefits/WhyHeatPump";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { GreenHomesWalesEligibility } from "@/components/eligibility-info/GreenHomesWalesEligibility";
import { BoilerUpgradeSchemeEligibility } from "@/components/eligibility-info/BoilerUpgradeSchemeEligibility";
import { FAQSection } from "@/components/faq/FAQSection";
import { FinalCta } from "@/components/cta/FinalCta";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Heat Pump Grants Wales | Up to £9,000 Support";
const DESCRIPTION =
  "Check your potential eligibility for the Boiler Upgrade Scheme and Green Homes Wales interest-free funding with a free 60-second initial check.";
const CANONICAL_PATH = "/green-homes-wales";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(CANONICAL_PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(CANONICAL_PATH),
    siteName: "First Time Central Heating Wales",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: absoluteUrl(CANONICAL_PATH),
};

export default function GreenHomesWalesPage() {
  return (
    <div className="pb-20 lg:pb-0">
      <TopInfoBar />
      <Header />
      <main>
        {/* Sections 3 + 4: the first eligibility question must appear above
            the fold per CLAUDE.md, so the form is embedded inside Hero
            rather than stacked as a separate section further down. */}
        <Hero />
        <TrustSection />
        <FundingOffer />
        <EstimateGrant />
        <WhyHeatPump />
        <HowItWorks />
        <GreenHomesWalesEligibility />
        <BoilerUpgradeSchemeEligibility />
        <FAQSection />
        <FinalCta />
      </main>
      <MainDisclaimer />
      <Footer />
      <MobileStickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </div>
  );
}
