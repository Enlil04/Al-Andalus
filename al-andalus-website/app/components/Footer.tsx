"use client";

import Link from "next/link";
import { getSiteCopy } from "@/lib/copy";
import { useLocale } from "./LocaleProvider";
import AnimatedHeadline from "./AnimatedHeadline";
import type { SiteSettingsContent } from "@/lib/cms/content";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="footer-new__social-svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-new__social-svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="footer-new__social-svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="footer-new__social-svg"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const socialIcons = {
  Facebook: FacebookIcon,
  فيسبوك: FacebookIcon,
  Instagram: InstagramIcon,
  إنستغرام: InstagramIcon,
  LinkedIn: LinkedinIcon,
  "لينكد إن": LinkedinIcon,
  TikTok: TiktokIcon,
  "تيك توك": TiktokIcon,
} as const;

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const isExternal =
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    );
  }

  return <Link href={href}>{label}</Link>;
}

type FooterProps = {
  socialLinks?: SiteSettingsContent["socialLinks"];
};

export default function Footer({ socialLinks }: FooterProps) {
  const { locale } = useLocale();
  const siteCopy = getSiteCopy(locale);
  const { footer } = siteCopy;
  const { links } = footer;
  const social = socialLinks ?? footer.social;

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const privacyLabel = locale === "ar" ? "سياسة الخصوصية" : "PRIVACY POLICY";

  return (
    <footer className="footer-new">
      <div className="footer-new__top-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer-logo.png"
          alt="Al Andalus International Insurance"
          className="footer-new__logo-img"
        />
        <AnimatedHeadline title={footer.title} className="footer-new__title" />
        <p className="footer-new__desc">{footer.description}</p>

        <div className="footer-new__social">
          {social.map((item) => {
            const Icon = socialIcons[item.label as keyof typeof socialIcons] || FacebookIcon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>

      <div className="footer-new__links-grid">
        <div className="footer-new__links-col">
          {links.services.map((link) => (
            <FooterLink key={link.label} href={link.href} label={link.label} />
          ))}
        </div>
        <div className="footer-new__links-col">
          {links.information.map((link) => (
            <FooterLink key={link.label} href={link.href} label={link.label} />
          ))}
        </div>
        <div className="footer-new__links-col">
          {links.contact.map((link) => (
            <FooterLink key={link.label} href={link.href} label={link.label} />
          ))}
        </div>
      </div>

      <div className="footer-new__bottom">
        <div className="footer-new__bottom-left">
          ©{new Date().getFullYear()} {footer.copyright}
        </div>
        <div className="footer-new__bottom-right">
          <Link href="/privacy">{privacyLabel}</Link>
          <span style={{ margin: "0 10px" }}>|</span>
          <button
            type="button"
            className="footer-new__lang"
            onClick={toggleLanguage}
          >
            {locale === "en" ? "العربية" : "EN"}
          </button>
        </div>
      </div>
    </footer>
  );
}
