/**
 * Redacts personal data and secrets before anything reaches production logs.
 * Full phone numbers, emails, webhook URLs and tokens are never written out
 * verbatim -- only enough to correlate a report with a specific submission.
 */
function redactPhone(phone: string): string {
  return phone.length > 4 ? `***${phone.slice(-4)}` : "***";
}

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 1)}***@${domain}`;
}

function redactUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}/***`;
  } catch {
    return "***";
  }
}

export function logLeadError(context: string, details: { phone?: string; email?: string; webhookUrl?: string; error?: unknown; submissionId?: string }) {
  console.error(context, {
    submissionId: details.submissionId,
    phone: details.phone ? redactPhone(details.phone) : undefined,
    email: details.email ? redactEmail(details.email) : undefined,
    webhookUrl: details.webhookUrl ? redactUrl(details.webhookUrl) : undefined,
    error: details.error instanceof Error ? details.error.message : details.error,
  });
}
