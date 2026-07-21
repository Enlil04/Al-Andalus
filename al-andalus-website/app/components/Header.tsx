"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { SCROLL_EVENT, type ScrollEventDetail } from "@/lib/scrollEvents";

import { useLocale } from "@/app/components/LocaleProvider";

const SCROLL_THRESHOLD = 80;
const MOBILE_MENU_MAX_WIDTH = 768;

function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <span className="header__mobile-icon" aria-hidden="true">
      {children}
    </span>
  );
}

const NAV_ICONS: Record<string, ReactNode> = {
  "/about": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10.5v5" />
        <circle cx="12" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    </MenuIcon>
  ),
  "/services": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 7v6c0 4.2 3.4 7.6 8 8 4.6-.4 8-3.8 8-8V7l-8-4Z" />
        <path d="m9.5 12 2 2 4-4" />
      </svg>
    </MenuIcon>
  ),
};

const OTHER_ICONS: Record<string, ReactNode> = {
  "/application": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.5h2" />
      </svg>
    </MenuIcon>
  ),
  "/partners": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3.5 3.5 0 0 1 0 6.74" />
      </svg>
    </MenuIcon>
  ),
  "/jobs": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="7" width="19" height="13" rx="2" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
        <path d="M2.5 12h19" />
      </svg>
    </MenuIcon>
  ),
  "/blogs": (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v12.5H7A2 2 0 0 1 5 17.5v-13Z" />
        <path d="M9 9h6M9 13h6M9 17h3.5" />
      </svg>
    </MenuIcon>
  ),
};

const QUOTE_ICONS: Record<string, ReactNode> = {
  travel: (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.5 11.1 14.2 8.4V4.8a1.3 1.3 0 0 0-2.6 0v3.6L4.3 11.1a.9.9 0 0 0 .4 1.7l6.9-.8v3.6l-1.8 1.3v1.5l3.1-.8 3.1.8v-1.5l-1.8-1.3v-3.6l6.9.8a.9.9 0 0 0 .4-1.7Z" />
      </svg>
    </MenuIcon>
  ),
  motor: (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15.5v2a1.5 1.5 0 0 0 1.5 1.5H7a1.5 1.5 0 0 0 1.5-1.5v-.5h7v.5A1.5 1.5 0 0 0 17 19h1.5A1.5 1.5 0 0 0 20 17.5v-2" />
        <path d="M4 15.5 5.5 9.8A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.3L20 15.5" />
        <circle cx="7.5" cy="15.5" r="1.2" />
        <circle cx="16.5" cy="15.5" r="1.2" />
        <path d="M4.8 12.5h14.4" />
      </svg>
    </MenuIcon>
  ),
  health: (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20.4S3.5 14.8 3.5 9.4A4.4 4.4 0 0 1 12 7.1a4.4 4.4 0 0 1 8.5 2.3c0 5.4-8.5 11-8.5 11Z" />
      </svg>
    </MenuIcon>
  ),
  fire: (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5c.4 2.2-.2 3.8-1.4 5.2-1.4 1.6-2.2 3-2.2 4.8a5.6 5.6 0 0 0 3.2 5c-.9-.9-1.4-2-1.4-3.3 0-1.5.8-2.7 1.8-3.9.3 2.2 1.6 3.4 1.6 5.5A5.4 5.4 0 0 0 18 14.2C18 8.8 13.8 6.4 12 2.5Z" />
      </svg>
    </MenuIcon>
  ),
  engineering: (
    <MenuIcon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 6.5 17 4l3 3-2.5 2.5" />
        <path d="m13 8 3 3" />
        <path d="M5 19 14.5 9.5" />
        <path d="M4 14.5 9.5 20" />
        <path d="M3.5 20.5 8 16" />
      </svg>
    </MenuIcon>
  ),
};

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

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_MENU_MAX_WIDTH}px)`,
    );

    const closeMenuOnDesktop = () => {
      if (!mediaQuery.matches) {
        setMenuOpen(false);
      }
    };

    closeMenuOnDesktop();
    mediaQuery.addEventListener("change", closeMenuOnDesktop);

    return () => {
      mediaQuery.removeEventListener("change", closeMenuOnDesktop);
    };
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

      <Link
        href="/"
        className="header__logo"
        aria-label={
          locale === "ar"
            ? "شركة الأندلس للتأمين الدولي"
            : "Al Andalus International Insurance"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl || "/1.png"} alt="" className="header__logo-img" />
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
          aria-label={locale === "ar" ? "فتح القائمة" : "Toggle menu"}
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
                className="header__mobile-link header__mobile-link--icon"
                onClick={() => setMenuOpen(false)}
              >
                {NAV_ICONS[link.href]}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="header__mobile-dropdown-title">{otherLabel}</div>
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__mobile-link header__mobile-link--sub header__mobile-link--icon"
                onClick={() => setMenuOpen(false)}
              >
                {OTHER_ICONS[link.href]}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="header__mobile-dropdown-title">{quotesMenuLabel}</div>
            {insuranceTypes.map((type) => (
              <Link
                key={type.id}
                href={`/request-quote?type=${type.id}`}
                className="header__mobile-link header__mobile-link--sub header__mobile-link--icon"
                onClick={() => setMenuOpen(false)}
              >
                {QUOTE_ICONS[type.id]}
                <span>{type.label}</span>
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

