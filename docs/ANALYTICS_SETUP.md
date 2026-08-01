# Analytics Setup

## Environment variables

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Each script only loads when its own env var is set — see
`components/analytics/Analytics.tsx`. Unconfigured providers simply don't
load; the eligibility form works identically either way.

## Cookie consent gate

Analytics scripts additionally only load once the visitor has accepted the
cookie banner (`components/analytics/CookieConsentBanner.tsx`, state in
`lib/cookieConsent.ts`, localStorage key `ftchw_cookie_consent`). The
banner is deferred until the hero's eligibility form has scrolled out of
view, so it never covers the form's Continue button (this was confirmed as
a real bug via Playwright and fixed — see git history / PR notes).

Google Consent Mode: `gtag('consent', 'default', ...)` is only called after
consent is already granted (since the whole script block is gated behind
consent), which is a simplification — if you need pre-consent default-denied
signals to fire (e.g. for Google Ads modelling before the visitor decides),
move the `gtag('consent', 'default', {..denied..})` call to fire
unconditionally in `<head>` before the consent banner resolves, and only
call `gtag('consent', 'update', {..granted..})` on Accept. The current
implementation is simpler but doesn't send pre-consent denied pings.

## Events

Fired via `lib/analytics.ts` → `trackEvent()`:

- `eligibility_form_view` — form mounted
- `eligibility_form_start` — visitor clicks Continue for the first time
- `eligibility_step_complete` — fired per qualification question answered
- `eligibility_validation_error` — inline validation failed, with the field name
- `eligibility_result_view` — thank-you screen shown, with `funding_route`
- `lead_submit_attempt` — submit clicked
- `lead_submit_success` — **only** after the backend confirms the lead was
  delivered/saved — this is the only event that also fires Meta's `Lead`
  standard event
- `lead_submit_failure` — backend rejected or the request failed
- `phone_cta_click` — any tel: link clicked (header, footer, final CTA)

**No PII is ever passed as an event parameter** — no name, email, phone, or
full postcode. `funding_route` is the only qualification-shaped data sent.

## Meta Conversions API (server-side)

`META_CAPI_ACCESS_TOKEN` is provisioned as an env var but **not yet wired
up** — there is no server-side CAPI call implemented in this pass. To add
it:

1. In `app/api/leads/green-homes-wales/route.ts`, after a successful Privyr
   delivery, POST to `https://graph.facebook.com/v19.0/{pixel-id}/events`
   with the `META_CAPI_ACCESS_TOKEN` (server-side only, never exposed to
   the client).
2. Generate a shared `event_id` on the client (e.g. reuse `submissionId`)
   and pass the same value to both the browser Pixel `fbq('track', 'Lead',
   {}, {eventID: submissionId})` call in `lib/analytics.ts` and the
   server-side CAPI call, so Meta deduplicates the browser and server
   events instead of double-counting.

This is called out as a deployment blocker in
`docs/DEPLOYMENT_CHECKLIST.md` since it's not implemented yet.

## Turnstile (anti-bot)

See `lib/turnstile.ts` (server) and
`components/eligibility-form/TurnstileWidget.tsx` (client). Without
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` set, the widget
doesn't render and server-side verification is skipped — the form still
works, but this is a real anti-bot gap until both keys are configured.
