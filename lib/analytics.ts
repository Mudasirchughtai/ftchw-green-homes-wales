"use client";

/**
 * Thin wrapper around gtag/fbq. Never pass name/email/phone/full postcode --
 * only route/funnel-shaped data. Events silently no-op if the relevant
 * script hasn't loaded (e.g. analytics consent declined, or the env var for
 * that provider isn't configured) -- see components/analytics/Analytics.tsx.
 */

type EventName =
  | "eligibility_form_view"
  | "eligibility_form_start"
  | "eligibility_step_complete"
  | "eligibility_validation_error"
  | "eligibility_result_view"
  | "lead_submit_attempt"
  | "lead_submit_success"
  | "lead_submit_failure"
  | "phone_cta_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: EventName, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, params);

  // Only the confirmed-success event maps to Meta's standard Lead event --
  // never fired on form-open, last-question-reached, or submit-attempt.
  if (name === "lead_submit_success") {
    window.fbq?.("track", "Lead", params);
  }
}
