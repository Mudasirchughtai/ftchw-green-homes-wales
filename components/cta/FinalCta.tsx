import { Reveal } from "@/components/animation/Reveal";
import { PhoneCtaLink } from "@/components/common/PhoneCtaLink";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-800 px-4 py-16 text-white">
      <div aria-hidden="true" className="section-blob -left-20 top-0 h-72 w-72 bg-gold-300/30" />
      <div aria-hidden="true" className="section-blob -right-20 bottom-0 h-72 w-72 bg-brand-400/30" />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Find Out Which Home-Energy Support May Be Available to You</h2>
        <p className="mt-4 text-brand-100">
          Complete the quick eligibility check and speak with a member of the team about the
          Boiler Upgrade Scheme, Green Homes Wales and accredited installation options in your
          area.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="#eligibility" className="btn-primary w-full sm:w-auto">
            Check My Potential Eligibility
          </a>
          <PhoneCtaLink className="btn-secondary w-full border-white text-white hover:bg-white/10 sm:w-auto">
            Speak to the Team
          </PhoneCtaLink>
        </div>

        <p className="mt-5 text-xs text-brand-200">
          No obligation. Eligibility and funding are subject to assessment and approval.
        </p>
      </Reveal>
    </section>
  );
}
