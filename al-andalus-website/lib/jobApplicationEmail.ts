import type { Payload } from "payload";

const DEFAULT_CAREERS_EMAIL = "hr@alandalus-iq.com";

export type JobApplicationSubmission = {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
};

export async function resolveCareersInbox(payload: Payload): Promise<string> {
  if (process.env.CAREERS_TO_EMAIL) {
    return process.env.CAREERS_TO_EMAIL;
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
    console.warn("[careers] Could not read site settings email:", error);
  }

  return DEFAULT_CAREERS_EMAIL;
}

export async function sendJobApplicationNotification(
  payload: Payload,
  submission: JobApplicationSubmission,
): Promise<void> {
  const to = await resolveCareersInbox(payload);
  const subject = `[Job Application] ${submission.jobTitle} — ${submission.fullName}`;

  const html = `
    <h2>New job application</h2>
    <p><strong>Position:</strong> ${escapeHtml(submission.jobTitle)}</p>
    <p><strong>Name:</strong> ${escapeHtml(submission.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>
    <p>The applicant's CV is stored in the dashboard under Job Applications.</p>
  `;

  const text = [
    "New job application",
    `Position: ${submission.jobTitle}`,
    `Name: ${submission.fullName}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    "",
    "The applicant's CV is stored in the dashboard under Job Applications.",
  ].join("\n");

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
