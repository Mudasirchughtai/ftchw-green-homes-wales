"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getStoredConsent, setStoredConsent } from "@/lib/cookieConsent";

/**
 * Deferred until the hero's eligibility form has scrolled out of view
 * (same trigger as MobileStickyCta) -- a fixed-bottom banner appearing
 * immediately would sit directly over the form's Continue button on most
 * viewport heights, which real usage (and Playwright) both confirmed.
 */
export function CookieConsentBanner() {
  const [decided, setDecided] = useState(true);
  const [heroPassed, setHeroPassed] = useState(false);

  useEffect(() => {
    setDecided(getStoredConsent() !== null);
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function respond(state: "granted" | "denied") {
    setStoredConsent(state);
    setDecided(true);
  }

  const visible = !decided && heroPassed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-100 bg-cream-100 p-4 shadow-card-lg"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-ink-light">
              We use optional analytics cookies to understand how visitors use this site. The
              eligibility check works either way. See our{" "}
              <a href="/cookie-policy" className="text-brand-700 underline">
                Cookie Policy
              </a>
              .
            </p>
            <div className="flex flex-none gap-2">
              <button type="button" onClick={() => respond("denied")} className="btn-secondary px-4 py-2 text-sm">
                Decline
              </button>
              <button type="button" onClick={() => respond("granted")} className="btn-primary px-4 py-2 text-sm">
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
