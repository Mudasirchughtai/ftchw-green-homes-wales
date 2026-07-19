import { NextRequest, NextResponse } from "next/server";
import { determineResult } from "@/lib/scoring";
import { sendLeadToPrivyr } from "@/lib/privyr";
import { backupLead } from "@/lib/leadStore";
import { isValidEmail, isValidUkMobile, isValidUkPostcode, normalizeUkPhone } from "@/lib/validation";
import type { LeadSubmission } from "@/lib/types";

// Simple in-memory rate limit + duplicate guard. Resets on server restart --
// swap for a shared store (Redis/DB) before going live behind multiple
// instances.
const submissionsByIp = new Map<string, number[]>();
const recentIdempotencyKeys = new Set<string>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

function validate(body: LeadSubmission): string[] {
  const errors: string[] = [];

  if (body.honeypot) errors.push("Spam detected");
  if (body.step1.inWales === null) errors.push("Missing: is the property in Wales");
  if (body.step1.ownership === null) errors.push("Missing: ownership status");
  if (body.step1.mainResidence === null) errors.push("Missing: main residence status");
  if (body.step2.currentHeating === null) errors.push("Missing: current heating");
  if (body.step3.propertyType === null) errors.push("Missing: property type");

  if (!body.step4.firstName?.trim()) errors.push("First name is required");
  if (!body.step4.lastName?.trim()) errors.push("Last name is required");
  if (!body.step4.email?.trim() || !isValidEmail(body.step4.email)) {
    errors.push("A valid email address is required");
  }
  if (!body.step4.mobile?.trim() || !isValidUkMobile(body.step4.mobile)) {
    errors.push("A valid UK mobile number is required");
  }
  if (!body.step4.postcode?.trim() || !isValidUkPostcode(body.step4.postcode)) {
    errors.push("A valid UK postcode is required");
  }
  if (!body.consent.serviceContactConsent) {
    errors.push("Service-contact consent is required");
  }

  return errors;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: ["Too many requests"] }, { status: 429 });
  }

  let body: LeadSubmission;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Invalid request body"] }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const idempotencyKey =
    request.headers.get("x-idempotency-key") ??
    `${body.step4.email.toLowerCase()}:${body.step4.mobile}`;
  if (recentIdempotencyKeys.has(idempotencyKey)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  recentIdempotencyKeys.add(idempotencyKey);

  body.step4.mobile = normalizeUkPhone(body.step4.mobile);

  const scored = determineResult(body);

  const privyrResult = await sendLeadToPrivyr(body, scored);

  try {
    await backupLead(body, scored, {
      idempotencyKey,
      privyrDelivered: privyrResult.delivered,
    });
  } catch (err) {
    // Backup write failed but we still have the lead in memory / Privyr may
    // have accepted it -- log loudly rather than losing it silently.
    console.error("Failed to write lead backup", err);
  }

  if (!privyrResult.delivered) {
    console.error("Privyr delivery failed, lead saved to local backup only", privyrResult.error);
  }

  return NextResponse.json({
    ok: true,
    result: scored.result,
    priority: scored.priority,
  });
}
