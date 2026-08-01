/**
 * Central source of truth for consent wording and version. Referenced by
 * the form UI and recorded verbatim (via CONSENT_VERSION) with every lead --
 * change the version whenever the wording changes.
 *
 * This wording should still be reviewed by the business's legal/data
 * protection adviser before production deployment.
 */
export const CONSENT_VERSION = "ghw-v1";

export const ENQUIRY_CONSENT_PREFIX =
  "I agree that First Time Central Heating Wales and an appropriately accredited installation or retrofit professional may contact me about this enquiry. I have read the ";
export const ENQUIRY_CONSENT_LINK_TEXT = "Privacy Policy";
export const ENQUIRY_CONSENT_SUFFIX = ".";

export const MARKETING_CONSENT_TEXT =
  "I would also like to receive occasional information about relevant home-energy products, services and funding opportunities. I understand that I can unsubscribe at any time.";
