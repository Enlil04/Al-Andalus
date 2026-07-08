import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React from "react";

import "./widgets.scss";

type UserWithRole = {
  name?: string;
  role?: "admin" | "editor";
};

export default async function WelcomeWidget({ req }: WidgetServerProps) {
  const { payload, user } = req;
  const { admin: adminRoute } = payload.config.routes;
  const typedUser = user as UserWithRole | null;
  const displayName = typedUser?.name || typedUser?.role || "there";

  const links = [
    {
      label: "Insurance Requests",
      href: formatAdminURL({
        adminRoute,
        path: "/collections/insurance-requests",
      }),
      accent: true,
    },
    {
      label: "Homepage",
      href: formatAdminURL({ adminRoute, path: "/globals/homepage" }),
    },
    {
      label: "About Page",
      href: formatAdminURL({ adminRoute, path: "/globals/about-page" }),
    },
    {
      label: "Site Settings",
      href: formatAdminURL({ adminRoute, path: "/globals/site-settings" }),
    },
    {
      label: "Services",
      href: formatAdminURL({ adminRoute, path: "/collections/products" }),
    },
    {
      label: "FAQs",
      href: formatAdminURL({ adminRoute, path: "/collections/faqs" }),
    },
    {
      label: "Blog",
      href: formatAdminURL({ adminRoute, path: "/collections/news" }),
    },
  ];

  return (
    <div className="welcome-widget">
      <div className="welcome-widget__text">
        <p className="welcome-widget__eyebrow">Al-Andalus Insurance Dashboard</p>
        <h2 className="welcome-widget__heading">Welcome back, {displayName}</h2>
        <p className="welcome-widget__description">
          Manage insurance services, customer requests, blog content, partners,
          careers, and all website content from one place.
        </p>
      </div>

      <div className="welcome-widget__actions">
        {links.map((link) => (
          <a
            key={link.label}
            className={`welcome-widget__link${link.accent ? " welcome-widget__link--accent" : ""}`}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
