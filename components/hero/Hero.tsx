import { EligibilityForm } from "@/components/eligibility-form/EligibilityForm";
import { Reveal } from "@/components/animation/Reveal";
import { AnimatedCounter } from "@/components/animation/AnimatedCounter";
import { getEnhancedGrantHeadline } from "@/config/funding";

const BENEFITS = [
  "Up to £9,000 towards an eligible heat pump",
  "Interest-free Green Homes Wales funding up to £25,000",
  "Connected with appropriately accredited Welsh installers",
  "Initial eligibility check takes approximately 60 seconds",
  "No obligation to proceed",
];

const STATS = [
  { value: 9000, prefix: "£", suffix: "", label: "Potential heat pump grant" },
  { value: 25000, prefix: "£", suffix: "", label: "Interest-free funding available" },
  { value: 60, prefix: "", suffix: "s", label: "To complete the initial check" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream">
      {/* Soft background shapes -- decorative only, aria-hidden, GPU-cheap blur */}
      <div aria-hidden="true" className="section-blob -left-24 -top-24 h-80 w-80 bg-brand-200" />
      <div aria-hidden="true" className="section-blob -right-16 top-40 h-72 w-72 bg-gold-200" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2 lg:items-start lg:py-16">
        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
              Boiler Upgrade Scheme and Green Homes Wales Support
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-900 sm:text-4xl lg:text-5xl">
              Could Your Welsh Home Qualify for Up to £9,000 Towards a Heat Pump?
            </h1>
            <p className="mt-4 text-lg text-ink-light">
              Check your potential eligibility for the Boiler Upgrade Scheme, Green Homes Wales
              interest-free funding and fully funded expert retrofit support.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-6 space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-ink">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 flex-none text-brand-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/60 p-3 text-center shadow-card">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="block text-xl font-bold text-brand-800 sm:text-2xl"
                />
                <span className="mt-1 block text-[11px] leading-tight text-ink-light">{stat.label}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-6 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-ink">
              {getEnhancedGrantHeadline()}
            </p>

            <p className="mt-6 text-xs text-ink-light">
              First Time Central Heating Wales is an independent marketing and installer-introduction
              service. Funding and grant eligibility are subject to scheme rules, property assessment
              and approval.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col items-center lg:pt-4">
          {/* scroll-mt clears the sticky header so #eligibility anchor jumps
              (and Continue-button auto-scrolls) never land underneath it. */}
          <div id="eligibility" className="w-full scroll-mt-24">
            <Reveal delay={0.2} y={16}>
              <EligibilityForm />
            </Reveal>
          </div>
          <p className="mt-3 text-center text-sm text-ink-light">
            Takes approximately 60 seconds. No obligation.
          </p>
        </div>
      </div>

      {/* Observed by MobileStickyCta to know when the hero (and its in-view CTA) has scrolled past. */}
      <div id="hero-sentinel" aria-hidden="true" />
    </section>
  );
}
