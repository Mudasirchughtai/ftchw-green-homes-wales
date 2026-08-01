"use client";

import { forwardRef } from "react";
import { inputClass } from "@/components/eligibility-form/fieldStyles";

interface PostcodeScreenProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const PostcodeScreen = forwardRef<HTMLHeadingElement, PostcodeScreenProps>(function PostcodeScreen(
  { value, error, onChange },
  headingRef,
) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-brand-900 focus:outline-none">
        What is the property&rsquo;s postcode?
      </h2>
      <p className="mt-1 text-sm text-ink-light">Used to help identify the applicable scheme area.</p>
      <div className="mt-5">
        <label htmlFor="postcode" className="sr-only">
          Postcode
        </label>
        <input
          id="postcode"
          className={inputClass}
          autoComplete="postal-code"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "postcode-error" : undefined}
        />
        {error && (
          <p id="postcode-error" role="alert" className="mt-1.5 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
});
