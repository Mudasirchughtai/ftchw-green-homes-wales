# Privyr CRM Setup

## 1. Webhook URL

Set the Privyr webhook/integration URL (with any account-specific auth or
licence parameters the account owner supplies) as:

```
PRIVYR_WEBHOOK_URL=
```

in your deployment environment (Vercel project settings) or `.env.local`
for local testing. **Never** commit this value or reference it from
client-side code — it's only read server-side in `lib/privyr.ts`.

If `PRIVYR_WEBHOOK_URL` is unset, the app still works: leads are saved to
the local backup file (`data/leads.jsonl` in dev; see
`docs/DEPLOYMENT_CHECKLIST.md` for why that's not sufficient for
production) and the visitor still sees the thank-you screen, but nothing
reaches Privyr. Check server logs for `"Privyr delivery failed"` (personal
data is redacted in those logs — see `lib/logger.ts`).

## 2. Primary field mapping

Sent as top-level fields on every request:

| Privyr field | Source |
|---|---|
| `name` | `contact.fullName` |
| `phone` | Normalised E.164 UK number (e.g. `+447911123456`) |
| `email` | Lower-cased, trimmed email |

## 3. Additional fields

All sent as flat string properties on the same JSON payload (see
`lib/privyr.ts` → `buildPrivyrPayload`):

```
lead_source, form_reference, funding_route, eligibility_summary,
property_location, ownership_status, occupancy_status, listed_property,
new_build_under_six_months, mains_gas_grid, existing_heating,
property_type, postcode, original_phone, landing_page, referrer,
enquiry_consent, marketing_consent, consent_version, submitted_at,
submission_id, notes
```

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`gclid`, `fbclid` are included **only when present** on that visit — they
are omitted entirely (not sent as empty strings) when not captured.

## 4. Funding route values (exact, case-sensitive)

These come from `lib/privyrFieldLabels.ts` → `FUNDING_ROUTE_LABELS`. Use
these exact strings — not variants — in any Privyr filter/automation rule:

| Internal `FundingRoute` | Privyr `funding_route` value |
|---|---|
| `potential_enhanced_bus` | `Potential £9k BUS` |
| `potential_standard_bus` | `Potential Standard BUS` |
| `potential_green_homes_wales` | `Green Homes Wales Finance` |
| `potential_both_routes` | `Potential BUS + Green Homes Wales` |
| `manual_review` | `Manual Review` |
| `outside_welsh_service_area` | `Outside Welsh Service Area` |
| `unlikely_eligible` | `Unlikely Eligible` |

See `docs/ELIGIBILITY_LOGIC.md` for exactly which answers produce each
route.

## 5. Recommended Privyr Custom Client Fields

Set these up manually in the Privyr account (the webhook cannot create
Custom Client Fields itself — this must be done by hand in Privyr's
settings):

| Field name | Type | Notes |
|---|---|---|
| Funding Route | Dropdown | Options = the 7 exact values in section 4 |
| Property Postcode | Text | |
| Existing Heating | Dropdown | Mains gas / Oil / LPG / Coal / Direct electric / Storage heaters / Existing heat pump / Other |
| Ownership Status | Dropdown | Sole owner / Joint owner / Private landlord / Social landlord / Business owned / Tenant / Other |
| Occupancy Status | Dropdown | Main residence / Second home / Holiday home / Rental property / Commercial / Other |
| Gas Grid Status | Dropdown | Yes / No / Not sure |
| Enquiry Source | Dropdown | e.g. Facebook, Google, Direct |
| Submission Date | Text (or Date, if supported) | ISO-8601 |
| Consent Version | Text | Currently `ghw-v1` |

If the receiving webhook/Zapier-style integration on your Privyr account
maps unrecognised JSON keys into the **Notes** field rather than Custom
Client Fields, the fully-formatted, human-readable summary is already sent
as the `notes` property (see section 6) — no extra configuration needed for
the sales team to read it, but structured filtering/automation will need
the Custom Client Fields above set up and mapped in Privyr's own webhook
field-mapping UI.

## 6. Notes format

The `notes` field is pre-formatted for a mobile screen, e.g.:

```
GREEN HOMES WALES ELIGIBILITY ENQUIRY

Potential Route: Potential £9k BUS
Property Location: Wales
Ownership: Sole owner
Occupancy: Main residence
Property Type: Detached house
Listed Property: No
Recent New Build: No
Mains Gas Grid: No
Existing Heating: Oil
Postcode: CF10 1AA

Eligibility Summary:
Answers indicate a potential enhanced Boiler Upgrade Scheme route. Final eligibility and grant level require assessment by the relevant accredited installer and scheme administrator.

Attribution:
Source: Facebook
Campaign: GHW Wales August
Landing Page: https://firsttimecentralheatingwales.com/green-homes-wales

Consent:
Enquiry Contact Consent: Yes
Marketing Consent: No
Consent Version: ghw-v1
Submitted: 2026-07-20T12:34:56.000Z
Submission ID: 3e9f...
```

## 7. Sending a test lead

1. Set `PRIVYR_WEBHOOK_URL` to a real (ideally sandbox/test) Privyr webhook.
2. Go through the live form and submit with:
   - Name: `TEST Green Homes Wales`
   - A syntactically valid but clearly fake postcode
   - Answers chosen to land on `manual_review` (e.g. answer "Private
     landlord" to ownership) so `funding_route` = `Manual Review`
3. In the Notes field, this test lead is naturally distinguishable by the
   name — optionally also add `DEVELOPER TEST — DELETE AFTER
   VERIFICATION` manually in Privyr once it arrives, since the webhook
   payload's `notes` field is generated from the real eligibility summary
   and doesn't carry a "this is a test" flag itself.

## 8. Confirming the lead landed correctly

In Privyr, check:

- Name / phone / email populate the standard client fields (not Notes)
- `funding_route` matches one of the 7 exact values in section 4
- The Notes field renders legibly on a phone
- Attribution (source/campaign) is present if the test URL included UTM
  parameters
- Consent fields (`enquiry_consent`, `marketing_consent`,
  `consent_version`) are present

## 9. Distribution rules based on funding_route

Once the Custom Client Field "Funding Route" (section 5) is set up and
mapped to the incoming `funding_route` webhook property, Privyr's own
distribution-rule UI can route leads by that field's value — e.g. route
`Potential £9k BUS` and `Potential BUS + Green Homes Wales` leads to a
senior consultant, `Manual Review` to a specific reviewer queue, etc. This
routing is configured entirely inside Privyr; nothing further is required
in this codebase.

## 10. What requires manual configuration inside Privyr

- Creating the Custom Client Fields (section 5) and mapping them to the
  webhook's JSON keys
- Setting up the dropdown option lists to match section 4's values exactly
- Any distribution/automation rules
- Any tags/pipelines the sales team wants leads sorted into beyond what
  `funding_route` already conveys
