import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/config/contact";

export const metadata: Metadata = { title: "Complaints Procedure | First Time Central Heating Wales" };

export default function ComplaintsProcedurePage() {
  return (
    <LegalPageLayout title="Complaints Procedure">
      <p>
        If you are unhappy with any part of your enquiry, the information you were given, or an
        introduction made on your behalf, you can raise it with us directly:
      </p>
      <p>
        Phone: <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>
        <br />
        Email: <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
      </p>
      <p>
        This page is a placeholder for the full complaints procedure, including target response
        times and escalation routes, which will be published here before the site goes live.
      </p>
    </LegalPageLayout>
  );
}
