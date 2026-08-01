import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE_DISPLAY } from "@/config/contact";
import { getLegalEntityLine, isLegalEntityConfigured } from "@/config/company";
import { PhoneCtaLink } from "@/components/common/PhoneCtaLink";

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/complaints-procedure", label: "Complaints Procedure" },
  { href: "/funding-and-grant-disclaimer", label: "Funding and Grant Disclaimer" },
  { href: "/how-we-select-installers", label: "How We Select Installers" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-900 px-4 py-10 text-brand-100">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <PhoneCtaLink className="text-white transition-colors hover:text-gold-300">
            {CONTACT_PHONE_DISPLAY}
          </PhoneCtaLink>
          <a href={CONTACT_EMAIL_HREF} className="text-white transition-colors hover:text-gold-300">
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Legal" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm">
          {LEGAL_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-brand-100 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Condensed from docs/original-brief.md -> "FULL FOOTER DISCLAIMER" at the client's request. */}
        <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs leading-relaxed text-brand-200">
          {!isLegalEntityConfigured && (
            <p className="rounded-lg border-2 border-dashed border-red-400 bg-red-950/40 p-3 font-semibold text-red-200">
              ⚠ DEV WARNING — LEGAL ENTITY DETAILS NOT CONFIGURED. Do not publish to production
              until LEGAL_ENTITY_NAME, COMPANY_NUMBER and REGISTERED_ADDRESS are set (see
              docs/DEPLOYMENT_CHECKLIST.md). A real production deploy is blocked until this is
              resolved.
            </p>
          )}
          <p>
            First Time Central Heating Wales is a marketing and homeowner-introduction service
            operated by {getLegalEntityLine()} We are not Welsh Government, Ofgem, the
            Development Bank of Wales, the Green Homes Wales scheme, a grant-awarding body,
            lender, financial adviser or installation contractor — we introduce homeowners to
            independent, appropriately accredited installers and retrofit professionals
            operating in Wales.
          </p>
          <p>
            Grant, funding and finance eligibility is not guaranteed and is determined by the
            relevant scheme administrator, finance provider, installer or retrofit professional,
            subject to status, affordability and credit checks. Boiler Upgrade Scheme grant
            levels — including the enhanced £9,000 grant — depend on the installed technology,
            existing heating system, property circumstances and applicable scheme rules and dates.
          </p>
        </div>

        <p className="mt-6 text-xs text-brand-300">
          © {new Date().getFullYear()} First Time Central Heating Wales. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
