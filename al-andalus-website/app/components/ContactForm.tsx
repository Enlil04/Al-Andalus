"use client";

import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import { siteCopy } from "@/lib/copy/en";
import "./RequestQuote.css";

export default function ContactForm() {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");

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
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || formCopy.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="request-quote" id="contact-form-section">
      <div className="about-grid request-quote__grid">
        <aside className="request-quote__aside about-grid__cols-1-5">
          <ScrollReveal>
            <span className="request-quote__label">({formCopy.label})</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={formCopy.headline}
            className="request-quote__headline"
            as="h2"
          />
          <ScrollReveal delay={0.5}>
            <p className="request-quote__intro">{formCopy.intro}</p>
          </ScrollReveal>
        </aside>

        <div className="request-quote__main about-grid__cols-7-12">
          <form className="request-quote__form" onSubmit={handleSubmit} noValidate>
            <fieldset className="request-quote__fieldset">
              <legend className="request-quote__legend">{formCopy.legend}</legend>

              <div className="request-quote__fields">
                <div className="request-quote__field">
                  <label htmlFor="name">{formCopy.fields.name}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  <span className="request-quote__help-text">{formCopy.fields.nameHelp}</span>
                </div>

                <div className="request-quote__field">
                  <label htmlFor="email">{formCopy.fields.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
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
                    placeholder="General inquiry"
                  />
                  <span className="request-quote__help-text">{formCopy.fields.subjectHelp}</span>
                </div>

                <div className="request-quote__field request-quote__field--full">
                  <label htmlFor="message">{formCopy.fields.message}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
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
