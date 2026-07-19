# Project Context for Claude Code

This file is auto-loaded by Claude Code when working in this repo. It contains
the full client brief for the project below. Treat this as the source of truth
for scope, copy, wording, compliance rules, and technical requirements.

---

## PROJECT: First Time Central Heating Wales — Green Homes Wales Landing Page

### PRIMARY OBJECTIVE

Build a premium, high-converting, mobile-first lead-generation landing page
(not a basic info page) that helps Welsh homeowners check their potential
eligibility for:

- The Boiler Upgrade Scheme
- Up to £9,000 towards an eligible heat pump
- Green Homes Wales interest-free funding from £1,000 to £25,000
- Fully funded retrofit assessment and coordination support
- Air-source and ground-source heat pumps
- Related energy-efficiency improvements where appropriate

All completed leads must enter Privyr CRM instantly with every qualification
answer, source, campaign, and consent record. A staging link must be provided
for review before going live.

### CRITICAL FUNDING WORDING RULES

The £9,000 Boiler Upgrade Scheme grant is **not** available to every homeowner.

Accurate wording to use:

> "Eligible homeowners may receive £7,500 towards an air-source or
> ground-source heat pump. From 21 July 2026, eligible off-gas-grid homes
> replacing oil or LPG heating may qualify for an increased grant of £9,000."

**Before 21 July 2026**, the page must say:
> "Up to £9,000 available from 21 July 2026 for eligible off-gas-grid homes."

**From 21 July 2026**, the page can say:
> "Check whether your home could qualify for up to £9,000 towards an eligible
> heat pump."

The enhanced £9,000 grant currently applies only to qualifying off-gas-grid
homes replacing oil or LPG. Other qualifying properties may receive £7,500.

**The £9,000 claim must be controlled through a central configuration setting**
(e.g. a single config flag/date check) so it can be updated or removed when
scheme rules or dates change without a full content rewrite.

### GREEN HOMES WALES WORDING

Use:
> "Interest-free Green Homes Wales funding from £1,000 to £25,000, subject to
> status, affordability, credit checks, scheme criteria and final approval."

Also use:
> "Fully funded expert retrofit assessment and coordination support may be
> available through Green Homes Wales."

Do NOT advertise a guaranteed £1,000 assessment grant unless written
confirmation is supplied. Do NOT describe the website form as a formal
finance application.

### BRAND POSITIONING

Brand name: **First Time Central Heating Wales**

Position as:
> "An independent Welsh homeowner enquiry and installer-matching service
> helping people understand the heating grants, funding routes and accredited
> installation options that may be available for their property."

Feel: Welsh, professional, established, trustworthy, easy to understand,
premium, consumer-friendly, mobile-first.

Avoid: cheap "free boiler grant" styling, fake urgency, fake government
branding, claims of guaranteed approval.

### RECOMMENDED PAGE URL

- Primary: `/green-homes-wales`
- Alternative SEO route: `/heat-pump-grants-wales`

### HEADER

Desktop: logo, How It Works, Funding Options, Eligibility, FAQs, telephone
CTA, primary button "Check My Eligibility".

Mobile: logo, telephone icon, menu, sticky "Check Eligibility" button.
Do not overload nav or distract from the enquiry journey.

### TOP INFORMATION BAR

- Main: "Welsh Homeowners: Check Your Potential Heat-Pump Grant and Green
  Homes Wales Funding Options"
- Sub: "Independent eligibility and installer-matching service."

### HERO SECTION

- Eyebrow: "Boiler Upgrade Scheme and Green Homes Wales Support"
- Headline: "Could Your Welsh Home Qualify for Up to £9,000 Towards a Heat Pump?"
- Support copy: "Check your potential eligibility for the Boiler Upgrade
  Scheme, Green Homes Wales interest-free funding and fully funded expert
  retrofit support."
- Benefit bullets:
  - Up to £9,000 towards an eligible heat pump
  - Interest-free Green Homes Wales funding up to £25,000
  - Connected with appropriately accredited Welsh installers
  - Initial eligibility check takes approximately 60 seconds
  - No obligation to proceed
- Primary CTA: "Check My Eligibility" (sub: "Takes approximately 60 seconds.
  No obligation.")
- A/B alt CTA: "See What Support I Could Get"

Hero image: realistic Welsh detached/semi-detached/rural property, correctly
positioned air-source heat pump, professional heating engineer, natural
daylight, Welsh architectural/landscape character. No American homes, no
unrealistic heat-pump placement, no fake government badges, no obviously
artificial images.

### ABOVE-FOLD DISCLAIMER

> "First Time Central Heating Wales is an independent marketing and
> installer-introduction service. Funding and grant eligibility are subject
> to scheme rules, property assessment and approval."

### MULTI-STEP ELIGIBILITY FORM

First question above the fold. Do NOT ask for contact details first.
One question per screen, large mobile-friendly buttons, visible progress
("Step 1 of 4").

**Step 1 — Location & Ownership**
- "Is the property located in Wales?" — Yes / No
- "Do you own the property?" — Yes / Joint owner / No / Landlord
- "Is this property your main residence?" — Yes / No
- If outside Wales → show out-of-area result, still allow separate recording.

**Step 2 — Current Heating**
- "How is your home currently heated?" — Heating oil / LPG / Mains gas /
  Electric storage heaters / Direct electric heating / Coal / Biomass /
  Existing heat pump / No central heating / Other / Not sure
- "Is your property connected to the mains gas network?" — Yes / No / Not sure
- "Are you considering replacing your current heating system?" — Yes ASAP /
  Within 3 months / Within 6 months / Researching my options / Not sure

**Step 3 — Property Information**
- "What type of property is it?" — Detached / Semi-detached / Terraced /
  Bungalow / Flat or apartment / Other
- "Approximately when was the property built?" — Before 1900 / 1900–1949 /
  1950–1979 / 1980–1999 / 2000–2020 / Within the last six months / Not sure
- "Is the property listed?" — Yes / No / Not sure
- "Which improvements are you interested in?" (multi-select) — Air-source
  heat pump / Ground-source heat pump / Solar panels / Battery storage /
  Insulation / Heating controls / Windows and glazing / Lowering energy
  bills / Not sure — I need advice

**Step 4 — Contact Details**
- Heading: "Your Initial Results Are Ready"
- Support: "Enter your details so a member of the team can review your
  answers and explain the most relevant funding and installation options."
- Fields: First name, Last name, Mobile number, Email address, Full
  postcode, First line of address, Preferred contact method
  (Telephone/WhatsApp/SMS/Email), Best time to contact
  (Morning/Afternoon/Evening/Anytime)
- Primary submit: "Show My Funding Options"
- A/B alt submit: "Request My Free Eligibility Review"
- **Never use**: "Claim My £9,000", "Get Approved", "Apply for Finance",
  "Secure My Grant"

### CONSENT

Required service-contact consent (not pre-ticked):
> "I agree that First Time Central Heating Wales may contact me about my
> enquiry and share my details with an appropriately accredited installer or
> retrofit professional operating in Wales. I understand that First Time
> Central Heating Wales is an independent marketing and introduction service
> and does not award grants, approve finance or carry out installations."

Optional marketing consent (not pre-ticked):
> "I would also like to receive occasional information about relevant
> home-energy grants, funding and services. I can opt out at any time."

Store: exact consent wording, consent version, timestamp, page URL, referrer,
marketing consent status, service-contact consent status, IP (where
appropriate), user agent.

### LEAD SCORING LOGIC

- **High-priority Enhanced BUS**: Wales + owner/joint owner + main residence
  + not on mains gas + current heating oil/LPG + replacing system + interested
  in heat pump.
- **Standard BUS**: Wales + homeowner + existing property + replacing
  gas/electric/other + interested in eligible heat pump.
- **Green Homes Wales Funding Lead**: Wales + owner-occupier + main residence
  + interested in eligible improvements + selected interest-free funding or
  several retrofit improvements.
- **Manual Review**: listed property, new build, landlord, existing heat
  pump, uncertain ownership, flat/mixed-use, unsure about heating, possible
  prior public funding use.

### DYNAMIC RESULT PAGES

- **Result A** (Potential £9,000): "You May Meet the Initial Criteria for the
  Enhanced £9,000 Heat-Pump Grant" + eligibility caveat copy + CTA "Book My
  Eligibility Call"
- **Result B** (Potential £7,500): "You May Qualify for £7,500 Towards an
  Eligible Heat Pump" + CTA "Arrange My Initial Assessment"
- **Result C** (Green Homes Wales Funding): "Green Homes Wales Funding May Be
  Available" + CTA "Discuss My Funding Options"
- **Result D** (Manual Review): "Your Property Needs a Quick Manual Review"
- **Result E** (Not Currently Eligible): "This Particular Scheme May Not Be
  the Best Match"

Never state definite qualification/acceptance/approval from the form alone.

### TRUST SECTION

Heading: "Connected With Appropriately Accredited Welsh Installation
Professionals". Reference MCS, NICEIC, RECC, TrustMark, PAS 2035 where
accurate. Do not claim FTCHW itself holds these accreditations. Do not use
accreditation logos without permission.

### FUNDING OFFER CARDS

1. "Up to £9,000 Boiler Upgrade Scheme Grant" — badge: "Grant — subject to
   scheme eligibility"
2. "Interest-Free Funding Up to £25,000" — badge: "Subject to status and
   approval"
3. "Fully Funded Retrofit Support" — badge: "Whole-home expert guidance"

Footer note: "Available support depends on the applicant, property, proposed
measures, existing heating system, scheme criteria, affordability checks,
credit checks and funding availability."

### WHY CONSIDER A HEAT PUMP (4 cards)

Efficient Home Heating / Consistent Comfort / Move Away From Oil or LPG /
Works With Wider Improvements. Do not promise universal savings or show
unsupported annual figures.

### HOW IT WORKS (5 steps)

1. Complete the 60-second check
2. Initial telephone review
3. Professional introduction
4. Property assessment and quotation
5. Funding and installation

Add: "Completing the enquiry does not commit the homeowner to a loan,
installer or installation contract."

### ELIGIBILITY SECTIONS

Green Homes Wales and Boiler Upgrade Scheme eligibility criteria lists —
see full brief in `docs/original-brief.md` for exact bullet copy. Include the
notice: "The £9,000 grant is not available to every applicant. From 21 July
2026, it applies to specific eligible off-gas-grid properties replacing oil
or LPG with an eligible heat pump. Other qualifying installations may
receive £7,500."

### TESTIMONIALS

Do not invent reviews, installation numbers, approval rates, or savings.
Use placeholders until genuine info is supplied. Verified case studies need:
first name, Welsh county, previous/new heating, funding route, genuine
review, publish permission.

### FAQ SECTION

11 FAQs required — full Q&A copy is in `docs/original-brief.md`. Add FAQ
schema matching visible content. No review schema without genuine reviews.

### FINAL CTA / DISCLAIMERS

Main disclaimer (above footer) and full footer legal disclaimer — exact
wording in `docs/original-brief.md`. Placeholder needed: legal entity name,
company number, registered address.

### PRIVYR CRM INTEGRATION

- Secure server-side endpoint, e.g. `POST /api/leads/green-homes-wales`
- Never expose Privyr licence code in front-end JS — use env vars
- Source name: "FTCHW – Green Homes Wales / BUS"
- Full lead payload fields, tag/group mapping, and mobile-readable notes
  template — see `docs/original-brief.md` for exact structure.

### LEAD DELIVERY RELIABILITY

Server-side validation, UK phone normalisation, postcode validation,
honeypot, rate limiting, Cloudflare Turnstile (or equivalent), duplicate-lead
detection, 3x webhook retries, error logging, backup email notification,
durable queue/DB backup, idempotency key. Do not show success page until the
lead is saved or safely queued.

### TRACKING

GTM, GA4, Meta Pixel, Meta Conversions API, Google Ads tracking (if needed),
Microsoft Clarity, cookie consent, Google Consent Mode. Full event list in
`docs/original-brief.md` (page_view, eligibility_form_start, step
completions, result events, click_call/whatsapp/email, faq_open,
scroll_50/90, etc). Preserve attribution across the multi-step form.

### MOBILE CONVERSION REQUIREMENTS

First question above fold, sticky bottom CTA, optional sticky phone button,
one question per screen, large buttons, back/continue controls, inline
validation, postcode autocomplete, auto phone formatting, form state
persistence on refresh, no unnecessary dropdowns, no autoplay hero video, no
disruptive pop-ups.

### DESIGN DIRECTION

Palette: deep Welsh green, warm off-white, white cards, slate/charcoal text,
muted gold accent. Clean spacing, premium buttons, light shadows, subtle
Welsh identity. Avoid bright lime "grant-advert" styling, fake government
look, excessive animation, template feel, clutter, too many colours.
Fonts: Inter / Manrope / DM Sans / Source Sans 3.

### ACCESSIBILITY

WCAG 2.2 AA target: keyboard access, visible focus states, correct labels,
accessible errors, screen-reader progress updates, proper heading structure,
colour contrast, reduced-motion support, descriptive alt text.

### PERFORMANCE TARGETS

Mobile Lighthouse performance > 90, LCP < 2.5s, CLS < 0.1, WebP/AVIF images,
lazy-loaded below-fold images, minimal third-party scripts, fast on mobile
data.

### SEO

- Title: "Heat Pump Grants and Green Homes Wales Funding | First Time
  Central Heating Wales"
- Meta description: "Check whether your Welsh home may qualify for up to
  £9,000 towards an eligible heat pump, interest-free Green Homes Wales
  funding and expert retrofit support."
- H1: "Could Your Welsh Home Qualify for Up to £9,000 Towards a Heat Pump?"
- Target phrases: Boiler Upgrade Scheme Wales, Heat pump grant Wales, £9,000
  heat pump grant, Green Homes Wales funding, Interest-free home improvement
  loan Wales, Air-source heat pump grant Wales, Oil heating replacement
  grant, LPG heating replacement grant, MCS heat pump installer Wales,
  Energy-efficiency funding Wales.
- Add FAQ schema matching visible FAQ content.

### LEGAL PAGES REQUIRED

Privacy Policy, Cookie Policy, Terms of Use, Complaints Procedure, Funding
and Grant Disclaimer, How We Select Installers, Contact page.

### CLAIMS THAT MUST NEVER BE PUBLISHED

Everyone qualifies / Guaranteed £9,000 / Guaranteed funding / Free heat pump
/ No credit checks / Government-approved website / Official Green Homes
Wales partner / Guaranteed lower energy bills / Guaranteed annual savings /
Instant approval / "Apply for the loan through us" / "We secure your
funding" / Approved by Welsh Government / "MCS accredited" (unless referring
to a verified installer) / any fake reviews, approval rates, or installation
figures.

### DELIVERABLES CHECKLIST

- [ ] Full responsive landing page
- [ ] Multi-step eligibility form
- [ ] Dynamic results based on answers
- [ ] Privyr CRM integration
- [ ] Privyr lead tagging and readable notes
- [ ] Mobile sticky CTA
- [ ] Telephone and WhatsApp buttons
- [ ] Tracking setup
- [ ] Legal disclaimer placement
- [ ] Funding date configuration (central £9,000 toggle/date switch)
- [ ] Lead-delivery backup and error handling
- [ ] SEO metadata and schema
- [ ] Mobile and desktop testing
- [ ] Staging URL for review
- [ ] Test lead submitted into Privyr

**Do not publish live** until client has reviewed staging, and confirmed:
legal company details, contact information, Privyr connection, installer
accreditation wording.

---

## Notes for Claude Code

- The full, unedited client brief is preserved verbatim in
  `docs/original-brief.md` — refer to it for exact copy/wording when this
  summary isn't detailed enough (e.g. exact FAQ answers, full footer legal
  text, Privyr field list, tracking event list).
- Treat the £9,000 vs £7,500 wording rules as a compliance-critical feature,
  not just copy — implement as a config-driven date/eligibility switch
  (e.g. `config/funding.ts` with a scheme date and off-gas-grid/oil-LPG flag).
- Never fabricate testimonials, reviews, accreditation claims, or savings
  figures — use clearly marked placeholders.
- All Privyr credentials, GTM IDs, Meta Pixel IDs, and Turnstile keys go in
  environment variables — see `.env.example`.
