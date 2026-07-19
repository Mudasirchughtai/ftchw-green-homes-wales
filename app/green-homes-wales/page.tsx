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
import { Testimonials } from "@/components/testimonials/Testimonials";
import { FAQSection } from "@/components/faq/FAQSection";
import { FinalCta } from "@/components/cta/FinalCta";

export const metadata: Metadata = {
  title: "Heat Pump Grants and Green Homes Wales Funding | First Time Central Heating Wales",
  description:
    "Check whether your Welsh home may qualify for up to £9,000 towards an eligible heat pump, interest-free Green Homes Wales funding and expert retrofit support.",
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
        <Testimonials />
        <FAQSection />
        <FinalCta />
      </main>
      <MainDisclaimer />
      <Footer />
      <MobileStickyCta />
    </div>
  );
}
