/**
 * Cloudflare Turnstile server-side verification. If TURNSTILE_SECRET_KEY
 * isn't configured, verification is skipped (returns valid) so the form
 * keeps working in dev/before the credential is issued -- but this is a
 * real anti-bot gap and is called out as a deployment blocker until the
 * key is set. See docs/DEPLOYMENT_CHECKLIST.md.
 */
export async function verifyTurnstileToken(token: string | undefined, ip: string): Promise<{ ok: boolean; skipped: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, skipped: false };
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return { ok: data.success, skipped: false };
  } catch {
    return { ok: false, skipped: false };
  }
}
