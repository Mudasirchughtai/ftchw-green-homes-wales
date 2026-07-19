import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animation/Reveal";
import { BOILER_UPGRADE_SCHEME_NOTICE } from "@/config/funding";

const CRITERIA = [
  "Property is located in England or Wales",
  "Existing heating system is being replaced",
  "New system is an eligible heat-pump technology",
  "Installation is completed by an MCS-certified installer",
  "System is designed to meet the property's heating requirements",
  "Conflicting public funding has not already been used for the same installation",
  "Property does not fall within an excluded category",
  "Applicable new-build rules are met",
];

export function BoilerUpgradeSchemeEligibility() {
  return (
    <section id="boiler-upgrade-scheme-eligibility" className="bg-cream px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Boiler Upgrade Scheme" heading="Who May Qualify for the Boiler Upgrade Scheme?" />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CRITERIA.map((item) => (
            <RevealItem key={item}>
              <div className="flex items-start gap-2.5 rounded-xl bg-cream-100 p-4 text-sm text-ink shadow-card">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-brand-600">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-8 rounded-xl border border-gold-200 bg-gold-50 p-5 text-center text-sm font-medium text-brand-900">
          {BOILER_UPGRADE_SCHEME_NOTICE}
        </Reveal>
      </div>
    </section>
  );
}
