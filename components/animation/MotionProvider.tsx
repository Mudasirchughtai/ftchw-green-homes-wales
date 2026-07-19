"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global reduced-motion compliance: framer-motion swaps every animation to
 * an instant, non-transform version whenever the OS-level
 * prefers-reduced-motion is set, without each component needing to check it.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
