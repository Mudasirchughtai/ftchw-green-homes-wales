/**
 * Green Homes Wales -- lead-append Apps Script.
 *
 * Deploy inside the "Green Homes Wales Leads" Sheet:
 *   Extensions -> Apps Script -> paste this file (replacing Code.gs) ->
 *   set SHARED_SECRET below -> Deploy -> New deployment -> type "Web app" ->
 *   Execute as "Me", Who has access "Anyone" -> Deploy -> copy the Web app URL.
 *
 * See docs/GOOGLE_SHEETS_SETUP.md for the full walkthrough.
 */

// Paste a long random string here (e.g. from `openssl rand -hex 32`), and
// set the SAME value as GOOGLE_SHEETS_WEBHOOK_TOKEN in Vercel. Without a
// matching token, requests are rejected -- this is the only thing stopping
// a stranger who finds the URL from writing arbitrary rows into your Sheet.
const SHARED_SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET";

const TAB_NAME = "Leads";

// Must stay in this exact order -- matches row 1 of the Sheet and the
// payload sent from lib/googleSheets.ts.
const COLUMNS = [
  "submission_id",
  "submitted_at",
  "full_name",
  "phone",
  "email",
  "postcode",
  "property_location",
  "ownership_status",
  "occupancy_status",
  "property_type",
  "listed_property",
  "new_build_under_six_months",
  "mains_gas_grid",
  "existing_heating",
  "funding_route",
  "eligibility_summary",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "landing_page",
  "referrer",
  "enquiry_consent",
  "marketing_consent",
  "consent_version",
  "privyr_status",
  "google_sheets_status",
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.token !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: "unauthorized" }, 401);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: `Tab "${TAB_NAME}" not found` }, 500);
    }

    // Idempotency: skip if this submission_id is already present (column A).
    // getRange() throws if asked for 0 rows, which happens whenever the
    // sheet only has the header row and no data yet -- guard for that.
    const lastRow = sheet.getLastRow();
    const existingIds = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat() : [];
    if (existingIds.includes(body.lead.submission_id)) {
      return jsonResponse({ ok: true, duplicate: true });
    }

    const row = COLUMNS.map((key) => body.lead[key] ?? "");
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  // Apps Script web apps can't set a real HTTP status code on the response;
  // status is included in the body instead for the caller to check.
  obj.status = status || 200;
  output.setContent(JSON.stringify(obj));
  return output;
}
