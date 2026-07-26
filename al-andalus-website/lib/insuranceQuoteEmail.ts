import type { Payload } from "payload";

const DEFAULT_QUOTES_EMAIL = "website@alandalus-iq.com";

export type InsuranceQuoteSubmission = {
  fullName: string;
  email: string;
  phone: string;
  insuranceService: string;
  city?: string;
  details?: string;
};

export async function resolveQuotesInbox(payload: Payload): Promise<string> {
  if (process.env.QUOTES_TO_EMAIL) {
    return process.env.QUOTES_TO_EMAIL;
  }

  if (process.env.CONTACT_TO_EMAIL) {
    return process.env.CONTACT_TO_EMAIL;
  }

  try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
      overrideAccess: true,
    });
    const configured = (settings as { contact?: { email?: string } })?.contact
      ?.email;
    if (configured) {
      return configured;
    }
  } catch (error) {
    console.warn("[quotes] Could not read site settings email:", error);
  }

  return DEFAULT_QUOTES_EMAIL;
}

export async function sendInsuranceQuoteNotification(
  payload: Payload,
  submission: InsuranceQuoteSubmission,
): Promise<void> {
  const to = await resolveQuotesInbox(payload);
  const subject = `[Insurance Quote] ${submission.insuranceService} — ${submission.fullName}`;
  const cityLine = submission.city
    ? `<p><strong>City:</strong> ${escapeHtml(submission.city)}</p>`
    : "";
  const detailsHtml = submission.details
    ? `<p><strong>Details:</strong></p><p>${escapeHtml(submission.details).replace(/\n/g, "<br>")}</p>`
    : "";

  const html = `
    <h2>New insurance quote request</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
    <p><strong>Service:</strong> ${escapeHtml(submission.insuranceService)}</p>
    ${cityLine}
    ${detailsHtml}
    <p>Full request is also stored in the dashboard under Insurance Requests.</p>
  `;

  const text = [
    "New insurance quote request",
    `Name: ${submission.fullName}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Service: ${submission.insuranceService}`,
    submission.city ? `City: ${submission.city}` : null,
    "",
    submission.details || null,
    "",
    "Full request is also stored in the dashboard under Insurance Requests.",
  ]
    .filter(Boolean)
    .join("\n");

  await payload.sendEmail({
    to,
    replyTo: submission.email,
    subject,
    html,
    text,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
