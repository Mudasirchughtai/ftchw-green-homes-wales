"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Rendered as a sibling of <Header>, not a child -- Header uses backdrop-blur,
// which creates a new CSS containing block and would break `fixed`
// positioning for any descendant (it'd anchor to the header instead of the
// viewport).
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    // Sticky CTA fades in once the hero (and its own in-hero CTA) has
    // scrolled out of view, so it doesn't duplicate the hero's button.
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-cream-100 p-3 shadow-card-lg lg:hidden"
        >
          <a href="#eligibility" className="btn-primary block w-full text-center">
            Check Eligibility
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
