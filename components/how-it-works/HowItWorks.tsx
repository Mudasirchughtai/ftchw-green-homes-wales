import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

const STEPS = [
  {
    title: "Complete the 60-second check",
    copy: "Tell us about your property, ownership and existing heating.",
  },
  {
    title: "Initial telephone review",
    copy: "A member of the team confirms your circumstances and explains the most relevant routes.",
  },
  {
    title: "Professional introduction",
    copy: "Where appropriate, you are connected with an independent installer or retrofit professional holding the relevant accreditations.",
  },
  {
    title: "Property assessment and quotation",
    copy: "The installer assesses heat loss, property suitability, system design and any supporting improvements.",
  },
  {
    title: "Funding and installation",
    copy: "The relevant installer or scheme professional manages qualifying applications and confirms all costs before work is agreed.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-900 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Process"
          heading="From Eligibility Check to Accredited Installation"
          dark
        />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <RevealItem key={step.title}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-sm font-bold text-brand-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-brand-100">{step.copy}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-brand-200">
          Completing the enquiry does not commit the homeowner to a loan, installer or
          installation contract.
        </p>
      </div>
    </section>
  );
}
