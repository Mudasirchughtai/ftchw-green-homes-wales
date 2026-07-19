"use client";

import type { BestContactTime, ConsentAnswers, PreferredContactMethod, Step4Answers } from "@/lib/types";

interface Step4ContactProps {
  values: Step4Answers;
  consent: ConsentAnswers;
  errors: Record<string, string>;
  onChange: (values: Step4Answers) => void;
  onConsentChange: (consent: ConsentAnswers) => void;
}

const CONTACT_METHODS: { value: PreferredContactMethod; label: string }[] = [
  { value: "telephone", label: "Telephone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

const CONTACT_TIMES: { value: BestContactTime; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "anytime", label: "Anytime" },
];

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-brand-100 bg-cream-100 px-4 py-3 text-base text-ink " +
  "focus:border-brand-500 focus:outline-none";

export function Step4Contact({ values, consent, errors, onChange, onConsentChange }: Step4ContactProps) {
  const set = <K extends keyof Step4Answers>(key: K, value: Step4Answers[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-brand-900">Your Initial Results Are Ready</h2>
      <p className="mt-2 text-ink-light">
        Enter your details so a member of the team can review your answers and explain the most
        relevant funding and installation options.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <input
            id="firstName"
            className={inputClass}
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <input
            id="lastName"
            className={inputClass}
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
          />
        </Field>
        <Field id="mobile" label="Mobile number" error={errors.mobile}>
          <input
            id="mobile"
            type="tel"
            className={inputClass}
            autoComplete="tel"
            placeholder="07XXX XXXXXX"
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value)}
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
          />
        </Field>
        <Field id="postcode" label="Full postcode" error={errors.postcode}>
          <input
            id="postcode"
            className={inputClass}
            autoComplete="postal-code"
            value={values.postcode}
            onChange={(e) => set("postcode", e.target.value.toUpperCase())}
          />
        </Field>
        <Field id="addressLine1" label="First line of address" error={errors.addressLine1}>
          <input
            id="addressLine1"
            className={inputClass}
            autoComplete="address-line1"
            value={values.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
          />
        </Field>
        <Field id="preferredContactMethod" label="Preferred contact method">
          <select
            id="preferredContactMethod"
            className={inputClass}
            value={values.preferredContactMethod ?? ""}
            onChange={(e) => set("preferredContactMethod", e.target.value as PreferredContactMethod)}
          >
            <option value="" disabled>
              Select an option
            </option>
            {CONTACT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="bestContactTime" label="Best time to contact">
          <select
            id="bestContactTime"
            className={inputClass}
            value={values.bestContactTime ?? ""}
            onChange={(e) => set("bestContactTime", e.target.value as BestContactTime)}
          >
            <option value="" disabled>
              Select an option
            </option>
            {CONTACT_TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 space-y-4 border-t border-brand-100 pt-5">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 flex-none accent-brand-700"
            checked={consent.serviceContactConsent}
            onChange={(e) => onConsentChange({ ...consent, serviceContactConsent: e.target.checked })}
          />
          <span>
            I agree that First Time Central Heating Wales may contact me about my enquiry and share
            my details with an appropriately accredited installer or retrofit professional operating
            in Wales. I understand that First Time Central Heating Wales is an independent marketing
            and introduction service and does not award grants, approve finance or carry out
            installations.
          </span>
        </label>
        {errors.serviceContactConsent && (
          <p role="alert" className="text-sm text-red-700">
            {errors.serviceContactConsent}
          </p>
        )}

        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 flex-none accent-brand-700"
            checked={consent.marketingConsent}
            onChange={(e) => onConsentChange({ ...consent, marketingConsent: e.target.checked })}
          />
          <span>
            I would also like to receive occasional information about relevant home-energy grants,
            funding and services. I can opt out at any time.
          </span>
        </label>
      </div>
    </div>
  );
}
