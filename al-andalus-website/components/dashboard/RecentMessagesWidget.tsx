import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import React from "react";

import "./widgets.scss";

export default async function RecentMessagesWidget({ req }: WidgetServerProps) {
  const { payload } = req;
  const { admin: adminRoute } = payload.config.routes;

  const { docs } = await payload.find({
    collection: "contact-messages",
    limit: 5,
    sort: "-createdAt",
    where: {
      isRead: { equals: false },
    },
  });

  const listHref = formatAdminURL({
    adminRoute,
    path: "/collections/contact-messages",
  });

  return (
    <div className="dashboard-widget recent-messages">
      <div className="dashboard-widget__header">
        <h3 className="dashboard-widget__title">Unread Messages</h3>
        <p className="dashboard-widget__subtitle">
          Latest contact form submissions awaiting review
        </p>
      </div>

      {docs.length === 0 ? (
        <p className="recent-messages__empty">No unread messages. You&apos;re all caught up.</p>
      ) : (
        <ul className="recent-messages__list">
          {docs.map((message) => {
            const href = formatAdminURL({
              adminRoute,
              path: `/collections/contact-messages/${message.id}`,
            });

            const createdAt = message.createdAt
              ? new Date(message.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <li key={message.id} className="recent-messages__item">
                <a className="recent-messages__link" href={href}>
                  <p className="recent-messages__subject">{message.subject}</p>
                  <p className="recent-messages__meta">
                    {message.name} · {message.email}
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
          View all messages →
        </a>
      </div>
    </div>
  );
}
