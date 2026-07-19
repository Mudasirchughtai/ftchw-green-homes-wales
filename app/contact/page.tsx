import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/config/contact";

export const metadata: Metadata = { title: "Contact Us | First Time Central Heating Wales" };

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us">
      <p>
        Have a question about the Boiler Upgrade Scheme, Green Homes Wales funding or your
        enquiry? Get in touch using either method below.
      </p>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row">
        <a href={CONTACT_PHONE_HREF} className="btn-primary">
          Call {CONTACT_PHONE_DISPLAY}
        </a>
        <a href={CONTACT_EMAIL_HREF} className="btn-secondary">
          Email {CONTACT_EMAIL}
        </a>
      </div>

      <p className="mt-6">
        First Time Central Heating Wales is an independent marketing and installer-introduction
        service and does not award grants, approve finance or carry out installations.
      </p>
    </LegalPageLayout>
  );
}
