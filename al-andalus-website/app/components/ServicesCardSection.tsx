"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import {
  getServiceCategories,
  getServicesByCategory,
  getServices,
  type ServiceCategoryId,
  type Service,
} from "@/lib/services";
import { useLocale } from "./LocaleProvider";

interface Props {
  id?: string;
  services?: Service[];
}

function filterServicesByCategory(
  services: Service[],
  category: ServiceCategoryId,
) {
  return services.filter((service) => service.category === category);
}

function ServiceCard({ service, locale }: { service: Service; locale: string }) {
  const hint = service.subtitle ?? (locale === "ar" ? `تغطية لـ ${service.title.replace("تأمين ", "")}` : `Coverage for ${service.title.replace(" Insurance", "")}.`);

  return (
    <article className="services-card-section__card" id={service.slug}>
      <div className="services-card-section__card-header">
        <div className="services-card-section__card-heading">
          <h3 className="services-card-section__title">{service.title}</h3>
          <p className="services-card-section__hint">{hint}</p>
        </div>
      </div>

      <div className="services-card-section__card-body">
        <p className="services-card-section__desc">{service.description}</p>
      </div>

      <div className="services-card-section__card-footer">
        {service.underDevelopment ? (
          <span className="services-card-section__badge">
            {locale === "ar" ? "قيد التطوير" : "Under development"}
          </span>
        ) : (
          <Link
            href={`/services/${service.slug}`}
            className="services-card-section__action"
            aria-label={
              locale === "ar" ? `عرض ${service.title}` : `View ${service.title}`
            }
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              style={locale === "ar" ? { transform: "rotate(180deg)" } : undefined}
            >
              <path d="M3 11L11 3M11 3H5M11 3V9" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ServicesCardSection({
  id = "services-card-section",
  services,
}: Props) {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryId>("personal");
  const allServices = services ?? getServices(locale);
  const filteredServices = filterServicesByCategory(allServices, activeCategory);
  const serviceCategories = getServiceCategories(locale);

  // Footer / deep links like /services#fire need the matching tab open first
  // so the target card is actually in the DOM.
  useEffect(() => {
    const openHashTarget = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const catalog = services ?? getServices(locale);
      const match = catalog.find((service) => service.slug === hash);
      if (!match) return;
      setActiveCategory(match.category);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    openHashTarget();
    window.addEventListener("hashchange", openHashTarget);
    return () => window.removeEventListener("hashchange", openHashTarget);
  }, [services, locale]);

  return (
    <section className="services-card-section" id={id}>
      <div className="services-card-section__container">
        <nav
          className="services-card-section__tabs"
          aria-label={locale === "ar" ? "فئات الخدمات" : "Service categories"}
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`services-card-section__tab${
                activeCategory === category.id ? " services-card-section__tab--active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
              aria-current={activeCategory === category.id ? "true" : undefined}
            >
              {category.label}
            </button>
          ))}
        </nav>

        <div className="services-card-section__grid" key={activeCategory}>
          {filteredServices.map((service, index) => (
            <ScrollReveal
              key={service.slug}
              delay={index % 3}
              className="services-card-section__grid-item"
            >
              <ServiceCard service={service} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
