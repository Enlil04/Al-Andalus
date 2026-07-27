"use client";

import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import FormFieldLabel from "./FormFieldLabel";
import { getSiteCopy } from "@/lib/copy";
import {
  clearInvalidMarks,
  getEmptyRequiredFields,
  isValidEmail,
  isValidPhone,
  markInvalidFields,
} from "@/lib/formValidation";
import { useLocale } from "./LocaleProvider";
import "./RequestQuote.css";

type ContactFormProps = {
  formLabel?: string;
  formHeadline?: string;
  formIntro?: string;
};

export default function ContactForm({
  formLabel,
  formHeadline,
  formIntro,
}: ContactFormProps) {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { form: formCopy } = siteCopy.contactPage;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    e.currentTarget.classList.remove("is-invalid");
    e.currentTarget.closest(".request-quote__field")?.classList.remove("is-invalid");
    if (error === formCopy.requiredFieldsError) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");

    const form = e.currentTarget;
    clearInvalidMarks(form);

    const emptyRequired = getEmptyRequiredFields(form);
    if (emptyRequired.length > 0) {
      markInvalidFields(emptyRequired, true);
      emptyRequired[0]?.focus();
      setError(formCopy.requiredFieldsError);
      setSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      const emailInput = form.querySelector<HTMLInputElement>("#email");
      if (emailInput) markInvalidFields([emailInput], true);
      setError(formCopy.invalidEmailError);
      setSubmitting(false);
      return;
    }
    if (formData.phone.trim() && !isValidPhone(formData.phone, { required: false })) {
      const phoneInput = form.querySelector<HTMLInputElement>("#phone");
      if (phoneInput) markInvalidFields([phoneInput], true);
      setError(formCopy.invalidPhoneError);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || formCopy.error);
      }

      setSuccess(true);
      clearInvalidMarks(form);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : formCopy.error);
    } finally {
      setSubmitting(false);
    }
  };

  const namePlaceholder = locale === "ar" ? "أحمد علي" : "John Doe";
  const emailPlaceholder = locale === "ar" ? "ahmed@example.com" : "john@example.com";
  const subjectPlaceholder = locale === "ar" ? "استفسار عام" : "General inquiry";
  const messagePlaceholder = locale === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?";

  return (
    <section className="request-quote" id="contact-form-section">
      <div className="about-grid request-quote__grid">
        <aside className="request-quote__aside about-grid__cols-1-5">
          <ScrollReveal>
            <span className="request-quote__label">({formLabel ?? formCopy.label})</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={formHeadline ?? formCopy.headline}
            className="request-quote__headline"
            as="h2"
          />
          <ScrollReveal delay={0.5}>
            <p className="request-quote__intro">{formIntro ?? formCopy.intro}</p>
          </ScrollReveal>
        </aside>

        <div className="request-quote__main about-grid__cols-7-12">
          <form className="request-quote__form" onSubmit={handleSubmit} noValidate>
            <fieldset className="request-quote__fieldset">
              <legend className="request-quote__legend">{formCopy.legend}</legend>

              <div className="request-quote__fields">
                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="name" required requiredMark={formCopy.requiredMark}>
                    {formCopy.fields.name}
                  </FormFieldLabel>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    placeholder={namePlaceholder}
                    autoComplete="name"
                  />
                  <span className="request-quote__help-text">{formCopy.fields.nameHelp}</span>
                </div>

                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="email" required requiredMark={formCopy.requiredMark}>
                    {formCopy.fields.email}
                  </FormFieldLabel>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={emailPlaceholder}
                    autoComplete="email"
                  />
                  <span className="request-quote__help-text">{formCopy.fields.emailHelp}</span>
                </div>

                <div className="request-quote__field">
                  <label htmlFor="phone">{formCopy.fields.phone}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+964 770 000 0000"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <span className="request-quote__help-text">{formCopy.fields.phoneHelp}</span>
                </div>

                <div className="request-quote__field">
                  <label htmlFor="subject">{formCopy.fields.subject}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={subjectPlaceholder}
                  />
                  <span className="request-quote__help-text">{formCopy.fields.subjectHelp}</span>
                </div>

                <div className="request-quote__field request-quote__field--full">
                  <FormFieldLabel htmlFor="message" required requiredMark={formCopy.requiredMark}>
                    {formCopy.fields.message}
                  </FormFieldLabel>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={messagePlaceholder}
                    rows={4}
                  />
                  <span className="request-quote__help-text">{formCopy.fields.messageHelp}</span>
                </div>
              </div>
            </fieldset>

            <div className="request-quote__footer">
              <button
                type="submit"
                disabled={submitting}
                className="btn"
              >
                {submitting ? formCopy.submitting : formCopy.submit}
                <svg
                  className="btn-arrow"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  style={locale === "ar" ? { transform: "rotate(180deg)", marginRight: "0.5rem" } : undefined}
                >
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </button>

              {success && (
                <p className="request-quote__feedback request-quote__feedback--success" role="status">
                  {formCopy.success}
                </p>
              )}

              {error && (
                <p className="request-quote__feedback request-quote__feedback--error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
