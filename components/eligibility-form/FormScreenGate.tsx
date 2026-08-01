"use client";

import { usePresence } from "framer-motion";

/**
 * AnimatePresence keeps the outgoing screen mounted alongside the incoming
 * one for the duration of the exit animation. Both screens can share
 * identically-labelled controls (e.g. every qualification question has a
 * "No" option), so without this, there are briefly two elements with the
 * same accessible name/role in the DOM -- confirmed as a real bug via
 * cross-browser testing (Playwright's strict-mode locator threw exactly
 * this "resolved to 2 elements" error, and a screen reader or fast/keyboard
 * user would hit the same ambiguity). usePresence() tells us which
 * instance is currently exiting so it can be pulled out of the
 * accessibility tree and made non-interactive immediately, while still
 * being visually present for the animation.
 */
export function FormScreenGate({ children }: { children: React.ReactNode }) {
  const [isPresent] = usePresence();

  return (
    <div aria-hidden={!isPresent} style={{ pointerEvents: isPresent ? "auto" : "none" }}>
      {children}
    </div>
  );
}
