import type { Payload } from "payload";

const DEFAULT_CONTACT_EMAIL = "info@alandalus-iq.com";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function resolveContactInbox(
  payload: Payload,
): Promise<string> {
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
    console.warn("[contact] Could not read site settings email:", error);
  }

  return DEFAULT_CONTACT_EMAIL;
}

export async function sendContactNotification(
  payload: Payload,
  submission: ContactSubmission,
): Promise<void> {
  const to = await resolveContactInbox(payload);
  const subject = `[Website Contact] ${submission.subject}`;
  const phoneLine = submission.phone
    ? `<p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>`
    : "";

  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    ${phoneLine}
    <p><strong>Subject:</strong> ${escapeHtml(submission.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(submission.message).replace(/\n/g, "<br>")}</p>
  `;

  const text = [
    "New contact form message",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    `Subject: ${submission.subject}`,
    "",
    submission.message,
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
