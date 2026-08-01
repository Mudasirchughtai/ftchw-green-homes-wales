"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/animation/Reveal";
import { isEnhancedGrantActive } from "@/config/funding";

type HeatingChoice = "mains_gas" | "oil_lpg" | "electric_other";
type PropertyChoice = "house" | "flat";

const HEATING_OPTIONS: { value: HeatingChoice; label: string }[] = [
  { value: "mains_gas", label: "Mains gas" },
  { value: "oil_lpg", label: "Oil or LPG (off-grid)" },
  { value: "electric_other", label: "Electric or other" },
];

const PROPERTY_OPTIONS: { value: PropertyChoice; label: string }[] = [
  { value: "house", label: "House or bungalow" },
  { value: "flat", label: "Flat or apartment" },
];

function estimateCopy(heating: HeatingChoice, property: PropertyChoice): string {
  if (property === "flat") {
    return "Flats and apartments often need a fuller review before an indicative range can be given. A Green Homes Wales retrofit assessment could still apply.";
  }
  if (heating === "oil_lpg") {
    return isEnhancedGrantActive()
      ? "Off-gas-grid homes replacing oil or LPG could be looking at a £7,500–£9,000 range towards an eligible heat pump."
      : "Off-gas-grid homes replacing oil or LPG could be looking at a £7,500 range today, rising to a potential £9,000 from 21 July 2026.";
  }
  return "You could be looking at a £7,500 range towards an eligible heat pump, plus optional interest-free Green Homes Wales funding.";
}

export function EstimateGrant() {
  const [heating, setHeating] = useState<HeatingChoice>("mains_gas");
  const [property, setProperty] = useState<PropertyChoice>("house");

  return (
    <section className="bg-brand-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Quick Estimate</p>
          <h2 className="mt-2 text-2xl font-bold text-brand-900 sm:text-3xl">
            Get an Indicative Funding Range
          </h2>
          <p className="mt-3 text-ink-light">
            Answer two quick questions for a non-committal, indicative range. This is not a
            guarantee — your exact eligibility is confirmed through the full 60-second check.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="card mt-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Property type</p>
              <div className="flex flex-col gap-2">
                {PROPERTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={property === opt.value}
                    onClick={() => setProperty(opt.value)}
                    className="option-button py-3"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Current heating</p>
              <div className="flex flex-col gap-2">
                {HEATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={heating === opt.value}
                    onClick={() => setHeating(opt.value)}
                    className="option-button py-3"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gold-200 bg-gold-50 p-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${heating}-${property}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="text-center text-base font-semibold text-brand-900"
              >
                {estimateCopy(heating, property)}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-4 text-center text-xs text-ink-light">
            Indicative only, not a guarantee of funding or grant amount. Final eligibility is
            confirmed by an appropriately accredited installer following a full assessment.
          </p>

          <a href="#eligibility" className="btn-primary mt-5 block w-full text-center">
            Check My Potential Eligibility
          </a>
        </Reveal>
      </div>
    </section>
  );
}
