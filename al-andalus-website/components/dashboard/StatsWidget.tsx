import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React from "react";

import "./widgets.scss";

type StatCard = {
  href: string;
  label: string;
  value: number;
  alert?: boolean;
};

export default async function StatsWidget({ req }: WidgetServerProps) {
  const { payload } = req;
  const { admin: adminRoute } = payload.config.routes;

  const siteSettings = await payload.findGlobal({ slug: "site-settings" });
  const visitors =
    siteSettings?.analytics?.monthlyVisitors ??
    siteSettings?.analytics?.totalVisitors ??
    0;

  const [
    insuranceRequests,
    newRequests,
    services,
    publishedBlog,
    blogTotal,
    partners,
    jobApplications,
    openJobs,
  ] = await Promise.all([
    payload.count({ collection: "insurance-requests" }),
    payload.count({
      collection: "insurance-requests",
      where: { status: { equals: "new" } },
    }),
    payload.count({ collection: "products" }),
    payload.count({
      collection: "news",
      where: { status: { equals: "published" } },
    }),
    payload.count({ collection: "news" }),
    payload.count({ collection: "partners" }),
    payload.count({
      collection: "job-applications",
      where: { status: { equals: "new" } },
    }),
    payload.count({
      collection: "jobs",
      where: { status: { equals: "open" } },
    }),
  ]);

  const stats: StatCard[] = [
    {
      label: "Total Insurance Requests",
      value: insuranceRequests.totalDocs,
      href: formatAdminURL({
        adminRoute,
        path: "/collections/insurance-requests",
      }),
      alert: newRequests.totalDocs > 0,
    },
    {
      label: "New Requests",
      value: newRequests.totalDocs,
      href: formatAdminURL({
        adminRoute,
        path: "/collections/insurance-requests",
      }),
      alert: newRequests.totalDocs > 0,
    },
    {
      label: "Website Visitors",
      value: Number(visitors) || 0,
      href: formatAdminURL({
        adminRoute,
        path: "/globals/site-settings",
      }),
    },
    {
      label: "Insurance Services",
      value: services.totalDocs,
      href: formatAdminURL({ adminRoute, path: "/collections/products" }),
    },
    {
      label: "Blog Posts",
      value: publishedBlog.totalDocs,
      href: formatAdminURL({ adminRoute, path: "/collections/news" }),
    },
    {
      label: "Draft Articles",
      value: blogTotal.totalDocs - publishedBlog.totalDocs,
      href: formatAdminURL({ adminRoute, path: "/collections/news" }),
    },
    {
      label: "Partners",
      value: partners.totalDocs,
      href: formatAdminURL({ adminRoute, path: "/collections/partners" }),
    },
    {
      label: "Job Applications",
      value: jobApplications.totalDocs,
      href: formatAdminURL({
        adminRoute,
        path: "/collections/job-applications",
      }),
      alert: jobApplications.totalDocs > 0,
    },
    {
      label: "Open Positions",
      value: openJobs.totalDocs,
      href: formatAdminURL({ adminRoute, path: "/collections/jobs" }),
    },
  ];

  return (
    <div className="dashboard-widget stats-widget">
      <div className="dashboard-widget__header">
        <h3 className="dashboard-widget__title">Quick Statistics</h3>
        <p className="dashboard-widget__subtitle">
          System overview — requests, content, visitors, and careers
        </p>
      </div>

      <div className="stats-widget__grid">
        {stats.map((stat) => (
          <a
            key={stat.label}
            className={`stats-widget__card${stat.alert ? " stats-widget__card--alert" : ""}`}
            href={stat.href}
          >
            <span className="stats-widget__value">{stat.value}</span>
            <span className="stats-widget__label">{stat.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
