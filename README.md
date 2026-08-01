# First Time Central Heating Wales — Green Homes Wales Landing Page

Mobile-first lead-generation landing page for Welsh homeowners to check
their potential eligibility for the Boiler Upgrade Scheme and Green Homes
Wales funding, with leads flowing into Privyr CRM.

Live route: `/green-homes-wales` (SEO alias: `/heat-pump-grants-wales`,
canonical to the primary route).

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- Zod for request validation
- Vitest for unit tests, Playwright for end-to-end tests

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values -- see docs below
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (runs `prebuild` production-readiness check first) |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests (eligibility engine) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests (run `npm run build` first, see `playwright.config.ts`) |

## Key documentation

- [`CLAUDE.md`](CLAUDE.md) — condensed project spec (scope, copy,
  compliance rules)
- [`docs/original-brief.md`](docs/original-brief.md) — full verbatim
  client brief
- [`docs/ELIGIBILITY_LOGIC.md`](docs/ELIGIBILITY_LOGIC.md) — the funding
  route decision logic, with worked examples
- [`docs/PRIVYR_SETUP.md`](docs/PRIVYR_SETUP.md) — CRM field mapping,
  funding-route label values, how to send/verify a test lead
- [`docs/ANALYTICS_SETUP.md`](docs/ANALYTICS_SETUP.md) — GA4/Meta/Clarity
  env vars, event list, consent gating
- [`docs/DEPLOYMENT_CHECKLIST.md`](docs/DEPLOYMENT_CHECKLIST.md) —
  everything that must be resolved before a real production launch

## Architecture notes

- `lib/eligibility.ts` — pure function mapping form answers to one of 7
  `FundingRoute` values; covered by `lib/eligibility.test.ts`
- `lib/leadSchema.ts` — Zod schema validating every lead submission
  server-side in `app/api/leads/green-homes-wales/route.ts`
- `config/funding.ts` — the £9,000-vs-£7,500 wording is a single
  date-driven config, not hardcoded copy (see CLAUDE.md → "CRITICAL
  FUNDING WORDING RULES")
- `config/company.ts` — legal entity details; a real `VERCEL_ENV=production`
  deploy is blocked (`scripts/check-production-readiness.mjs`) until these
  are set for real, never invented placeholders
- `components/eligibility-form/` — the 11-screen multi-step form (resumable
  via localStorage key `ftchw_green_homes_wales_form_v1`)

## Still needed before a real production launch

See [`docs/DEPLOYMENT_CHECKLIST.md`](docs/DEPLOYMENT_CHECKLIST.md) for the
full list — in short: legal entity details, a Privyr webhook URL, the
production domain, analytics IDs, Turnstile keys, and a durable
lead-storage backend to replace the local-file fallback.

## Compliance reminders (do not skip)

- £9,000 grant wording is config-driven by date (21 July 2026 switch) — see
  `config/funding.ts` and CLAUDE.md → "CRITICAL FUNDING WORDING RULES"
- Never state guaranteed approval/qualification anywhere on the site — see
  `components/eligibility-form/routeMessages.ts` for the approved wording
- No fabricated reviews, savings figures, or accreditation claims
- Full list of banned claims is in `CLAUDE.md` → "CLAIMS THAT MUST NEVER BE
  PUBLISHED"
