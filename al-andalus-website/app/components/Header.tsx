"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SCROLL_EVENT, type ScrollEventDetail } from "@/lib/pageReady";

const SCROLL_THRESHOLD = 80;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Partners", href: "/partners" },
    { label: "Jobs", href: "/jobs" },
    { label: "Blogs", href: "/blogs" },
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
            Quote <span className="header__dropdown-arrow">▼</span>
          </Link>
          <div className="header__dropdown-menu">
            <Link href="/request-quote?type=travel" className="header__dropdown-item">Travel Insurance</Link>
            <Link href="/request-quote?type=motor" className="header__dropdown-item">Motor Insurance</Link>
            <Link href="/request-quote?type=health" className="header__dropdown-item">Health Insurance</Link>
            <Link href="/request-quote?type=fire" className="header__dropdown-item">Fire Insurance</Link>
            <Link href="/request-quote?type=engineering" className="header__dropdown-item">Engineering Insurance</Link>
          </div>
        </div>
      </nav>

      <Link href="/" className="header__logo" aria-label="Al Andalus International Insurance">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/1.png"
          alt="Al-Andalus International Insurance"
          className="header__logo-img"
        />
      </Link>

      <div className="header__right">
        <button className="header__pill header__pill--lang" type="button">
          EN
        </button>

        <Link href="/contact" className="header__pill header__pill--contact">
          Contact Us
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
            <div className="header__mobile-dropdown-title">Quotes</div>
            <Link
              href="/request-quote?type=travel"
              className="header__mobile-link header__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              Travel Insurance
            </Link>
            <Link
              href="/request-quote?type=motor"
              className="header__mobile-link header__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              Motor Insurance
            </Link>
            <Link
              href="/request-quote?type=health"
              className="header__mobile-link header__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              Health Insurance
            </Link>
            <Link
              href="/request-quote?type=fire"
              className="header__mobile-link header__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              Fire Insurance
            </Link>
            <Link
              href="/request-quote?type=engineering"
              className="header__mobile-link header__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              Engineering Insurance
            </Link>

            <Link
              href="/contact"
              className="btn btn--primary header__mobile-contact-btn"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

