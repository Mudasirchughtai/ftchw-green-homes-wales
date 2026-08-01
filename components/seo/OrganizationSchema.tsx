import { CONTACT_EMAIL, CONTACT_PHONE_HREF } from "@/config/contact";
import { LEGAL_ENTITY_NAME, isLegalEntityConfigured } from "@/config/company";
import { SITE_URL } from "@/lib/site";

/**
 * Only includes fields we can actually confirm. Legal entity name is
 * omitted entirely (not just left blank) until it's configured -- adding
 * unconfirmed/invented data to Organization markup is exactly what
 * CLAUDE.md and the SEO brief both prohibit.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "First Time Central Heating Wales",
    ...(isLegalEntityConfigured ? { legalName: LEGAL_ENTITY_NAME } : {}),
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_HREF.replace("tel:", ""),
    areaServed: "Wales",
    description:
      "Independent Welsh homeowner enquiry and installer-matching service for heating grants and funding.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "First Time Central Heating Wales",
    url: SITE_URL,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}
