// Runs as `prebuild`. Only enforces hard-fail checks for a real Vercel
// production deployment (VERCEL_ENV=production) so local/staging/preview
// builds keep working without every credential in place -- see
// docs/DEPLOYMENT_CHECKLIST.md for the full list of what's still required.
const isProductionDeploy = process.env.VERCEL_ENV === "production";

if (!isProductionDeploy) {
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
  console.error("\n✖ Production deployment blocked -- missing required configuration:\n");
  for (const item of missing) console.error(`  - ${item}`);
  console.error("\nSet these environment variables in Vercel before deploying to production.\n");
  process.exit(1);
}

process.exit(0);
