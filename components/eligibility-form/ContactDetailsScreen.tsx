"use client";

import { forwardRef } from "react";
import { inputClass } from "@/components/eligibility-form/fieldStyles";
import type { ContactAnswers } from "@/lib/types";

interface ContactDetailsScreenProps {
  values: ContactAnswers;
  errors: Record<string, string>;
  onChange: (values: ContactAnswers) => void;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const ContactDetailsScreen = forwardRef<HTMLHeadingElement, ContactDetailsScreenProps>(
  function ContactDetailsScreen({ values, errors, onChange }, headingRef) {
    const set = <K extends keyof ContactAnswers>(key: K, value: ContactAnswers[K]) =>
      onChange({ ...values, [key]: value });

    return (
      <div>
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold text-brand-900 focus:outline-none">
          Your Initial Results Are Ready
        </h2>
        <p className="mt-1 text-sm text-ink-light">
          Enter your details so a member of the team can review your answers and explain the most
          relevant funding and installation options.
        </p>

        <div className="mt-5 space-y-4">
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <input
              id="fullName"
              className={inputClass}
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
          </Field>
          <Field id="phone" label="Phone number" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              className={inputClass}
              autoComplete="tel"
              placeholder="07XXX XXXXXX or +44"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </Field>
          <Field id="email" label="Email address" error={errors.email}>
            <input
              id="email"
              type="email"
              className={inputClass}
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>
        </div>
      </div>
    );
  },
);
