"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQS } from "@/components/faq/data";
import { RevealItem } from "@/components/animation/Reveal";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-10 space-y-3">
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <RevealItem key={faq.question}>
            <div className="overflow-hidden rounded-xl border border-brand-100 bg-cream-100 shadow-card">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-brand-900"
                >
                  {faq.question}
                  <motion.svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-5 w-5 flex-none text-brand-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-ink-light">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </RevealItem>
        );
      })}
    </div>
  );
}
