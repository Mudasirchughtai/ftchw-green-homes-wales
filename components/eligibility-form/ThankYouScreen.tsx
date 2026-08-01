import { motion } from "framer-motion";
import { getRouteMessage } from "@/components/eligibility-form/routeMessages";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/config/contact";
import type { FundingRoute } from "@/lib/types";

interface ThankYouScreenProps {
  fundingRoute: FundingRoute;
  submissionId: string;
}

export function ThankYouScreen({ fundingRoute, submissionId }: ThankYouScreenProps) {
  const { headline, copy } = getRouteMessage(fundingRoute);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card w-full max-w-xl text-center"
    >
      <h2 tabIndex={-1} className="text-2xl font-semibold text-brand-900 focus:outline-none">
        Thank you — we have received your eligibility enquiry
      </h2>

      <p className="mt-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm font-semibold text-brand-900">
        {headline}
      </p>
      <p className="mt-3 text-sm text-ink-light">{copy}</p>

      <p className="mt-4 text-ink-light">
        Based on the information supplied, a member of the team will review the potential funding
        routes for your property. Where appropriate, your enquiry may be shared with an
        independent, appropriately accredited installer or retrofit professional operating in
        Wales.
      </p>

      <ul className="mt-4 space-y-1.5 text-left text-sm text-ink-light">
        <li>• Completing the enquiry does not guarantee a grant, funding or installation.</li>
        <li>• You have not committed to a finance or installation agreement.</li>
        <li>• Final eligibility depends on scheme rules, assessment and approval.</li>
        <li>• The team may contact you using the phone number or email you supplied.</li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={CONTACT_PHONE_HREF} className="btn-primary">
          Call {CONTACT_PHONE_DISPLAY}
        </a>
        <a href="/green-homes-wales" className="btn-secondary">
          Return to Homepage
        </a>
      </div>

      <p className="mt-5 text-xs text-ink-light">Submission reference: {submissionId}</p>
    </motion.div>
  );
}
