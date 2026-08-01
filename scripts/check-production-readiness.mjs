// Runs as `prebuild`. Deliberately does NOT key off VERCEL_ENV=production --
// Vercel sets that automatically on every deploy from the Production
// branch (i.e. every push to main), which is "routine staging deploy",
// not "we've decided to go live to real customers". Gating on that would
// have broken the very first Vercel deploy of this repo (nothing missing
// yet gets configured until launch is imminent).
//
// Instead this only hard-fails when someone explicitly sets
// CONFIRM_PRODUCTION_LAUNCH=true in Vercel's env vars -- a deliberate,
// one-time flip when the client has actually confirmed the missing
// details, not an automatic side effect of pushing code. Until then,
// every deploy (including the production domain) succeeds and simply
// shows the loud dev-warning banner in the footer -- exactly what you want
// for a staging/review link. See docs/DEPLOYMENT_CHECKLIST.md.
if (process.env.CONFIRM_PRODUCTION_LAUNCH !== "true") {
  process.exit(0);
}

const missing = [];

if (!process.env.LEGAL_ENTITY_NAME || !process.env.COMPANY_NUMBER || !process.env.REGISTERED_ADDRESS) {
  missing.push("LEGAL_ENTITY_NAME / COMPANY_NUMBER / REGISTERED_ADDRESS (footer legal disclaimer)");
}
if (!process.env.PRIVYR_WEBHOOK_URL) {
  missing.push("PRIVYR_WEBHOOK_URL (leads cannot reach the CRM without it)");
}
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  missing.push("NEXT_PUBLIC_SITE_URL (canonical URL / indexing controls)");
}

if (missing.length > 0) {
  console.error("\n✖ Production launch blocked -- missing required configuration:\n");
  for (const item of missing) console.error(`  - ${item}`);
  console.error("\nSet these environment variables in Vercel, then redeploy.\n");
  process.exit(1);
}

process.exit(0);
