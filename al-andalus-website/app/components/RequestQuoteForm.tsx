"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeadline from "./AnimatedHeadline";
import FormFieldLabel from "./FormFieldLabel";
import { contactInfo } from "@/lib/contact";
import { getSiteCopy } from "@/lib/copy";
import { useLocale } from "./LocaleProvider";
import type { QuoteProduct } from "@/lib/cms/content";
import {
  clearInvalidMarks,
  currentVehicleYearMax,
  getEmptyRequiredFields,
  isValidEmail,
  isValidPhone,
  markInvalidFields,
  todayDateInputValue,
  yearsAgoDateInputValue,
} from "@/lib/formValidation";
import "./RequestQuote.css";

const coverageFieldKeys = [
  "destination",
  "departureDate",
  "returnDate",
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

const QUOTE_PRODUCT_SLUGS: Record<
  "travel" | "motor" | "health" | "fire" | "engineering",
  string
> = {
  travel: "travel",
  motor: "motor",
  health: "health",
  fire: "fire",
  engineering: "engineering",
};

type RequestQuoteFormProps = {
  products?: QuoteProduct[];
  formLabel?: string;
  formHeadline?: string;
  formIntro?: string;
};

export default function RequestQuoteForm({
  products = [],
  formLabel,
  formHeadline,
  formIntro,
}: RequestQuoteFormProps) {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { form: formCopy } = siteCopy.requestQuotePage;
  const insuranceTypes = formCopy.insuranceTypes;

  type InsuranceId = "travel" | "motor" | "health" | "fire" | "engineering";

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as InsuranceId | null;

  const [activeType, setActiveType] = useState<InsuranceId>("travel");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldError, setFieldError] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const today = todayDateInputValue();
  const dobMin = yearsAgoDateInputValue(120);
  const vehicleYearMax = currentVehicleYearMax();

  // Sync state if query parameter changes
  useEffect(() => {
    if (typeParam && insuranceTypes.some((t) => t.id === typeParam)) {
      setActiveType(typeParam);
      setStatus("idle");
      setFieldError("");
      setDepartureDate("");
    }
  }, [typeParam, insuranceTypes]);

  const activeLabel =
    insuranceTypes.find((type) => type.id === activeType)?.label ?? (locale === "ar" ? "تأمين" : "Insurance");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError("");
    setStatus("loading");

    const form = e.currentTarget;
    clearInvalidMarks(form);

    const emptyRequired = getEmptyRequiredFields(form);
    if (emptyRequired.length > 0) {
      markInvalidFields(emptyRequired, true);
      emptyRequired[0]?.focus();
      setStatus("idle");
      setFieldError(formCopy.requiredFieldsError);
      return;
    }

    const data = new FormData(form);
    const fullName = data.get("fullName")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const phone = data.get("phone")?.toString().trim() ?? "";

    if (!isValidEmail(email)) {
      const emailInput = form.querySelector<HTMLInputElement>("#email");
      if (emailInput) markInvalidFields([emailInput], true);
      setStatus("idle");
      setFieldError(formCopy.invalidEmailError);
      return;
    }
    if (!isValidPhone(phone)) {
      const phoneInput = form.querySelector<HTMLInputElement>("#phone");
      if (phoneInput) markInvalidFields([phoneInput], true);
      setStatus("idle");
      setFieldError(formCopy.invalidPhoneError);
      return;
    }

    if (activeType === "travel") {
      const departure = data.get("departureDate")?.toString() ?? "";
      const returnDate = data.get("returnDate")?.toString() ?? "";
      if (departure && returnDate && returnDate < departure) {
        const returnInput = form.querySelector<HTMLInputElement>("#returnDate");
        if (returnInput) markInvalidFields([returnInput], true);
        setStatus("idle");
        setFieldError(formCopy.invalidReturnDateError);
        return;
      }
    }

    const coverageFields = coverageFieldKeys
      .map((key) => {
        const value = data.get(key)?.toString().trim();
        if (!value) return null;
        const label = form.querySelector<HTMLLabelElement>(`label[for="${key}"]`);
        return `${label?.textContent?.replace(/\s*\([^)]*\)\s*$/, "").trim() ?? key}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");

    const message = data.get("message")?.toString().trim();
    const details = [coverageFields, message && `${locale === "ar" ? "ملاحظات" : "Notes"}: ${message}`]
      .filter(Boolean)
      .join("\n\n");

    try {
      const productSlug = QUOTE_PRODUCT_SLUGS[activeType];
      const matchedProduct =
        products.find((product) => product.slug === productSlug) ??
        products.find((product) => product.slug.includes(productSlug));

      const res = await fetch("/api/insurance-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          city: data.get("city"),
          insuranceService: matchedProduct?.id ?? productSlug,
          details,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submit failed");
      }

      form.reset();
      setDepartureDate("");
      clearInvalidMarks(form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (
        err instanceof Error &&
        err.message &&
        err.message !== "Submit failed" &&
        !/occurred while submitting/i.test(err.message)
      ) {
        setFieldError(err.message);
      }
    }
  };

  // Localized string objects for form fields
  const tr = {
    destination: locale === "ar" ? "الوجهة" : "Destination",
    destinationPlaceholder: locale === "ar" ? "مثال: تركيا، الإمارات" : "e.g. Turkey, UAE",
    destinationHelp: locale === "ar" ? "الدولة أو المنطقة التي تسافر إليها (مثل: تركيا، منطقة الشنغن، الإمارات)" : "The country or region you are traveling to (e.g. Turkey, Schengen Area, UAE)",
    
    departureDate: locale === "ar" ? "تاريخ المغادرة" : "Departure date",
    departureDateHelp: locale === "ar" ? "يوم بدء الرحلة" : "First day of travel",
    returnDate: locale === "ar" ? "تاريخ العودة" : "Return date",
    returnDateHelp: locale === "ar" ? "يوم العودة — يجب أن يكون في أو بعد تاريخ المغادرة" : "Return day — must be on or after departure",
    
    travelers: locale === "ar" ? "عدد المسافرين" : "Travelers",
    travelersHelp: locale === "ar" ? "عدد الأفراد المشمولين بهذه الوثيقة" : "Number of individuals covered under this policy",
    
    vehicleMake: locale === "ar" ? "النوع والموديل" : "Make & model",
    vehicleMakePlaceholder: locale === "ar" ? "مثال: تويوتا لاند كروزر" : "e.g. Toyota Land Cruiser",
    vehicleMakeHelp: locale === "ar" ? "أدخل الشركة المصنعة وموديل السيارة" : "Enter the manufacturer and vehicle model",
    
    vehicleYear: locale === "ar" ? "سنة الصنع" : "Year",
    vehicleYearHelp: locale === "ar" ? "سنة تصنيع السيارة" : "The year the vehicle was manufactured",
    
    licensePlate: locale === "ar" ? "رقم اللوحة" : "License plate",
    licensePlatePlaceholder: locale === "ar" ? "بغداد ١٢٣٤٥" : "Baghdad 12345",
    licensePlateHelp: locale === "ar" ? "تفاصيل لوحة السيارة الرسمية" : "Official vehicle license plate details",
    
    vehicleValue: locale === "ar" ? "القيمة التقديرية" : "Estimated value",
    vehicleValuePlaceholder: locale === "ar" ? "بالدينار أو الدولار" : "IQD or USD",
    vehicleValueHelp: locale === "ar" ? "القيمة السوقية التقديرية للسيارة" : "Estimated market value of the vehicle",
    
    coverageType: locale === "ar" ? "نوع التغطية" : "Coverage type",
    selectPlaceholder: locale === "ar" ? "اختر..." : "Select…",
    individual: locale === "ar" ? "فردي" : "Individual",
    family: locale === "ar" ? "عائلي" : "Family",
    corporate: locale === "ar" ? "مؤسسات / شركات" : "Corporate",
    coverageTypeHelp: locale === "ar" ? "اختر ما إذا كانت الوثيقة لك، لعائلتك، أو لشركتك" : "Choose whether the policy is for yourself, your family, or your company",
    
    dob: locale === "ar" ? "تاريخ الميلاد" : "Date of birth",
    dobHelp: locale === "ar" ? "يُستخدم لحساب فئات التغطية بناءً على العمر" : "Used to calculate age-based coverage brackets",
    
    preExisting: locale === "ar" ? "حالات مرضية سابقة" : "Pre-existing conditions",
    preExistingHelp: locale === "ar" ? "صرّح عن أي حالات طبية نشطة أو مزمنة" : "Declare any active or chronic medical conditions",
    yes: locale === "ar" ? "نعم" : "Yes",
    no: locale === "ar" ? "لا" : "No",
    
    propertyType: locale === "ar" ? "نوع العقار" : "Property type",
    residential: locale === "ar" ? "سكني" : "Residential",
    commercial: locale === "ar" ? "تجاري" : "Commercial",
    industrial: locale === "ar" ? "صناعي" : "Industrial",
    propertyTypeHelp: locale === "ar" ? "فئة العقار المراد تأمينه" : "The category of the property to be insured",
    
    propertyValue: locale === "ar" ? "القيمة التقديرية" : "Estimated value",
    propertyValuePlaceholder: locale === "ar" ? "بالدينار أو الدولار" : "IQD or USD",
    propertyValueHelp: locale === "ar" ? "القيمة السوقية التقديرية للمبنى والمخزون" : "Estimated market value of the building & inventory",
    
    propertyLocation: locale === "ar" ? "الموقع / العنوان" : "Location / address",
    propertyLocationPlaceholder: locale === "ar" ? "العنوان الكامل بالتفصيل" : "Full address",
    propertyLocationHelp: locale === "ar" ? "العنوان الفعلي الكامل للعقار المؤمن عليه" : "Full physical address of the insured property",
    
    projectType: locale === "ar" ? "نوع المشروع" : "Project type",
    projectTypeHelp: locale === "ar" ? "اختر الفئة التي تطابق مشروعك الهندسي بأفضل شكل" : "Select the category that best matches your engineering project",
    construction: locale === "ar" ? "جميع أخطار المقاولين" : "Contractors All Risks",
    erection: locale === "ar" ? "جميع أخطار النصب" : "Erection All Risks",
    machinery: locale === "ar" ? "عطل الآلات" : "Machinery Breakdown",
    electronic: locale === "ar" ? "الأجهزة الإلكترونية" : "Electronic Equipment",
    
    duration: locale === "ar" ? "مدة المشروع" : "Duration",
    durationPlaceholder: locale === "ar" ? "مثال: ١٨ شهراً" : "e.g. 18 months",
    durationHelp: locale === "ar" ? "الجدول الزمني التقديري للأعمال الهندسية" : "Estimated timeline of the engineering works",
    
    contractValue: locale === "ar" ? "قيمة العقد" : "Contract value",
    contractValuePlaceholder: locale === "ar" ? "بالدينار أو الدولار" : "IQD or USD",
    contractValueHelp: locale === "ar" ? "القيمة الإجمالية لعقد أعمال الإنشاء أو تركيب الآلات" : "Total value of the construction or machinery works contract",
    
    fullName: locale === "ar" ? "الاسم الكامل" : "Full name",
    fullNameHelp: locale === "ar" ? "أدخل اسمك القانوني الكامل كما يظهر في البطاقة الوطنية أو جواز السفر" : "Enter your full legal name as it appears on your passport or national ID",
    
    email: locale === "ar" ? "البريد الإلكتروني" : "Email",
    emailHelp: locale === "ar" ? "سنرسل مقترح عرض الأسعار إلى هذا العنوان" : "We will send your quote proposal to this address",
    
    phone: locale === "ar" ? "رقم الهاتف" : "Phone",
    phoneHelp: locale === "ar" ? "رقم الهاتف للتنسيق السريع وتحديثات واتساب" : "Mobile number for quick coordination & WhatsApp updates",
    
    preferredBranch: locale === "ar" ? "الفرع المفضل" : "Preferred branch",
    preferredBranchHelp: locale === "ar" ? "اختر المكتب الفعلي الذي سيقوم بمعالجة طلبك وإصدار الوثيقة" : "Choose the physical office that will process your request and issue the policy",
    
    additionalNotes: locale === "ar" ? "ملاحظات إضافية" : "Additional notes",
    additionalNotesHelp: locale === "ar" ? "اذكر أي تفاصيل خاصة، طلبات تغطية إضافية، أو معايير أخرى هنا" : "Provide any special details, coverage requests, or additional parameters here",
  };

  return (
    <section className="request-quote" id="request-form">
      <div className="about-grid request-quote__grid">
        <aside className="request-quote__aside about-grid__cols-1-5">
          <ScrollReveal>
            <span className="request-quote__label">{formLabel ?? formCopy.label}</span>
          </ScrollReveal>
          <ScrollReveal delay={0.5}>
            <h2 className="request-quote__headline">
              {formHeadline ?? formCopy.headline}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="request-quote__intro">{formIntro ?? formCopy.intro}</p>
          </ScrollReveal>

          <nav className="request-quote__types" aria-label={formCopy.typesNavLabel}>
            {insuranceTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`request-quote__type ${activeType === type.id ? "is-active" : ""}`}
                onClick={() => {
                  setActiveType(type.id as InsuranceId);
                  setStatus("idle");
                  setFieldError("");
                  setDepartureDate("");
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
          <form
            className="request-quote__form"
            onSubmit={handleSubmit}
            noValidate
            onInput={(e) => {
              const target = e.target;
              if (!(target instanceof HTMLElement)) return;
              target.classList.remove("is-invalid");
              target.closest(".request-quote__field")?.classList.remove("is-invalid");
              if (fieldError === formCopy.requiredFieldsError) setFieldError("");
            }}
          >
            <p className="request-quote__form-badge">{activeLabel}</p>

            <fieldset className="request-quote__fieldset" key={activeType}>
              <legend className="request-quote__legend">{formCopy.coverageLegend}</legend>

              {activeType === "travel" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <FormFieldLabel htmlFor="destination" required requiredMark={formCopy.requiredMark}>
                      {tr.destination}
                    </FormFieldLabel>
                    <input id="destination" name="destination" type="text" required placeholder={tr.destinationPlaceholder} />
                    <span className="request-quote__help-text">{tr.destinationHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="departureDate" required requiredMark={formCopy.requiredMark}>
                      {tr.departureDate}
                    </FormFieldLabel>
                    <input
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      required
                      min={today}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                    <span className="request-quote__help-text">{tr.departureDateHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="returnDate" required requiredMark={formCopy.requiredMark}>
                      {tr.returnDate}
                    </FormFieldLabel>
                    <input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      required
                      min={departureDate || today}
                    />
                    <span className="request-quote__help-text">{tr.returnDateHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="travelers" required requiredMark={formCopy.requiredMark}>
                      {tr.travelers}
                    </FormFieldLabel>
                    <input id="travelers" name="travelers" type="number" required min={1} max={50} placeholder="1" />
                    <span className="request-quote__help-text">{tr.travelersHelp}</span>
                  </div>
                </div>
              )}

              {activeType === "motor" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="vehicleMake" required requiredMark={formCopy.requiredMark}>
                      {tr.vehicleMake}
                    </FormFieldLabel>
                    <input id="vehicleMake" name="vehicleMake" type="text" required placeholder={tr.vehicleMakePlaceholder} />
                    <span className="request-quote__help-text">{tr.vehicleMakeHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="vehicleYear" required requiredMark={formCopy.requiredMark}>
                      {tr.vehicleYear}
                    </FormFieldLabel>
                    <input
                      id="vehicleYear"
                      name="vehicleYear"
                      type="number"
                      required
                      min={1990}
                      max={vehicleYearMax}
                      placeholder="2024"
                    />
                    <span className="request-quote__help-text">{tr.vehicleYearHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="licensePlate" required requiredMark={formCopy.requiredMark}>
                      {tr.licensePlate}
                    </FormFieldLabel>
                    <input id="licensePlate" name="licensePlate" type="text" required placeholder={tr.licensePlatePlaceholder} />
                    <span className="request-quote__help-text">{tr.licensePlateHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="vehicleValue" required requiredMark={formCopy.requiredMark}>
                      {tr.vehicleValue}
                    </FormFieldLabel>
                    <input id="vehicleValue" name="vehicleValue" type="text" required placeholder={tr.vehicleValuePlaceholder} />
                    <span className="request-quote__help-text">{tr.vehicleValueHelp}</span>
                  </div>
                </div>
              )}

              {activeType === "health" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <FormFieldLabel htmlFor="coverageType" required requiredMark={formCopy.requiredMark}>
                      {tr.coverageType}
                    </FormFieldLabel>
                    <select id="coverageType" name="coverageType" required defaultValue="">
                      <option value="" disabled>{tr.selectPlaceholder}</option>
                      <option value="individual">{tr.individual}</option>
                      <option value="family">{tr.family}</option>
                      <option value="corporate">{tr.corporate}</option>
                    </select>
                    <span className="request-quote__help-text">{tr.coverageTypeHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="dob" required requiredMark={formCopy.requiredMark}>
                      {tr.dob}
                    </FormFieldLabel>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      min={dobMin}
                      max={today}
                    />
                    <span className="request-quote__help-text">{tr.dobHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="preExisting" required requiredMark={formCopy.requiredMark}>
                      {tr.preExisting}
                    </FormFieldLabel>
                    <select id="preExisting" name="preExisting" required defaultValue="">
                      <option value="" disabled>{tr.selectPlaceholder}</option>
                      <option value="no">{tr.no}</option>
                      <option value="yes">{tr.yes}</option>
                    </select>
                    <span className="request-quote__help-text">{tr.preExistingHelp}</span>
                  </div>
                </div>
              )}

              {activeType === "fire" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="propertyType" required requiredMark={formCopy.requiredMark}>
                      {tr.propertyType}
                    </FormFieldLabel>
                    <select id="propertyType" name="propertyType" required defaultValue="">
                      <option value="" disabled>{tr.selectPlaceholder}</option>
                      <option value="residential">{tr.residential}</option>
                      <option value="commercial">{tr.commercial}</option>
                      <option value="industrial">{tr.industrial}</option>
                    </select>
                    <span className="request-quote__help-text">{tr.propertyTypeHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="propertyValue" required requiredMark={formCopy.requiredMark}>
                      {tr.propertyValue}
                    </FormFieldLabel>
                    <input id="propertyValue" name="propertyValue" type="text" required placeholder={tr.propertyValuePlaceholder} />
                    <span className="request-quote__help-text">{tr.propertyValueHelp}</span>
                  </div>
                  <div className="request-quote__field request-quote__field--full">
                    <FormFieldLabel htmlFor="propertyLocation" required requiredMark={formCopy.requiredMark}>
                      {tr.propertyLocation}
                    </FormFieldLabel>
                    <input id="propertyLocation" name="propertyLocation" type="text" required placeholder={tr.propertyLocationPlaceholder} />
                    <span className="request-quote__help-text">{tr.propertyLocationHelp}</span>
                  </div>
                </div>
              )}

              {activeType === "engineering" && (
                <div className="request-quote__fields">
                  <div className="request-quote__field request-quote__field--full">
                    <FormFieldLabel htmlFor="projectType" required requiredMark={formCopy.requiredMark}>
                      {tr.projectType}
                    </FormFieldLabel>
                    <select id="projectType" name="projectType" required defaultValue="">
                      <option value="" disabled>{tr.selectPlaceholder}</option>
                      <option value="construction">{tr.construction}</option>
                      <option value="erection">{tr.erection}</option>
                      <option value="machinery">{tr.machinery}</option>
                      <option value="electronic">{tr.electronic}</option>
                    </select>
                    <span className="request-quote__help-text">{tr.projectTypeHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="projectDuration" required requiredMark={formCopy.requiredMark}>
                      {tr.duration}
                    </FormFieldLabel>
                    <input id="projectDuration" name="projectDuration" type="text" required placeholder={tr.durationPlaceholder} />
                    <span className="request-quote__help-text">{tr.durationHelp}</span>
                  </div>
                  <div className="request-quote__field">
                    <FormFieldLabel htmlFor="contractValue" required requiredMark={formCopy.requiredMark}>
                      {tr.contractValue}
                    </FormFieldLabel>
                    <input id="contractValue" name="contractValue" type="text" required placeholder={tr.contractValuePlaceholder} />
                    <span className="request-quote__help-text">{tr.contractValueHelp}</span>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="request-quote__fieldset">
              <legend className="request-quote__legend">{formCopy.detailsLegend}</legend>
              <div className="request-quote__fields">
                <div className="request-quote__field request-quote__field--full">
                  <FormFieldLabel htmlFor="fullName" required requiredMark={formCopy.requiredMark}>
                    {tr.fullName}
                  </FormFieldLabel>
                  <input id="fullName" name="fullName" type="text" required autoComplete="name" minLength={2} />
                  <span className="request-quote__help-text">{tr.fullNameHelp}</span>
                </div>
                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="email" required requiredMark={formCopy.requiredMark}>
                    {tr.email}
                  </FormFieldLabel>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                  <span className="request-quote__help-text">{tr.emailHelp}</span>
                </div>
                <div className="request-quote__field">
                  <FormFieldLabel htmlFor="phone" required requiredMark={formCopy.requiredMark}>
                    {tr.phone}
                  </FormFieldLabel>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+964 770 000 0000"
                  />
                  <span className="request-quote__help-text">{tr.phoneHelp}</span>
                </div>
                <div className="request-quote__field request-quote__field--full">
                  <FormFieldLabel htmlFor="city" required requiredMark={formCopy.requiredMark}>
                    {tr.preferredBranch}
                  </FormFieldLabel>
                  <select id="city" name="city" required defaultValue="">
                    <option value="" disabled>{tr.selectPlaceholder}</option>
                    <option value="Baghdad">{locale === "ar" ? "بغداد — المقر الرئيسي" : "Baghdad — Headquarters"}</option>
                    <option value="Basrah">{locale === "ar" ? "البصرة" : "Basrah"}</option>
                    <option value="Erbil">{locale === "ar" ? "أربيل" : "Erbil"}</option>
                  </select>
                  <span className="request-quote__help-text">{tr.preferredBranchHelp}</span>
                </div>
                <div className="request-quote__field request-quote__field--full">
                  <label htmlFor="message">{tr.additionalNotes}</label>
                  <textarea id="message" name="message" rows={3} placeholder={formCopy.notesPlaceholder} />
                  <span className="request-quote__help-text">{tr.additionalNotesHelp}</span>
                </div>
              </div>
            </fieldset>

            <div className="request-quote__footer">
              <button type="submit" className="btn" disabled={status === "loading"}>
                {status === "loading" ? formCopy.submitting : formCopy.submit}
                <svg className="btn-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={locale === "ar" ? { transform: "rotate(180deg)", marginRight: "0.5rem" } : undefined}>
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </button>

              {status === "success" && (
                <p className="request-quote__feedback request-quote__feedback--success" role="status">
                  {formCopy.success}
                </p>
              )}
              {fieldError && (
                <p className="request-quote__feedback request-quote__feedback--error" role="alert">
                  {fieldError}
                </p>
              )}
              {status === "error" && !fieldError && (
                <p className="request-quote__feedback request-quote__feedback--error" role="alert">
                  {formCopy.errorPrefix}{" "}
                  <a href={contactInfo.phoneHref} dir="ltr">{contactInfo.phone}</a>.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
