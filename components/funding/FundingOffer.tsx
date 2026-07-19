import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

const CARDS = [
  {
    title: "Up to £9,000 Boiler Upgrade Scheme Grant",
    copy: "For eligible off-gas-grid homes replacing oil or LPG with an eligible air-to-water or ground-source heat pump during the enhanced funding period.",
    badge: "Grant — subject to scheme eligibility",
  },
  {
    title: "Interest-Free Funding Up to £25,000",
    copy: "Eligible Welsh owner-occupiers may apply for Green Homes Wales interest-free funding from £1,000 to £25,000, with repayment terms of up to ten years and an initial six-month repayment holiday.",
    badge: "Subject to status and approval",
  },
  {
    title: "Fully Funded Retrofit Support",
    copy: "Access professional home assessment and Retrofit Coordinator support to identify suitable improvements and help oversee compliant delivery.",
    badge: "Whole-home expert guidance",
  },
];

export function FundingOffer() {
  return (
    <section id="funding-options" className="bg-cream px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Funding Routes"
          heading="More Than One Route May Be Available to Fund Your Home Improvements"
        />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <RevealItem key={card.title}>
              <div className="card-interactive flex h-full flex-col">
                <span className="badge w-fit">{card.badge}</span>
                <h3 className="mt-4 text-lg font-semibold text-brand-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-light">{card.copy}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-ink-light">
          Available support depends on the applicant, property, proposed measures, existing
          heating system, scheme criteria, affordability checks, credit checks and funding
          availability.
        </p>
      </div>
    </section>
  );
}
