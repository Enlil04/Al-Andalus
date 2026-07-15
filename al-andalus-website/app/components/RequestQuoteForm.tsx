"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import { contactInfo } from "@/lib/contact";
import { siteCopy } from "@/lib/copy/en";
import "./RequestQuote.css";

const { form: formCopy } = siteCopy.requestQuotePage;
const insuranceTypes = formCopy.insuranceTypes;

type InsuranceId = (typeof insuranceTypes)[number]["id"];

const coverageFieldKeys = [
  "destination",
  "travelDates",
  "travelers",
  "vehicleMake",
  "vehicleYear",
  "licensePlate",
  "vehicleValue",
  "coverageType",
  "dob",
  "preExisting",
  "propertyType",
  "propertyValue",
  "propertyLocation",
  "projectType",
  "projectDuration",
  "contractValue",
] as const;

export default function RequestQuoteForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as InsuranceId | null;

  const [activeType, setActiveType] = useState<InsuranceId>("travel");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Sync state if query parameter changes
  useEffect(() => {
    if (typeParam && insuranceTypes.some((t) => t.id === typeParam)) {
      setActiveType(typeParam);
      setStatus("idle");
    }
  }, [typeParam]);

  const activeLabel =
    insuranceTypes.find((type) => type.id === activeType)?.label ?? "Insurance";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    const coverageFields = coverageFieldKeys
      .map((key) => {
        const value = data.get(key)?.toString().trim();
        if (!value) return null;
        const label = form.querySelector<HTMLLabelElement>(`label[for="${key}"]`);
        return `${label?.textContent?.replace("*", "").trim() ?? key}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");

    const message = data.get("message")?.toString().trim();
    const details = [coverageFields, message && `Notes: ${message}`]
      .filter(Boolean)
      .join("\n\n");

    try {
      const res = await fetch("/api/insurance-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: data.get("city"),
          insuranceService: activeLabel,
          details,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="request-quote" id="request-form">
      <div className="about-grid request-quote__grid">
        <aside className="request-quote__aside about-grid__cols-1-5">
          <ScrollReveal>
            <span className="request-quote__label">{formCopy.label}</span>
          </ScrollReveal>
          <AnimatedHeadline
            title={formCopy.headline}
            className="request-quote__headline"
            as="h2"
          />
          <ScrollReveal delay={1}>
            <p className="request-quote__intro">{formCopy.intro}</p>
          </ScrollReveal>

          <nav className="request-quote__types" aria-label={formCopy.typesNavLabel}>
            {insuranceTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`request-quote__type ${activeType === type.id ? "is-active" : ""}`}
                onClick={() => {
                  setActiveType(type.id);
                  setStatus("idle");
                }}
                aria-pressed={activeType === type.id}
              >
                <span className="request-quote__type-dot" aria-hidden="true" />
                {type.label}
              </button>
            ))}
          </nav>

          <p className="request-quote__aside-note">
            {formCopy.asideNote}{" "}
            <Link href="#visit-us" className="request-quote__aside-link">
              {formCopy.asideLink}
            </Link>
          </p>
        </aside>

        <div className="request-quote__main about-grid__cols-7-12">
          <form className="request-quote__form" onSubmit={handleSubmit} noValidate>
            <p className="request-quote__form-badge">{activeLabel}</p>

            <fieldset className="request-quote__fieldset" key={activeType}>
              <legend className="request-quote__legend">{formCopy.coverageLegend}</legend>

              {activeType === "travel" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <label htmlFor="destination">Destination</label>
                    <input id="destination" name="destination" type="text" required placeholder="e.g. Turkey, UAE" />
                    <span className="request-quote__help-text">The country or region you are traveling to (e.g. Turkey, Schengen Area, UAE)</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="travelDates">Travel dates</label>
                    <input id="travelDates" name="travelDates" type="text" required placeholder="DD/MM/YYYY – DD/MM/YYYY" />
                    <span className="request-quote__help-text">Departure and return dates of your trip</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="travelers">Travelers</label>
                    <input id="travelers" name="travelers" type="number" required min={1} placeholder="1" />
                    <span className="request-quote__help-text">Number of individuals covered under this policy</span>
                  </div>
                </div>
              )}

              {activeType === "motor" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field">
                    <label htmlFor="vehicleMake">Make & model</label>
                    <input id="vehicleMake" name="vehicleMake" type="text" required placeholder="e.g. Toyota Land Cruiser" />
                    <span className="request-quote__help-text">Enter the manufacturer and vehicle model</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="vehicleYear">Year</label>
                    <input id="vehicleYear" name="vehicleYear" type="number" required min={1990} placeholder="2024" />
                    <span className="request-quote__help-text">The year the vehicle was manufactured</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="licensePlate">License plate</label>
                    <input id="licensePlate" name="licensePlate" type="text" required placeholder="Baghdad 12345" />
                    <span className="request-quote__help-text">Official vehicle license plate details</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="vehicleValue">Estimated value</label>
                    <input id="vehicleValue" name="vehicleValue" type="text" required placeholder="IQD or USD" />
                    <span className="request-quote__help-text">Estimated market value of the vehicle</span>
                  </div>
                </div>
              )}

              {activeType === "health" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <label htmlFor="coverageType">Coverage type</label>
                    <select id="coverageType" name="coverageType" required defaultValue="">
                      <option value="" disabled>Select…</option>
                      <option value="individual">Individual</option>
                      <option value="family">Family</option>
                      <option value="corporate">Corporate</option>
                    </select>
                    <span className="request-quote__help-text">Choose whether the policy is for yourself, your family, or your company</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="dob">Date of birth</label>
                    <input id="dob" name="dob" type="date" required />
                    <span className="request-quote__help-text">Used to calculate age-based coverage brackets</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="preExisting">Pre-existing conditions</label>
                    <select id="preExisting" name="preExisting" required defaultValue="">
                      <option value="" disabled>Select…</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    <span className="request-quote__help-text">Declare any active or chronic medical conditions</span>
                  </div>
                </div>
              )}

              {activeType === "fire" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field">
                    <label htmlFor="propertyType">Property type</label>
                    <select id="propertyType" name="propertyType" required defaultValue="">
                      <option value="" disabled>Select…</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                    <span className="request-quote__help-text">The category of the property to be insured</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="propertyValue">Estimated value</label>
                    <input id="propertyValue" name="propertyValue" type="text" required placeholder="IQD or USD" />
                    <span className="request-quote__help-text">Estimated market value of the building & inventory</span>
                  </div>
                  <div className="request-quote__field request-quote__field--full">
                    <label htmlFor="propertyLocation">Location / address</label>
                    <input id="propertyLocation" name="propertyLocation" type="text" required placeholder="Full address" />
                    <span className="request-quote__help-text">Full physical address of the insured property</span>
                  </div>
                </div>
              )}

              {activeType === "engineering" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <label htmlFor="projectType">Project type</label>
                    <select id="projectType" name="projectType" required defaultValue="">
                      <option value="" disabled>Select…</option>
                      <option value="construction">Contractors All Risks</option>
                      <option value="erection">Erection All Risks</option>
                      <option value="machinery">Machinery Breakdown</option>
                      <option value="electronic">Electronic Equipment</option>
                    </select>
                    <span className="request-quote__help-text">Select the category that best matches your engineering project</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="projectDuration">Duration</label>
                    <input id="projectDuration" name="projectDuration" type="text" required placeholder="e.g. 18 months" />
                    <span className="request-quote__help-text">Estimated timeline of the engineering works</span>
                  </div>
                  <div className="request-quote__field">
                    <label htmlFor="contractValue">Contract value</label>
                    <input id="contractValue" name="contractValue" type="text" required placeholder="IQD or USD" />
                    <span className="request-quote__help-text">Total value of the construction or machinery works contract</span>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="request-quote__fieldset">
              <legend className="request-quote__legend">{formCopy.detailsLegend}</legend>
              <div className="request-quote__fields">
                <div className="request-quote__field request-quote__field--full">
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" name="fullName" type="text" required autoComplete="name" />
                  <span className="request-quote__help-text">Enter your full legal name as it appears on your passport or national ID</span>
                </div>
                <div className="request-quote__field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                  <span className="request-quote__help-text">We will send your quote proposal to this address</span>
                </div>
                <div className="request-quote__field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" />
                  <span className="request-quote__help-text">Mobile number for quick coordination & WhatsApp updates</span>
                </div>
                <div className="request-quote__field request-quote__field--full">
                  <label htmlFor="city">Preferred branch</label>
                  <select id="city" name="city" required defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option value="Baghdad">Baghdad — Headquarters</option>
                    <option value="Basrah">Basrah</option>
                    <option value="Erbil">Erbil</option>
                  </select>
                  <span className="request-quote__help-text">Choose the physical office that will process your request and issue the policy</span>
                </div>
                <div className="request-quote__field request-quote__field--full">
                  <label htmlFor="message">Additional notes</label>
                  <textarea id="message" name="message" rows={3} placeholder={formCopy.notesPlaceholder} />
                  <span className="request-quote__help-text">Provide any special details, coverage requests, or additional parameters here</span>
                </div>
              </div>
            </fieldset>

            <div className="request-quote__footer">
              <button type="submit" className="btn" disabled={status === "loading"}>
                {status === "loading" ? formCopy.submitting : formCopy.submit}
                <svg className="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </button>

              {status === "success" && (
                <p className="request-quote__feedback request-quote__feedback--success" role="status">
                  {formCopy.success}
                </p>
              )}
              {status === "error" && (
                <p className="request-quote__feedback request-quote__feedback--error" role="alert">
                  {formCopy.errorPrefix}{" "}
                  <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
