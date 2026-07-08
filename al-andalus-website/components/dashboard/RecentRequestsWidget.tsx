import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React from "react";

import "./widgets.scss";

export default async function RecentRequestsWidget({ req }: WidgetServerProps) {
  const { payload } = req;
  const { admin: adminRoute } = payload.config.routes;

  const { docs } = await payload.find({
    collection: "insurance-requests",
    limit: 5,
    sort: "-createdAt",
    depth: 1,
  });

  const listHref = formatAdminURL({
    adminRoute,
    path: "/collections/insurance-requests",
  });

  return (
    <div className="dashboard-widget recent-messages">
      <div className="dashboard-widget__header">
        <h3 className="dashboard-widget__title">Recent Insurance Requests</h3>
        <p className="dashboard-widget__subtitle">
          Latest requests submitted through the website
        </p>
      </div>

      {docs.length === 0 ? (
        <p className="recent-messages__empty">No insurance requests yet.</p>
      ) : (
        <ul className="recent-messages__list">
          {docs.map((request) => {
            const href = formatAdminURL({
              adminRoute,
              path: `/collections/insurance-requests/${request.id}`,
            });

            const service =
              typeof request.insuranceService === "object" &&
              request.insuranceService
                ? (request.insuranceService as { title?: string }).title
                : null;

            const createdAt = request.createdAt
              ? new Date(request.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <li key={request.id} className="recent-messages__item">
                <a className="recent-messages__link" href={href}>
                  <p className="recent-messages__subject">
                    {request.referenceNumber} — {request.fullName}
                  </p>
                  <p className="recent-messages__meta">
                    {service ? `${service} · ` : ""}
                    {request.status}
                    {createdAt ? ` · ${createdAt}` : ""}
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <div className="recent-messages__footer">
        <a className="recent-messages__view-all" href={listHref}>
          View all requests →
        </a>
      </div>
    </div>
  );
}
