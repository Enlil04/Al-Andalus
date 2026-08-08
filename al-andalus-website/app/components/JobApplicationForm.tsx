"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import FormFieldLabel from "./FormFieldLabel";
import { useLocale } from "./LocaleProvider";
import {
  clearInvalidMarks,
  getEmptyRequiredFields,
  isValidEmail,
  isValidPhone,
  markInvalidFields,
} from "@/lib/formValidation";
import "./RequestQuote.css";

type JobApplicationFormProps = {
  jobId?: string | number;
  jobSlug: string;
  jobTitle: string;
};

export default function JobApplicationForm({
  jobId,
  jobSlug,
  jobTitle,
}: JobApplicationFormProps) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const copy = {
    label: isAr ? "طلب توظيف" : "Job Application",
    headline: isAr ? "قدّم طلبك" : "Submit your application",
    intro: isAr
      ? `أكمل النموذج أدناه للتقديم على وظيفة «${jobTitle}». سيتم إرسال طلبك إلى فريق الموارد البشرية.`
      : `Complete the form below to apply for the ${jobTitle} role. Your application will be sent to our HR team.`,
    legend: isAr ? "بياناتك" : "Your details",
    fullName: isAr ? "الاسم الكامل" : "Full name",
    fullNameHelp: isAr ? "كما يظهر في مستنداتك الرسمية" : "As it appears on your official documents",
    email: isAr ? "البريد الإلكتروني" : "Email",
    emailHelp: isAr ? "سنستخدم هذا العنوان للتواصل معك" : "We will use this address to contact you",
    phone: isAr ? "رقم الهاتف" : "Phone number",
    phoneHelp: isAr ? "رقم يمكننا الوصول إليك من خلاله" : "A number where we can reach you",
    cv: isAr ? "السيرة الذاتية" : "CV / Resume",
    cvHelp: isAr ? "PDF أو Word، بحد أقصى 5 ميغابايت" : "PDF or Word, up to 5 MB",
    submit: isAr ? "إرسال الطلب" : "Submit application",
    submitting: isAr ? "جاري الإرسال..." : "Submitting...",
    successTitle: isAr ? "تم إرسال طلبك" : "Application submitted",
    successBody: isAr
      ? "شكراً لتقديمك. سيراجع فريق الموارد البشرية طلبك ويتواصل معك عند الحاجة."
      : "Thank you for applying. Our HR team will review your application and contact you if needed.",
    backToJob: isAr ? "العودة إلى الوظيفة" : "Back to job",
    backToJobs: isAr ? "جميع الوظائف" : "All jobs",
    error: isAr ? "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى." : "Could not submit your application. Please try again.",
    requiredMark: isAr ? "مطلوبة" : "required",
    requiredFieldsError: isAr ? "يرجى ملء الحقول المطلوبة." : "Please fill in the required fields.",
    invalidEmailError: isAr ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email address.",
    invalidPhoneError: isAr ? "يرجى إدخال رقم هاتف صالح." : "Please enter a valid phone number.",
    rateLimitError: isAr
      ? "طلبات كثيرة جداً. يرجى المحاولة بعد قليل."
      : "Too many requests. Please try again later.",
    jobUnavailableError: isAr
      ? "هذه الوظيفة غير متاحة حالياً."
      : "This job opening is not available.",
    cvTypeError: isAr
      ? "يجب أن تكون السيرة الذاتية بصيغة PDF أو Word."
      : "CV must be a PDF or Word document.",
    cvSizeError: isAr
      ? "يجب ألا يتجاوز حجم السيرة الذاتية 5 ميغابايت."
      : "CV must be 5 MB or smaller.",
  };

  const localizeApiError = (apiError: unknown): string => {
    if (typeof apiError !== "string" || !apiError.trim()) return copy.error;
    const message = apiError.trim();
    if (/too many requests/i.test(message)) return copy.rateLimitError;
    if (/not available/i.test(message)) return copy.jobUnavailableError;
    if (/5\s*MB|smaller/i.test(message)) return copy.cvSizeError;
    if (/PDF or Word|invalid or unsupported|CV file/i.test(message)) {
      return copy.cvTypeError;
    }
    if (/error occurred while submitting|could not submit/i.test(message)) {
      return copy.error;
    }
    // Prefer locale-aware copy over raw English API strings.
    return copy.error;
  };

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    clearInvalidMarks(form);

    const emptyRequired = getEmptyRequiredFields(form);
    if (emptyRequired.length > 0) {
      markInvalidFields(emptyRequired, true);
      emptyRequired[0]?.focus();
      setStatus("error");
      setErrorMessage(copy.requiredFieldsError);
      return;
    }

    const data = new FormData(form);
    const email = data.get("email")?.toString().trim() ?? "";
    const phone = data.get("phone")?.toString().trim() ?? "";

    if (!isValidEmail(email)) {
      const emailInput = form.querySelector<HTMLInputElement>("#email");
      if (emailInput) markInvalidFields([emailInput], true);
      setStatus("error");
      setErrorMessage(copy.invalidEmailError);
      return;
    }
    if (!isValidPhone(phone)) {
      const phoneInput = form.querySelector<HTMLInputElement>("#phone");
      if (phoneInput) markInvalidFields([phoneInput], true);
      setStatus("error");
      setErrorMessage(copy.invalidPhoneError);
      return;
    }

    if (jobId != null) {
      data.set("job", String(jobId));
    }
    data.set("jobSlug", jobSlug);
    data.set("jobTitle", jobTitle);

    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: data,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(localizeApiError(result.error));
      }

      form.reset();
      clearInvalidMarks(form);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? localizeApiError(error.message) : copy.error,
      );
    }
  };

  if (status === "success") {
    return (
      <section className="request-quote" id="job-application-form">
        <div className="about-grid request-quote__grid">
          <div className="about-grid__span-all">
            <ScrollReveal>
              <span className="request-quote__label">({copy.label})</span>
              <AnimatedHeadline title={copy.successTitle} className="request-quote__headline" as="h2" />
              <p className="request-quote__intro">{copy.successBody}</p>
              <div className="request-quote__footer" style={{ marginTop: "2rem" }}>
                <Link href={`/jobs/${jobSlug}`} className="btn">
                  {copy.backToJob}
                </Link>
                <Link href="/jobs" className="request-quote__feedback">
                  {copy.backToJobs}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="request-quote" id="job-application-form">
      <div className="about-grid request-quote__grid">
        <aside className="request-quote__aside about-grid__cols-1-5">
          <ScrollReveal>
            <span className="request-quote__label">({copy.label})</span>
          </ScrollReveal>
          <AnimatedHeadline title={copy.headline} className="request-quote__headline" as="h2" />
          <ScrollReveal delay={0.5}>
            <p className="request-quote__intro">{copy.intro}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.7}>
            <Link href={`/jobs/${jobSlug}`} className="request-quote__feedback">
              {copy.backToJob}
            </Link>
          </ScrollReveal>
        </aside>

        <div className="request-quote__main about-grid__cols-7-12">
          <form
            className="request-quote__form"
            onSubmit={handleSubmit}
            noValidate
            onInput={(e) => {
              const target = e.target;
              if (!(target instanceof HTMLElement)) return;
              target.classList.remove("is-invalid");
              target.closest(".request-quote__field")?.classList.remove("is-invalid");
              if (errorMessage === copy.requiredFieldsError) setErrorMessage("");
            }}
          >
            <fieldset className="request-quote__fieldset">
              <legend className="request-quote__legend">{copy.legend}</legend>

              <div className="request-quote__fields">
                <div className="request-quote__field request-quote__field--full">
                  <FormFieldLabel htmlFor="fullName" required requiredMark={copy.requiredMark}>
                    {copy.fullName}
                  </FormFieldLabel>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder={isAr ? "أحمد علي" : "John Doe"}
                  />
                  <span className="request-quote__help-text">{copy.fullNameHelp}</span>
                </div>

                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="email" required requiredMark={copy.requiredMark}>
                    {copy.email}
                  </FormFieldLabel>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={isAr ? "ahmed@example.com" : "john@example.com"}
                  />
                  <span className="request-quote__help-text">{copy.emailHelp}</span>
                </div>

                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="phone" required requiredMark={copy.requiredMark}>
                    {copy.phone}
                  </FormFieldLabel>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+964 770 000 0000"
                  />
                  <span className="request-quote__help-text">{copy.phoneHelp}</span>
                </div>

                <div className="request-quote__field request-quote__field--full">
                  <FormFieldLabel htmlFor="cv" required requiredMark={copy.requiredMark}>
                    {copy.cv}
                  </FormFieldLabel>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    required
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                  <span className="request-quote__help-text">{copy.cvHelp}</span>
                </div>
              </div>
            </fieldset>

            <div className="request-quote__footer">
              <button
                type="submit"
                className="btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? copy.submitting : copy.submit}
              </button>
              {status === "error" ? (
                <p
                  className="request-quote__feedback request-quote__feedback--error"
                  role="alert"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
