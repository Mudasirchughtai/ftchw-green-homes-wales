"use client";

import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  /** 1-indexed current question/screen number. */
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percent = Math.round((current / total) * 100);
  const label = `Question ${current} of ${total} — ${percent}% complete`;

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-ink-light">
        <span aria-hidden="true">
          Question {current} of {total}
        </span>
        <span aria-hidden="true">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-brand-100"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-brand-700"
          animate={{ scaleX: percent / 100 }}
          initial={false}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%" }}
        />
      </div>
      {/* Announced to screen readers whenever the question changes. */}
      <span aria-live="polite" className="sr-only">
        {label}
      </span>
    </div>
  );
}
