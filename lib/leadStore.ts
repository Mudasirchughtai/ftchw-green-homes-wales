import { mkdir, appendFile } from "fs/promises";
import path from "path";
import type { LeadResult, LeadSubmission } from "@/lib/types";

/**
 * Local append-only backup so a lead is never silently lost if the Privyr
 * webhook is unreachable or unconfigured. This is a placeholder for the
 * durable queue/DB called for in CLAUDE.md -- fine for local dev, but a
 * serverless host's filesystem is ephemeral, so swap this for a real
 * datastore before going live.
 */
const LEADS_FILE = path.join(process.cwd(), "data", "leads.jsonl");

export async function backupLead(
  lead: LeadSubmission,
  scored: LeadResult,
  meta: { idempotencyKey: string; privyrDelivered: boolean },
): Promise<void> {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  const record = {
    receivedAt: new Date().toISOString(),
    ...meta,
    result: scored.result,
    priority: scored.priority,
    tags: scored.tags,
    lead,
  };
  await appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`, "utf8");
}
