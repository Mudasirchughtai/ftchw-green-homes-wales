import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

const MAY_QUALIFY = [
  "Property is located in Wales",
  "Applicant owns or jointly owns the property",
  "Property is the applicant's main residence",
  "Applicant is an individual rather than a business",
  "Applicant completes the required assessment process",
  "Applicant passes affordability and credit checks",
];

const MAY_NOT_QUALIFY = [
  "Private landlord",
  "Social landlord",
  "Listed property",
  "Property outside Wales",
  "New build completed within the previous six months",
  "Second home or holiday home",
  "Commercial or business-owned property",
];

function CriteriaCard({ title, items, positive }: { title: string; items: string[]; positive: boolean }) {
  return (
    <div className="card-interactive h-full">
      <h3 className="text-base font-semibold text-brand-900">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
            {positive ? (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-brand-600">
                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-gold-600">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GreenHomesWalesEligibility() {
  return (
    <section id="green-homes-wales-eligibility" className="bg-cream-200 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Green Homes Wales" heading="Who Can Initially Apply for Green Homes Wales?" />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <RevealItem>
            <CriteriaCard title="Potential criteria" items={MAY_QUALIFY} positive />
          </RevealItem>
          <RevealItem>
            <CriteriaCard title="May not currently qualify" items={MAY_NOT_QUALIFY} positive={false} />
          </RevealItem>
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-light">
          Final eligibility is determined by the Green Homes Wales scheme administrator, not by
          First Time Central Heating Wales.
        </p>
      </div>
    </section>
  );
}
