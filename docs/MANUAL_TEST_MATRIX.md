# Manual Test Matrix

Automated coverage (Vitest + Playwright) is documented in the final
delivery report / `docs/DEPLOYMENT_CHECKLIST.md`. The items below need a
human, either because they require real devices/assistive tech, or because
they depend on credentials this pass didn't have access to.

| # | Check | Status |
|---|---|---|
| 1 | Android Chrome — full journey | Not run (no device/emulator in this environment) — Playwright's `mobile-chrome` project (Pixel 7 viewport/UA emulation) passed as a proxy, but real-device testing (touch precision, keyboard behaviour, autofill) is still recommended |
| 2 | iPhone Safari — full journey | Not run on a real device — Playwright's `mobile-safari` project (iPhone 14 viewport/UA, WebKit engine) is the closest automated proxy available here |
| 3 | Desktop Chrome | ✅ Automated (Playwright `desktop-chrome`) |
| 4 | Desktop Safari | Automated via Playwright's WebKit engine (`desktop-safari` project) — not the same as real macOS Safari, treat as indicative only |
| 5 | Desktop Edge | Not run — Chromium-based, low risk given desktop-chrome passes, but not verified |
| 6 | Slow mobile connection | Not run — recommend Chrome DevTools network throttling ("Slow 4G") manual pass before launch |
| 7 | JavaScript animation failure | Partially covered: `AnimatedCounter` renders the correct final value in its initial server-rendered markup regardless of JS (see `components/animation/AnimatedCounter.tsx`) -- verify by disabling JS in devtools and confirming stats still read correctly and the form still submits (progressive enhancement, not required for JS-disabled visitors to complete the form, since the form itself needs JS to function as a SPA -- this is a known limitation, not a regression) |
| 8 | Reduced-motion mode | Partially covered: `MotionConfig reducedMotion="user"` (global) + `AnimatedCounter`'s explicit `useReducedMotion()` check. Manually verify via OS-level "reduce motion" setting that the hero counters don't animate and page transitions are instant |
| 9 | Keyboard-only journey | Not formally tested with a screen reader, but the form supports Tab/Enter navigation, visible focus rings (`:focus-visible` in `app/globals.css`), and focus moves to each new question heading (see `EligibilityForm.tsx`) |
| 10 | Invalid CRM credentials | Not tested against a real Privyr account — no credentials were available. `lib/privyr.ts` retries 3x and falls back to local backup + still returns success to the visitor if the backup write succeeds |
| 11 | Privyr timeout | Not tested against a real Privyr account for the same reason. Retry/backoff logic exists but hasn't been exercised against a real slow/timing-out endpoint |
| 12 | Duplicate form submission | ✅ Automated (Playwright "double-clicking submit" test) + server-side `submissionId` idempotency check in the API route |
| 13 | Analytics consent accepted | Not manually verified against real GA4/Meta accounts (no IDs configured). Code path verified by reading `components/analytics/Analytics.tsx` -- scripts only render once `getStoredConsent() === "granted"` |
| 14 | Analytics consent declined | Same as above — form functionality confirmed independent of analytics consent state (Playwright tests all run with consent undecided/declined and the form works throughout) |
| 15 | Preview-domain indexing controls | Verify manually on the actual Vercel preview URL once deployed: `/robots.txt` should show `Disallow: /` (see `app/robots.ts`, gated on `VERCEL_ENV === "production"`) |
| 16 | Production-domain indexing controls | Verify manually once `NEXT_PUBLIC_SITE_URL` and the real domain are live: `/robots.txt` should show `Allow: /` and canonical tags should point at the real domain, not `*.vercel.app` |

## Sending a real test lead (section 20 of the brief)

Not performed in this pass — no live `PRIVYR_WEBHOOK_URL` was available.
Once a real (ideally sandbox) webhook is configured, follow
`docs/PRIVYR_SETUP.md` section 7 and confirm against section 8's checklist.
