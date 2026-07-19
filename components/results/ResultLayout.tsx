import { CONTACT_PHONE_HREF } from "@/config/contact";

interface ResultLayoutProps {
  eyebrow: string;
  headline: string;
  copy: string;
  ctaLabel: string;
  ctaHref?: string;
}

export function ResultLayout({
  eyebrow,
  headline,
  copy,
  ctaLabel,
  ctaHref = CONTACT_PHONE_HREF,
}: ResultLayoutProps) {
  return (
    <div className="card w-full max-w-xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-brand-900">{headline}</h2>
      <p className="mt-4 text-ink-light">{copy}</p>

      <a href={ctaHref} className="btn-primary mt-6 w-full">
        {ctaLabel}
      </a>

      <p className="mt-5 text-xs text-ink-light">
        No obligation. Eligibility and funding are subject to assessment and approval. First Time
        Central Heating Wales is an independent marketing and installer-introduction service and
        does not award grants, approve finance or carry out installations.
      </p>
    </div>
  );
}
