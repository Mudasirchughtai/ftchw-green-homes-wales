"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OptionButton } from "@/components/eligibility-form/OptionButton";
import { ProgressIndicator } from "@/components/eligibility-form/ProgressIndicator";
import { QUESTIONS, TOTAL_STEPS } from "@/components/eligibility-form/schema";
import { Step4Contact } from "@/components/eligibility-form/Step4Contact";
import { ResultRenderer } from "@/components/results/ResultRenderer";
import { captureAttribution } from "@/lib/attribution";
import { isValidEmail, isValidUkMobile, isValidUkPostcode } from "@/lib/validation";
import type {
  ConsentAnswers,
  EligibilityFormState,
  LeadResult,
  Step4Answers,
} from "@/lib/types";

const EMPTY_STEP4: Step4Answers = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  postcode: "",
  addressLine1: "",
  preferredContactMethod: null,
  bestContactTime: null,
};

const EMPTY_CONSENT: ConsentAnswers = {
  serviceContactConsent: false,
  marketingConsent: false,
};

const SLIDE_DISTANCE = 48;

const slideVariants = {
  enter: (direction: 1 | -1) => ({ x: direction * SLIDE_DISTANCE, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction * -SLIDE_DISTANCE, opacity: 0 }),
};

type AnswerMap = Record<string, string | string[] | null>;

function buildFormState(answers: AnswerMap, step4: Step4Answers, consent: ConsentAnswers): EligibilityFormState {
  return {
    step1: {
      inWales: (answers.inWales as EligibilityFormState["step1"]["inWales"]) ?? null,
      ownership: (answers.ownership as EligibilityFormState["step1"]["ownership"]) ?? null,
      mainResidence: (answers.mainResidence as EligibilityFormState["step1"]["mainResidence"]) ?? null,
    },
    step2: {
      currentHeating: (answers.currentHeating as EligibilityFormState["step2"]["currentHeating"]) ?? null,
      onMainsGas: (answers.onMainsGas as EligibilityFormState["step2"]["onMainsGas"]) ?? null,
      replacementTimescale:
        (answers.replacementTimescale as EligibilityFormState["step2"]["replacementTimescale"]) ?? null,
    },
    step3: {
      propertyType: (answers.propertyType as EligibilityFormState["step3"]["propertyType"]) ?? null,
      propertyAge: (answers.propertyAge as EligibilityFormState["step3"]["propertyAge"]) ?? null,
      listed: (answers.listed as EligibilityFormState["step3"]["listed"]) ?? null,
      improvements: (answers.improvements as string[] | undefined)?.length
        ? (answers.improvements as EligibilityFormState["step3"]["improvements"])
        : [],
    },
    step4,
    consent,
  };
}

export function EligibilityForm() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [step4, setStep4] = useState<Step4Answers>(EMPTY_STEP4);
  const [consent, setConsent] = useState<ConsentAnswers>(EMPTY_CONSENT);
  const [index, setIndex] = useState(0); // 0..QUESTIONS.length-1 = questions, QUESTIONS.length = contact step
  const [direction, setDirection] = useState<1 | -1>(1);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadResult | null>(null);

  const totalScreens = QUESTIONS.length + 1;
  const isContactScreen = index === QUESTIONS.length;
  const currentQuestion = isContactScreen ? null : QUESTIONS[index];

  const currentStepNumber = isContactScreen ? TOTAL_STEPS : currentQuestion?.stepNumber ?? 1;
  const percentComplete = ((index + 1) / totalScreens) * 100;

  const canContinue = useMemo(() => {
    if (isContactScreen) return true;
    if (!currentQuestion) return false;
    const value = answers[currentQuestion.id];
    return currentQuestion.type === "multi" ? Array.isArray(value) && value.length > 0 : Boolean(value);
  }, [answers, currentQuestion, isContactScreen]);

  function selectSingle(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(id: string, value: string) {
    setAnswers((prev) => {
      const current = (prev[id] as string[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [id]: next };
    });
  }

  function goBack() {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }

  function validateContact(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!step4.firstName.trim()) next.firstName = "First name is required.";
    if (!step4.lastName.trim()) next.lastName = "Last name is required.";
    if (!isValidUkMobile(step4.mobile)) next.mobile = "Enter a valid UK mobile number.";
    if (!isValidEmail(step4.email)) next.email = "Enter a valid email address.";
    if (!isValidUkPostcode(step4.postcode)) next.postcode = "Enter a valid UK postcode.";
    if (!step4.addressLine1.trim()) next.addressLine1 = "Address is required.";
    if (!consent.serviceContactConsent) {
      next.serviceContactConsent = "Please confirm you're happy for us to contact you.";
    }
    return next;
  }

  async function handleContinue() {
    if (!isContactScreen) {
      setDirection(1);
      setIndex((i) => Math.min(totalScreens - 1, i + 1));
      return;
    }

    const validationErrors = validateContact();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const attribution = captureAttribution();
      const formState = buildFormState(answers, step4, consent);
      const res = await fetch("/api/leads/green-homes-wales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, attribution, honeypot }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.errors?.join(", ") || "Something went wrong. Please try again.");
      }
      setResult({ result: data.result, priority: data.priority, tags: [] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ResultRenderer result={result.result} />
      </motion.div>
    );
  }

  return (
    <div className="card w-full max-w-xl overflow-hidden">
      <ProgressIndicator step={currentStepNumber} totalSteps={TOTAL_STEPS} percent={percentComplete} />

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

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {isContactScreen ? (
            <Step4Contact
              values={step4}
              consent={consent}
              errors={errors}
              onChange={setStep4}
              onConsentChange={setConsent}
            />
          ) : (
            currentQuestion && (
              <fieldset>
                <legend className="text-xl font-semibold text-brand-900">{currentQuestion.question}</legend>
                {currentQuestion.type === "multi" && currentQuestion.helpText && (
                  <p className="mt-1 text-sm text-ink-light">{currentQuestion.helpText}</p>
                )}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((opt) => {
                    const value = answers[currentQuestion.id];
                    const selected =
                      currentQuestion.type === "multi"
                        ? Array.isArray(value) && value.includes(opt.value)
                        : value === opt.value;
                    return (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={selected}
                        onClick={() =>
                          currentQuestion.type === "multi"
                            ? toggleMulti(currentQuestion.id, opt.value)
                            : selectSingle(currentQuestion.id, opt.value)
                        }
                      />
                    );
                  })}
                </div>
              </fieldset>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={index === 0 || submitting}
          className="text-sm font-semibold text-brand-800 underline-offset-4 hover:underline disabled:opacity-0"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || submitting}
          className="btn-primary flex-1 sm:flex-none"
        >
          {submitting ? "Submitting…" : isContactScreen ? "Show My Funding Options" : "Continue"}
        </button>
      </div>
    </div>
  );
}
