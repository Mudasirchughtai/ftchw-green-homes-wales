import { NextRequest, NextResponse } from "next/server";
import { determineFundingRoute } from "@/lib/eligibility";
import { sendLeadToPrivyr } from "@/lib/privyr";
import { backupLead } from "@/lib/leadStore";
import { leadSubmissionSchema } from "@/lib/leadSchema";
import { normalizeEmail, normalizeUkPhone, normalizeUkPostcode } from "@/lib/validation";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { logLeadError } from "@/lib/logger";
import type { LeadSubmission } from "@/lib/types";

// No CORS headers are set, so this route only accepts same-origin requests
// (the default browser behaviour) -- restricted CORS by omission.

// In-memory rate limit / idempotency / dedup. NOT durable: resets on
// redeploy and isn't shared across multiple server instances. This is a
// documented deployment blocker -- see docs/DEPLOYMENT_CHECKLIST.md.
const submissionsByIp = new Map<string, number[]>();
const seenSubmissionIds = new Set<string>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const MIN_COMPLETION_TIME_MS = 3_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: ["Too many requests"] }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, errors: ["Request too large"] }, { status: 413 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Invalid request body"] }, { status: 400 });
  }

  const parsed = leadSubmissionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const body = parsed.data as LeadSubmission;

  // Honeypot: real visitors never fill this hidden field.
  if (body.honeypot) {
    return NextResponse.json({ ok: true }); // silently accept, don't tip off bots
  }

  // Minimum completion time: bots typically submit near-instantly.
  if (body.formLoadedAt && Date.now() - body.formLoadedAt < MIN_COMPLETION_TIME_MS) {
    return NextResponse.json({ ok: false, errors: ["Submission too fast"] }, { status: 400 });
  }

  const turnstile = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ ok: false, errors: ["Anti-spam verification failed"] }, { status: 400 });
  }

  if (seenSubmissionIds.has(body.submissionId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  seenSubmissionIds.add(body.submissionId);

  const originalPhone = body.contact.phone;
  const normalizedPhone = normalizeUkPhone(originalPhone);
  const normalizedLead: LeadSubmission = {
    ...body,
    contact: {
      ...body.contact,
      phone: normalizedPhone,
      email: normalizeEmail(body.contact.email),
    },
    qualification: {
      ...body.qualification,
      postcode: normalizeUkPostcode(body.qualification.postcode),
    },
  };

  const { fundingRoute } = determineFundingRoute(normalizedLead.qualification);

  const privyrResult = await sendLeadToPrivyr(normalizedLead, fundingRoute, normalizedPhone, originalPhone);

  let backedUp = true;
  try {
    await backupLead(normalizedLead, fundingRoute, { privyrDelivered: privyrResult.delivered });
  } catch (err) {
    backedUp = false;
    logLeadError("Failed to write lead backup", {
      submissionId: normalizedLead.submissionId,
      email: normalizedLead.contact.email,
      phone: normalizedPhone,
      error: err,
    });
  }

  if (!privyrResult.delivered) {
    logLeadError("Privyr delivery failed", {
      submissionId: normalizedLead.submissionId,
      email: normalizedLead.contact.email,
      phone: normalizedPhone,
      webhookUrl: process.env.PRIVYR_WEBHOOK_URL,
      error: privyrResult.error,
    });
  }

  // Only confirm success once the lead has actually been delivered or is
  // safely persisted in the (documented-as-non-durable) local backup.
  if (!privyrResult.delivered && !backedUp) {
    return NextResponse.json(
      { ok: false, errors: ["We couldn't save your enquiry. Please try again or call us directly."] },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    fundingRoute,
    submissionId: normalizedLead.submissionId,
  });
}
