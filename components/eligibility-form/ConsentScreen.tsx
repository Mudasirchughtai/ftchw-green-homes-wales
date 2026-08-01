"use client";

import { forwardRef } from "react";
import {
  ENQUIRY_CONSENT_LINK_TEXT,
  ENQUIRY_CONSENT_PREFIX,
  ENQUIRY_CONSENT_SUFFIX,
  MARKETING_CONSENT_TEXT,
} from "@/config/consent";
import type { ConsentAnswers } from "@/lib/types";

interface ConsentScreenProps {
  consent: ConsentAnswers;
  error?: string;
  onChange: (consent: ConsentAnswers) => void;
}

export const ConsentScreen = forwardRef<HTMLHeadingElement, ConsentScreenProps>(function ConsentScreen(
  { consent, error, onChange },
  headingRef,
) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-brand-900 focus:outline-none">
        Just one more step
      </h2>
      <p className="mt-1 text-sm text-ink-light">Please confirm how we can use your details.</p>

      <div className="mt-5 space-y-4">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 flex-none accent-brand-700"
            checked={consent.enquiryConsent}
            onChange={(e) => onChange({ ...consent, enquiryConsent: e.target.checked })}
            aria-describedby={error ? "enquiry-consent-error" : undefined}
          />
          <span>
            {ENQUIRY_CONSENT_PREFIX}
            <a href="/privacy-policy" className="text-brand-700 underline hover:text-brand-900">
              {ENQUIRY_CONSENT_LINK_TEXT}
            </a>
            {ENQUIRY_CONSENT_SUFFIX}
          </span>
        </label>
        {error && (
          <p id="enquiry-consent-error" role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 flex-none accent-brand-700"
            checked={consent.marketingConsent}
            onChange={(e) => onChange({ ...consent, marketingConsent: e.target.checked })}
          />
          <span>{MARKETING_CONSENT_TEXT}</span>
        </label>
      </div>
    </div>
  );
});
