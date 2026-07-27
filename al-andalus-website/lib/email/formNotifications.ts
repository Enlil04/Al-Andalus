import type { Payload } from "payload";
import type { Attachment } from "nodemailer/lib/mailer";

/** Shared inbox for all website form notifications. */
const DEFAULT_FORM_INBOX = "info@alandalus-iq.com";

export type FormEmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type FormField = {
  label: string;
  value: string;
};

function resolveFormInbox(overrideEnv?: string): string {
  if (overrideEnv?.trim()) {
    return overrideEnv.trim();
  }
  if (process.env.CONTACT_TO_EMAIL?.trim()) {
    return process.env.CONTACT_TO_EMAIL.trim();
  }
  return DEFAULT_FORM_INBOX;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeText(value: unknown, maxLength: number): string {
  if (value == null) return "";
  return String(value).trim().slice(0, maxLength);
}

function displayValue(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

function buildTextBody(title: string, fields: FormField[]): string {
  const lines = [title, ""];
  for (const field of fields) {
    lines.push(`${field.label}:`);
    lines.push(displayValue(field.value));
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function buildHtmlBody(title: string, fields: FormField[]): string {
  const parts = [`<h2>${escapeHtml(title)}</h2>`];
  for (const field of fields) {
    const safe = escapeHtml(displayValue(field.value)).replace(/\n/g, "<br>");
    parts.push(
      `<p><strong>${escapeHtml(field.label)}:</strong><br>${safe}</p>`,
    );
  }
  return parts.join("\n");
}

/**
 * Central form mailer — uses Payload's configured nodemailer SMTP adapter
 * (single shared transport). Never sets `from` to the visitor address;
 * Reply-To carries the submitter email instead.
 */
export async function sendFormNotification(
  payload: Payload,
  options: {
    to?: string;
    subject: string;
    title: string;
    replyTo: string;
    fields: FormField[];
    attachments?: FormEmailAttachment[];
  },
): Promise<void> {
  const to = options.to || resolveFormInbox();
  const text = buildTextBody(options.title, options.fields);
  const html = buildHtmlBody(options.title, options.fields);

  const attachments: Attachment[] | undefined = options.attachments?.length
    ? options.attachments.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      }))
    : undefined;

  // Do not pass `from` — Payload's adapter uses SMTP_FROM_* / defaultFromAddress.
  await payload.sendEmail({
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    text,
    html,
    ...(attachments ? { attachments } : {}),
  });
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
};

export async function sendContactNotification(
  payload: Payload,
  submission: ContactSubmission,
): Promise<void> {
  await sendFormNotification(payload, {
    to: resolveFormInbox(process.env.CONTACT_TO_EMAIL),
    subject: "New Contact Form Submission",
    title: "New Contact Form Submission",
    replyTo: submission.email,
    fields: [
      { label: "Name", value: submission.name },
      { label: "Email", value: submission.email },
      { label: "Phone", value: submission.phone || "" },
      { label: "Company", value: submission.company || "" },
      { label: "Subject", value: submission.subject },
      { label: "Message", value: submission.message },
    ],
  });
}

/* -------------------------------------------------------------------------- */
/* Job application                                                            */
/* -------------------------------------------------------------------------- */

export type JobApplicationSubmission = {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  coverLetter?: string;
  resume?: FormEmailAttachment;
};

export async function sendJobApplicationNotification(
  payload: Payload,
  submission: JobApplicationSubmission,
): Promise<void> {
  await sendFormNotification(payload, {
    to: resolveFormInbox(process.env.CAREERS_TO_EMAIL),
    subject: "New Job Application",
    title: "New Job Application Received",
    replyTo: submission.email,
    fields: [
      { label: "Name", value: submission.fullName },
      { label: "Email", value: submission.email },
      { label: "Phone", value: submission.phone },
      { label: "Position Applied For", value: submission.jobTitle },
      { label: "Cover Letter", value: submission.coverLetter || "" },
    ],
    attachments: submission.resume ? [submission.resume] : undefined,
  });
}

/* -------------------------------------------------------------------------- */
/* Quote request                                                              */
/* -------------------------------------------------------------------------- */

export type QuoteRequestSubmission = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget?: string;
  message?: string;
  attachments?: FormEmailAttachment[];
};

export async function sendInsuranceQuoteNotification(
  payload: Payload,
  submission: QuoteRequestSubmission,
): Promise<void> {
  await sendFormNotification(payload, {
    to: resolveFormInbox(process.env.QUOTES_TO_EMAIL),
    subject: "New Quote Request",
    title: "New Quote Request",
    replyTo: submission.email,
    fields: [
      { label: "Name", value: submission.fullName },
      { label: "Company", value: submission.company || "" },
      { label: "Email", value: submission.email },
      { label: "Phone", value: submission.phone },
      { label: "Requested Service", value: submission.service },
      { label: "Budget", value: submission.budget || "" },
      { label: "Project Details", value: submission.message || "" },
    ],
    attachments: submission.attachments,
  });
}
