"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OptionButton } from "@/components/eligibility-form/OptionButton";
import { FormScreenGate } from "@/components/eligibility-form/FormScreenGate";
import { ProgressIndicator } from "@/components/eligibility-form/ProgressIndicator";
import { QUALIFICATION_QUESTIONS, TOTAL_SCREENS } from "@/components/eligibility-form/schema";
import { PostcodeScreen } from "@/components/eligibility-form/PostcodeScreen";
import { ContactDetailsScreen } from "@/components/eligibility-form/ContactDetailsScreen";
import { ConsentScreen } from "@/components/eligibility-form/ConsentScreen";
import { TurnstileWidget } from "@/components/eligibility-form/TurnstileWidget";
import { ThankYouScreen } from "@/components/eligibility-form/ThankYouScreen";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { generateSubmissionId } from "@/lib/submissionId";
import { isValidEmail, isValidUkPhone, isValidUkPostcode } from "@/lib/validation";
import type { ConsentAnswers, ContactAnswers, FundingRoute, QualificationAnswers } from "@/lib/types";

const STORAGE_KEY = "ftchw_green_homes_wales_form_v1";

const EMPTY_QUALIFICATION: QualificationAnswers = {
  propertyLocation: null,
  ownershipStatus: null,
  occupancyStatus: null,
  listedProperty: null,
  newBuildUnderSixMonths: null,
  mainsGasGrid: null,
  existingHeating: null,
  propertyType: null,
  postcode: "",
};

const EMPTY_CONTACT: ContactAnswers = { fullName: "", phone: "", email: "" };
const EMPTY_CONSENT: ConsentAnswers = { enquiryConsent: false, marketingConsent: false };

const POSTCODE_SCREEN_INDEX = QUALIFICATION_QUESTIONS.length; // 8
const CONTACT_SCREEN_INDEX = POSTCODE_SCREEN_INDEX + 1; // 9
const CONSENT_SCREEN_INDEX = CONTACT_SCREEN_INDEX + 1; // 10

interface PersistedState {
  qualification: QualificationAnswers;
  contact: ContactAnswers;
  consent: ConsentAnswers;
  index: number;
  submissionId: string;
  formLoadedAt: number;
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({ x: direction * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction * -48, opacity: 0 }),
};

export function EligibilityForm() {
  const [qualification, setQualification] = useState<QualificationAnswers>(EMPTY_QUALIFICATION);
  const [contact, setContact] = useState<ContactAnswers>(EMPTY_CONTACT);
  const [consent, setConsent] = useState<ConsentAnswers>(EMPTY_CONSENT);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  // Locks Back/Continue/options for the ~250ms slide transition. Without
  // this, rapid clicks (a fast user, keyboard navigation, or automated
  // tests) can land while both the outgoing and incoming screens are still
  // mounted together, producing duplicate-labelled interactive elements --
  // confirmed via cross-browser testing, not hypothetical.
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionSafetyTimer = useRef<ReturnType<typeof setTimeout>>();
  const [submissionId, setSubmissionId] = useState<string>("");
  const [formLoadedAt, setFormLoadedAt] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fundingRoute: FundingRoute } | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasViewedRef = useRef(false);

  // Resume from localStorage after mount (avoids SSR/hydration mismatch),
  // otherwise start a fresh session with a stable submission id.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PersistedState;
        setQualification(parsed.qualification);
        setContact(parsed.contact);
        setConsent(parsed.consent);
        setIndex(parsed.index);
        setSubmissionId(parsed.submissionId);
        setFormLoadedAt(parsed.formLoadedAt);
        if (parsed.index > 0) setHasStarted(true);
        return;
      }
    } catch {
      // corrupt/old storage shape -- fall through to a fresh session
    }
    setSubmissionId(generateSubmissionId());
    setFormLoadedAt(Date.now());
  }, []);

  useEffect(() => {
    if (!hasViewedRef.current) {
      hasViewedRef.current = true;
      trackEvent("eligibility_form_view");
    }
  }, []);

  // Persist on every change, except once a result has been confirmed.
  useEffect(() => {
    if (!submissionId || result) return;
    const state: PersistedState = { qualification, contact, consent, index, submissionId, formLoadedAt };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [qualification, contact, consent, index, submissionId, formLoadedAt, result]);

  // Focus moves to the new question heading after every step change.
  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  useEffect(() => () => clearTimeout(transitionSafetyTimer.current), []);

  const isQualificationScreen = index < POSTCODE_SCREEN_INDEX;
  const currentQuestion = isQualificationScreen ? QUALIFICATION_QUESTIONS[index] : null;

  const canContinue = useMemo(() => {
    if (isQualificationScreen && currentQuestion) {
      return Boolean(qualification[currentQuestion.id as keyof QualificationAnswers]);
    }
    if (index === POSTCODE_SCREEN_INDEX) return qualification.postcode.trim().length > 0;
    if (index === CONTACT_SCREEN_INDEX) {
      return Boolean(contact.fullName.trim() && contact.phone.trim() && contact.email.trim());
    }
    if (index === CONSENT_SCREEN_INDEX) return consent.enquiryConsent;
    return false;
  }, [isQualificationScreen, currentQuestion, qualification, contact, consent, index]);

  function selectSingle(id: string, value: string) {
    setQualification((prev) => ({ ...prev, [id]: value }));
    trackEvent("eligibility_step_complete", { question: id });
  }

  function navigateTo(nextIndex: number, dir: 1 | -1) {
    setIsTransitioning(true);
    setDirection(dir);
    setIndex(nextIndex);
    clearTimeout(transitionSafetyTimer.current);
    // Cleared for real by AnimatePresence's onExitComplete below; this is
    // just a safety net in case that callback doesn't fire.
    transitionSafetyTimer.current = setTimeout(() => setIsTransitioning(false), 400);
  }

  function goBack() {
    navigateTo(Math.max(0, index - 1), -1);
  }

  function reportValidationError(field: string, message: string) {
    trackEvent("eligibility_validation_error", { field });
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  async function handleContinue() {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("eligibility_form_start");
    }

    if (index === POSTCODE_SCREEN_INDEX) {
      if (!isValidUkPostcode(qualification.postcode)) {
        reportValidationError("postcode", "Enter a valid UK postcode.");
        return;
      }
      setErrors({});
      navigateTo(index + 1, 1);
      return;
    }

    if (index === CONTACT_SCREEN_INDEX) {
      const nextErrors: Record<string, string> = {};
      if (!contact.fullName.trim()) nextErrors.fullName = "Enter your full name.";
      if (!isValidUkPhone(contact.phone)) nextErrors.phone = "Enter a valid UK phone number.";
      if (!isValidEmail(contact.email)) nextErrors.email = "Enter a valid email address.";
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        Object.keys(nextErrors).forEach((field) => trackEvent("eligibility_validation_error", { field }));
        return;
      }
      setErrors({});
      navigateTo(index + 1, 1);
      return;
    }

    if (index === CONSENT_SCREEN_INDEX) {
      if (!consent.enquiryConsent) {
        reportValidationError("enquiryConsent", "Please confirm you're happy for us to contact you.");
        return;
      }
      setErrors({});
      await submit();
      return;
    }

    // Qualification (single-choice) screens.
    navigateTo(Math.min(TOTAL_SCREENS - 1, index + 1), 1);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    trackEvent("lead_submit_attempt");
    try {
      const attribution = captureAttribution();
      const res = await fetch("/api/leads/green-homes-wales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qualification,
          contact,
          consent,
          attribution,
          honeypot,
          formLoadedAt,
          submissionId,
          turnstileToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.errors?.join(", ") || "Something went wrong. Please try again.");
      }
      trackEvent("lead_submit_success", { funding_route: data.fundingRoute });
      trackEvent("eligibility_result_view", { funding_route: data.fundingRoute });
      window.localStorage.removeItem(STORAGE_KEY);
      setResult({ fundingRoute: data.fundingRoute });
    } catch (err) {
      trackEvent("lead_submit_failure");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canContinue && !submitting && !isTransitioning) {
      e.preventDefault();
      handleContinue();
    }
  }

  if (result) {
    return <ThankYouScreen fundingRoute={result.fundingRoute} submissionId={submissionId} />;
  }

  return (
    <div className="card w-full max-w-xl overflow-hidden" onKeyDown={handleKeyDown}>
      <ProgressIndicator current={index + 1} total={TOTAL_SCREENS} />

      {/* Honeypot -- hidden from real users, bots often fill every field. */}
      <input
        type="text"
        name="company_website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {/* mode="sync" (the default -- no mode prop), not "wait": with "wait",
          cross-browser testing showed the exit-complete callback not
          firing reliably in WebKit, leaving the next screen never mounted.
          Both screens now animate concurrently instead -- which is exactly
          why FormScreenGate below is essential, not decorative: for that
          ~250ms overlap, the outgoing screen's fieldset/buttons are still
          in the DOM at the same time as the incoming screen's, and several
          questions share option labels ("Yes"/"No"). Without gating, that's
          two elements with the same accessible name/role simultaneously --
          confirmed as a real, reproducible bug (not just a test artifact)
          across Chrome and WebKit alike. isTransitioning additionally
          locks Back/Continue for the same window as a UX nicety. */}
      <AnimatePresence custom={direction} initial={false} onExitComplete={() => setIsTransitioning(false)}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <FormScreenGate>
          {isQualificationScreen && currentQuestion && (
            <fieldset>
              {/* role="heading" -- a bare <legend> has no implicit heading
                  role, so without this, 8 of the 11 "question headings" the
                  form is supposed to expose would be invisible to
                  screen-reader heading navigation. */}
              <legend
                ref={headingRef as unknown as React.RefObject<HTMLLegendElement>}
                role="heading"
                aria-level={2}
                tabIndex={-1}
                className="text-xl font-semibold text-brand-900 focus:outline-none"
              >
                {currentQuestion.question}
              </legend>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    label={opt.label}
                    selected={qualification[currentQuestion.id as keyof QualificationAnswers] === opt.value}
                    onClick={() => selectSingle(currentQuestion.id, opt.value)}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {index === POSTCODE_SCREEN_INDEX && (
            <PostcodeScreen
              ref={headingRef}
              value={qualification.postcode}
              error={errors.postcode}
              onChange={(value) => setQualification((prev) => ({ ...prev, postcode: value }))}
            />
          )}

          {index === CONTACT_SCREEN_INDEX && (
            <ContactDetailsScreen ref={headingRef} values={contact} errors={errors} onChange={setContact} />
          )}

          {index === CONSENT_SCREEN_INDEX && (
            <ConsentScreen ref={headingRef} consent={consent} error={errors.enquiryConsent} onChange={setConsent} />
          )}
          </FormScreenGate>
        </motion.div>
      </AnimatePresence>

      {index === CONSENT_SCREEN_INDEX && (
        <TurnstileWidget onVerify={setTurnstileToken} />
      )}

      {submitError && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>{submitError}</p>
          <p className="mt-1 text-xs">Your answers have been kept -- press Retry to try again.</p>
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={index === 0 || submitting || isTransitioning}
          className="text-sm font-semibold text-brand-800 underline-offset-4 hover:underline disabled:opacity-0"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || submitting || isTransitioning}
          className="btn-primary flex-1 sm:flex-none"
        >
          {submitting
            ? "Submitting…"
            : submitError
              ? "Retry"
              : index === CONSENT_SCREEN_INDEX
                ? "Submit My Enquiry"
                : "Continue"}
        </button>
      </div>
    </div>
  );
}
