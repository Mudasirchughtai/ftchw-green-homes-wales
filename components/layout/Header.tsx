"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/config/contact";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#funding-options", label: "Funding Options" },
  { href: "#eligibility", label: "Eligibility" },
  { href: "#faqs", label: "FAQs" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // useMotionValueEvent avoids a re-render on every scroll pixel -- only
  // flips state when crossing the threshold.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header
      className={`sticky top-0 z-40 border-b border-brand-100 bg-cream-100/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-card-lg" : "shadow-none"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <a href="#top" className="text-lg font-bold text-brand-900">
          First Time Central Heating <span className="text-gold-500">Wales</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink transition-colors hover:text-brand-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={CONTACT_PHONE_HREF}
            onClick={() => trackEvent("phone_cta_click")}
            className="text-sm font-semibold text-brand-800 transition-colors hover:text-brand-900"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a href="#eligibility" className="btn-primary">
            Check My Potential Eligibility
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={CONTACT_PHONE_HREF}
            aria-label="Call First Time Central Heating Wales"
            onClick={() => trackEvent("phone_cta_click")}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-brand-700
              text-brand-800 transition-transform duration-150 active:scale-90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.49a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.02l-2.2 2.21z" />
            </svg>
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-brand-700
              text-brand-800 transition-transform duration-150 active:scale-90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              {menuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-brand-100 px-4 py-3 lg:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-base font-medium text-ink hover:bg-brand-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
