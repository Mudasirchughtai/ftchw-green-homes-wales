import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

const BENEFITS = [
  {
    title: "Efficient Home Heating",
    copy: "A correctly designed heat pump can produce substantially more usable heat energy than the electricity it consumes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Consistent Comfort",
    copy: "Heat pumps are designed to maintain a steady indoor temperature rather than repeatedly allowing the property to heat and cool.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
      </svg>
    ),
  },
  {
    title: "Move Away From Oil or LPG",
    copy: "Reduce reliance on delivered fossil fuels and unpredictable fuel purchasing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12a7 7 0 1014 0 7 7 0 00-14 0zM12 8v4l3 2" />
      </svg>
    ),
  },
  {
    title: "Works With Wider Improvements",
    copy: "Heat pumps can be combined with suitable insulation, heating controls, solar PV and battery storage as part of a coordinated home-upgrade plan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V9l8-6 8 6v12M9 21v-6h6v6" />
      </svg>
    ),
  },
];

export function WhyHeatPump() {
  return (
    <section className="bg-cream px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Heat Pump Benefits"
          heading="A Modern Heating System Designed Around Your Home"
        />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <RevealItem key={b.title}>
              <div className="card-interactive h-full">
                <div className="icon-box">{b.icon}</div>
                <h3 className="mt-4 text-base font-semibold text-brand-900">{b.title}</h3>
                <p className="mt-2 text-sm text-ink-light">{b.copy}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-light">
          Individual results vary by property. We do not promise that every homeowner will save
          money, and no specific annual savings figures are guaranteed.
        </p>
      </div>
    </section>
  );
}
