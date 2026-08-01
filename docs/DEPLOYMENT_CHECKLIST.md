# Deployment Checklist

## Hard blockers (a real `VERCEL_ENV=production` deploy is coded to refuse
these — see `scripts/check-production-readiness.mjs`, run as `prebuild`)

- [ ] `LEGAL_ENTITY_NAME`, `COMPANY_NUMBER`, `REGISTERED_ADDRESS` — footer
      currently shows a loud dev-only warning banner instead of these
      (see `components/layout/Footer.tsx`). **Do not invent these values.**
- [ ] `PRIVYR_WEBHOOK_URL` — without it, leads never reach the CRM (see
      `docs/PRIVYR_SETUP.md`)
- [ ] `NEXT_PUBLIC_SITE_URL` — canonical URLs and indexing controls depend
      on this (e.g. `https://firsttimecentralheatingwales.com`)

## Other blockers (not enforced by the build, but must be resolved before
launch)

- [ ] **Durable lead storage.** `lib/leadStore.ts` currently writes to a
      local JSON-lines file. This works in dev but is **not durable** on
      Vercel (serverless filesystem is ephemeral, doesn't survive
      redeploys, and isn't shared across instances). Replace with a real
      database or queue before launch, or leads delivered-but-not-yet-sent
      to Privyr can be silently lost.
- [ ] **In-memory rate limiting / idempotency.** `app/api/leads/green-homes-wales/route.ts`
      uses in-process `Map`/`Set` state for rate limiting and duplicate
      detection. This resets on every redeploy and isn't shared across
      concurrent serverless instances — it's a soft speed bump, not real
      protection. Replace with a shared store (e.g. Upstash Redis) if this
      matters at your expected traffic/abuse level.
- [ ] **Cloudflare Turnstile.** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` /
      `TURNSTILE_SECRET_KEY` are unset — the widget doesn't render and
      server-side verification is skipped. Real anti-bot gap until both are
      configured (see `lib/turnstile.ts`).
- [ ] **Meta Conversions API** is provisioned via `META_CAPI_ACCESS_TOKEN`
      but not implemented — see `docs/ANALYTICS_SETUP.md`.
- [ ] **A verified test lead has not been sent to a real Privyr account**
      as part of this work (no live webhook credential was available). Do
      this manually once `PRIVYR_WEBHOOK_URL` is set — see
      `docs/PRIVYR_SETUP.md` section 7.
- [ ] Confirm Next.js 14.2.15 → the `npm audit` run during this work flagged
      several high/critical CVEs in Next.js that are only fixed in a major
      version bump (to Next 16). That's a breaking change affecting the
      whole app and wasn't performed as part of this pass — schedule it
      separately with its own regression pass.

## Config to set (non-blocking, but recommended before launch)

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`,
      `NEXT_PUBLIC_CLARITY_PROJECT_ID` — analytics won't load without these
      (see `docs/ANALYTICS_SETUP.md`)
- [ ] `ICO_REGISTRATION_NUMBER` if applicable

## Verify before flipping `VERCEL_ENV=production` / assigning the custom domain

- [ ] `npm run build` passes
- [ ] `npm run test` (Vitest, eligibility engine) passes
- [ ] `npm run test:e2e` (Playwright) passes on at least Desktop Chrome and
      Mobile Chrome
- [ ] Hero stat fallback values render correctly with JavaScript disabled
      (view source / disable JS in devtools and reload)
- [ ] `/robots.txt` shows `Disallow: /` on the Vercel preview URL and
      `Allow: /` only once `VERCEL_ENV=production` **and**
      `NEXT_PUBLIC_SITE_URL` are both set
- [ ] Canonical tags on `/green-homes-wales` and `/heat-pump-grants-wales`
      point at the real production domain, not the `*.vercel.app` preview
- [ ] Send one real test lead through the live form (see
      `docs/PRIVYR_SETUP.md` section 7) and confirm it lands correctly in
      Privyr
- [ ] Manual test matrix in `docs/MANUAL_TEST_MATRIX.md` (or the "Manual
      Checks Required" section of the final delivery report) has been run
