"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

const ACCREDITATIONS = [
  { code: "MCS", name: "Microgeneration Certification Scheme" },
  { code: "NICEIC", name: "National Inspection Council for Electrical Installation Contracting" },
  { code: "RECC", name: "Renewable Energy Consumer Code" },
  { code: "TrustMark", name: "Government-endorsed quality scheme" },
  { code: "PAS 2035", name: "Retrofit standard, where appropriate" },
];

export function TrustSection() {
  return (
    <section className="bg-cream-200 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Accredited Installer Network"
          heading="Connected With Appropriately Accredited Welsh Installation Professionals"
          supporting="Installer accreditations and memberships are checked before introductions are made."
        />

        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ACCREDITATIONS.map((a) => (
            <RevealItem key={a.code}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="group relative flex h-24 items-center justify-center rounded-xl border border-brand-100 bg-cream-100 px-3 text-center shadow-card"
              >
                <span className="text-sm font-bold text-brand-800">{a.code}</span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute -top-2 left-1/2 z-10 w-48 -translate-x-1/2 -translate-y-full
                    rounded-lg bg-brand-900 px-3 py-2 text-xs text-white opacity-0 shadow-card-lg transition-opacity
                    duration-200 group-hover:opacity-100"
                >
                  {a.name}
                </span>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-light">
          First Time Central Heating Wales does not itself hold these accreditations. Installers
          introduced through the service are expected to hold the registrations and
          accreditations appropriate to the work they undertake.
        </p>
      </div>
    </section>
  );
}
