"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
  /** Finer-grained 0-100 fill, independent of the "Step X of 4" label so the
   * bar advances with every question, not just once per macro-step. */
  percent: number;
}

export function ProgressIndicator({ step, totalSteps, percent }: ProgressIndicatorProps) {
  const roundedPercent = Math.round(percent);
  return (
    <div role="status" aria-live="polite" className="mb-5">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink-light">
        <span>
          Step {step} of {totalSteps}
        </span>
        <span>{roundedPercent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
        <motion.div
          className="h-full origin-left rounded-full bg-brand-700"
          animate={{ scaleX: percent / 100 }}
          initial={false}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%" }}
        />
      </div>
      <span className="sr-only">
        Eligibility check step {step} of {totalSteps}, {roundedPercent} percent complete.
      </span>
    </div>
  );
}
