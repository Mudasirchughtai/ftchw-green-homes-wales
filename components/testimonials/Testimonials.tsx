"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/animation/Reveal";

// CLAUDE.md -> "TESTIMONIALS": do not invent reviews, installation numbers,
// approval rates or savings. These are clearly-labelled placeholders, not
// fabricated quotes, until genuine verified case studies are supplied.
const PLACEHOLDER_SLOTS = [
  { county: "Gwynedd", route: "Boiler Upgrade Scheme" },
  { county: "Carmarthenshire", route: "Green Homes Wales" },
  { county: "Powys", route: "Boiler Upgrade Scheme" },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]") as HTMLElement | null;
    const distance = (card?.offsetWidth ?? 320) + 24;
    track.scrollBy({ left: direction * distance, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  return (
    <section className="bg-cream px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Homeowner Case Studies"
          heading="What Welsh Homeowners Are Saying"
          supporting="Verified case studies will appear here once genuine, permissioned reviews are supplied."
        />

        <div className="relative mt-10">
          <RevealGroup>
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {PLACEHOLDER_SLOTS.map((slot, i) => (
                <RevealItem key={slot.county} delay={i * 0.05}>
                  <div
                    data-card
                    className="w-[280px] flex-none snap-center rounded-2xl border-2 border-dashed border-brand-200 bg-cream-100 p-6 shadow-card sm:w-[320px]"
                  >
                    <span className="badge">Coming Soon</span>
                    <p className="mt-4 text-sm italic text-ink-light">
                      A genuine, permissioned review from a verified {slot.county} homeowner will
                      appear here.
                    </p>
                    <div className="mt-5 border-t border-brand-100 pt-4 text-xs text-ink-light">
                      <p>
                        <span className="font-semibold text-ink">County:</span> {slot.county}
                      </p>
                      <p className="mt-1">
                        <span className="font-semibold text-ink">Funding route:</span> {slot.route}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </RevealGroup>

          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Previous case study"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-700 text-brand-800 transition-transform active:scale-90"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 010 1.06L9.06 10l3.73 3.71a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next case study"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-700 text-brand-800 transition-transform active:scale-90"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.2 6.29a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
