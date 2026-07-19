import { ResultLayout } from "@/components/results/ResultLayout";
import type { ResultType } from "@/lib/types";

// Copy taken verbatim from docs/original-brief.md -> "DYNAMIC RESULT PAGES".
const RESULTS: Record<
  ResultType,
  { eyebrow: string; headline: string; copy: string; ctaLabel: string }
> = {
  A: {
    eyebrow: "Initial Result",
    headline: "You May Meet the Initial Criteria for the Enhanced £9,000 Heat-Pump Grant",
    copy: "Based on your answers, your home may fall within the enhanced Boiler Upgrade Scheme category for eligible off-gas-grid properties replacing oil or LPG heating. An appropriately accredited installer must confirm the property, existing heating system and full eligibility.",
    ctaLabel: "Book My Eligibility Call",
  },
  B: {
    eyebrow: "Initial Result",
    headline: "You May Qualify for £7,500 Towards an Eligible Heat Pump",
    copy: "An MCS-certified installer will need to assess your home and confirm whether the property and proposed installation meet the Boiler Upgrade Scheme requirements.",
    ctaLabel: "Arrange My Initial Assessment",
  },
  C: {
    eyebrow: "Initial Result",
    headline: "Green Homes Wales Funding May Be Available",
    copy: "You may be able to access interest-free funding from £1,000 to £25,000 and fully funded expert retrofit support, subject to scheme rules, credit checks, affordability assessment and final approval.",
    ctaLabel: "Discuss My Funding Options",
  },
  D: {
    eyebrow: "Initial Result",
    headline: "Your Property Needs a Quick Manual Review",
    copy: "Some properties require additional checks. A member of the team will review your answers and explain which options may still be available.",
    ctaLabel: "Speak to the Team",
  },
  E: {
    eyebrow: "Initial Result",
    headline: "This Particular Scheme May Not Be the Best Match",
    copy: "Based on your answers, you may not meet the initial criteria for Green Homes Wales or the Boiler Upgrade Scheme. Other support options may still be available, so you can request a manual review.",
    ctaLabel: "Request a Manual Review",
  },
};

export function ResultRenderer({ result }: { result: ResultType }) {
  const content = RESULTS[result];
  return (
    <ResultLayout
      eyebrow={content.eyebrow}
      headline={content.headline}
      copy={content.copy}
      ctaLabel={content.ctaLabel}
    />
  );
}
