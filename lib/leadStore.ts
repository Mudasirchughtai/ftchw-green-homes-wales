import { mkdir, appendFile } from "fs/promises";
import path from "path";
import type { FundingRoute, LeadSubmission } from "@/lib/types";

/**
 * Local append-only backup so a lead is never silently lost if the Privyr
 * webhook is unreachable or unconfigured. THIS IS NOT A DURABLE STORE for
 * production: a serverless host's filesystem is ephemeral and this file
 * will not survive a redeploy or scale-out. See docs/DEPLOYMENT_CHECKLIST.md
 * -- replacing this with a real queue/database is a deployment blocker.
 */
const LEADS_FILE = path.join(process.cwd(), "data", "leads.jsonl");

export async function backupLead(
  lead: LeadSubmission,
  fundingRoute: FundingRoute,
  meta: { privyrDelivered: boolean },
): Promise<void> {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  const record = {
    receivedAt: new Date().toISOString(),
    submissionId: lead.submissionId,
    fundingRoute,
    privyrDelivered: meta.privyrDelivered,
    lead,
  };
  await appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`, "utf8");
}
