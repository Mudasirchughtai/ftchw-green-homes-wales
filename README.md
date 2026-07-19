# First Time Central Heating Wales — Green Homes Wales Landing Page

Mobile-first lead-generation landing page for Welsh homeowners to check
eligibility for the Boiler Upgrade Scheme and Green Homes Wales funding,
with leads flowing straight into Privyr CRM.

## How this repo is set up

- `CLAUDE.md` — condensed, structured project spec. **Claude Code reads this
  automatically** the moment you open this folder, so it always has full
  context on scope, copy, compliance rules, lead scoring, tracking, etc.
- `docs/original-brief.md` — the full, verbatim client brief, kept as the
  canonical reference for exact wording (FAQs, footer legal text, Privyr
  field lists, tracking event names).
- `.env.example` — placeholders for every credential mentioned in the brief
  (Privyr, GTM, Meta, Turnstile). Copy to `.env.local` and fill in real
  values — never commit the real `.env.local`.

## Using this with Claude Code

1. Push this repo to GitHub (steps below).
2. Clone it wherever you'll run Claude Code (desktop app, terminal, or IDE
   extension).
3. Open the folder in Claude Code — it auto-loads `CLAUDE.md` as project
   context.
4. Just say what you want built next, e.g.:
   - "Scaffold the Next.js project structure for this brief"
   - "Build the Step 1 & 2 eligibility form screens"
   - "Wire up the /api/leads/green-homes-wales endpoint with Privyr"
   - "Set up the £9,000 vs £7,500 config-driven date switch"
5. For exact copy/wording (FAQs, legal footer, Privyr notes template),
   point Claude Code at `docs/original-brief.md`.

## Pushing this repo to GitHub

From this folder:

```bash
git init
git add .
git commit -m "Initial project brief and structure — FTCHW Green Homes Wales"
git branch -M main
git remote add origin https://github.com/<your-username>/ftchw-green-homes-wales.git
git push -u origin main
```

Replace `<your-username>` with your GitHub username, and create the empty
repo on GitHub first (no README/gitignore needed there — this repo already
has them).

## Still needed from client before build/launch

- Legal entity name, company number, registered address (for footer)
- Privyr licence code / API credentials
- GTM container ID, GA4 measurement ID, Meta Pixel ID, Meta Conversions API
  token, Microsoft Clarity ID
- Cloudflare Turnstile site/secret keys (or chosen equivalent)
- Real testimonials/case studies with publish permission (placeholders only
  until then)
- Confirmation on installer accreditation wording before publishing
- Staging domain/hosting details

## Compliance reminders (do not skip)

- £9,000 grant wording must be config-driven by date (21 July 2026 switch),
  not hardcoded — see `CLAUDE.md` → "CRITICAL FUNDING WORDING RULES"
- Never state guaranteed approval/qualification anywhere on the site
- No fabricated reviews, savings figures, or accreditation claims
- Full list of banned claims is in `CLAUDE.md` → "CLAIMS THAT MUST NEVER BE
  PUBLISHED"
