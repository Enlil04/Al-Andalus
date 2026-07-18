"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SCROLL_EVENT, type ScrollEventDetail } from "@/lib/pageReady";

import { useLocale } from "@/app/components/LocaleProvider";

const SCROLL_THRESHOLD = 80;

export default function Header({ logoUrl }: { logoUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useLocale();

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const { scroll, direction } = (event as CustomEvent<ScrollEventDetail>).detail;
      const isScrolled = scroll > SCROLL_THRESHOLD;

      setScrolled(isScrolled);

      if (scroll <= SCROLL_THRESHOLD) {
        setHidden(false);
      } else if (direction === 1) {
        setHidden(true);
      } else if (direction === -1) {
        setHidden(false);
      }
    };

    window.addEventListener(SCROLL_EVENT, handleScroll);
    return () => window.removeEventListener(SCROLL_EVENT, handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const navLinks = locale === "ar" ? [
    { label: "من نحن", href: "/about" },
    { label: "الخدمات", href: "/services" },
  ] : [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
  ];

  const otherLinks = locale === "ar" ? [
    { label: "التطبيق", href: "/application" },
    { label: "الشركاء", href: "/partners" },
    { label: "الوظائف", href: "/jobs" },
    { label: "المدونة", href: "/blogs" },
  ] : [
    { label: "Application", href: "/application" },
    { label: "Partners", href: "/partners" },
    { label: "Jobs", href: "/jobs" },
    { label: "Blogs", href: "/blogs" },
  ];

  const quotesLabel = locale === "ar" ? "تسعيرة" : "Quote";
  const quotesMenuLabel = locale === "ar" ? "طلبات التسعير" : "Quotes";
  const otherLabel = locale === "ar" ? "المزيد" : "Other";
  const contactUsLabel = locale === "ar" ? "اتصل بنا" : "Contact Us";

  const insuranceTypes = locale === "ar" ? [
    { id: "travel", label: "تأمين السفر" },
    { id: "motor", label: "تأمين السيارات" },
    { id: "health", label: "التأمين الصحي" },
    { id: "fire", label: "تأمين الحريق" },
    { id: "engineering", label: "التأمين الهندسي" },
  ] : [
    { id: "travel", label: "Travel Insurance" },
    { id: "motor", label: "Motor Insurance" },
    { id: "health", label: "Health Insurance" },
    { id: "fire", label: "Fire Insurance" },
    { id: "engineering", label: "Engineering Insurance" },
  ];

  return (
    <header
      className={`header header--light${scrolled ? " header--scrolled" : ""}${hidden ? " header--hidden" : ""}`}
    >
      <nav className="header__nav">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="header__nav-link">
            {link.label}
          </Link>
        ))}

        <div className="header__dropdown">
          <Link href="/request-quote" className="header__nav-link header__dropdown-trigger">
            {quotesLabel} <span className="header__dropdown-arrow">▼</span>
          </Link>
          <div className="header__dropdown-menu">
            {insuranceTypes.map((type) => (
              <Link
                key={type.id}
                href={`/request-quote?type=${type.id}`}
                className="header__dropdown-item"
              >
                {type.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="header__dropdown">
          <span className="header__nav-link header__dropdown-trigger">
            {otherLabel} <span className="header__dropdown-arrow">▼</span>
          </span>
          <div className="header__dropdown-menu">
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__dropdown-item"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <Link href="/" className="header__logo" aria-label="Al Andalus International Insurance">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl || "/1.png"}
          alt="Al-Andalus International Insurance"
          className="header__logo-img"
        />
        <span className="header__logo-text">
          {locale === "ar" ? "الرئيسية" : "Homepage"}
        </span>
      </Link>

      <div className="header__right">
        <button
          className="header__pill header__pill--lang"
          type="button"
          onClick={toggleLanguage}
        >
          {locale === "en" ? "العربية" : "EN"}
        </button>

        <Link href="/contact" className="header__pill header__pill--contact">
          {contactUsLabel}
        </Link>

        <button
          className="header__menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="header__mobile-dropdown-title">{otherLabel}</div>
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__mobile-link header__mobile-link--sub"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="header__mobile-dropdown-title">{quotesMenuLabel}</div>
            {insuranceTypes.map((type) => (
              <Link
                key={type.id}
                href={`/request-quote?type=${type.id}`}
                className="header__mobile-link header__mobile-link--sub"
                onClick={() => setMenuOpen(false)}
              >
                {type.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="btn btn--primary header__mobile-contact-btn"
              onClick={() => setMenuOpen(false)}
            >
              {contactUsLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

