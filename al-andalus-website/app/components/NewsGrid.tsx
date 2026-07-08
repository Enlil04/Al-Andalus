"use client";

import Link from "next/link";
import React from "react";
import "./NewsGrid.css";

export type NewsGridItem = {
  id: string | number;
  title: string;
  slug: string;
  publishedDate?: string | null;
  category?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
};

type NewsGridProps = {
  items: NewsGridItem[];
  itemBasePath?: string;
};

function formatNewsDate(date?: string | null) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  company: "Company",
  motor: "Motor",
  health: "Health",
  travel: "Travel",
  fire: "Fire",
  general: "General",
};

export default function NewsGrid({
  items,
  itemBasePath = "/blogs",
}: NewsGridProps) {
  if (items.length === 0) {
    return <p className="news-grid__empty">No recent news articles.</p>;
  }

  return (
    <div className="news-grid__container">
      <div className="news-grid__layout">
        {items.map((item) => {
          const categoryName = item.category ? (CATEGORY_LABELS[item.category] ?? item.category) : "General";
          const formattedDate = formatNewsDate(item.publishedDate);

          return (
            <article key={item.id} className="news-grid__card">
              <Link href={`${itemBasePath}/${item.slug}`} className="news-grid__card-link">
                <div 
                  className="news-grid__thumbnail"
                  style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
                  role="img"
                  aria-label={item.title}
                />
                
                <div className="news-grid__content">
                  <div className="news-grid__meta">
                    <span className="news-grid__category">{categoryName}</span>
                    <span className="news-grid__date">{formattedDate}</span>
                  </div>
                  
                  <h3 className="news-grid__title">{item.title}</h3>
                  
                  {item.excerpt && (
                    <p className="news-grid__excerpt">{item.excerpt}</p>
                  )}
                  
                  <div className="news-grid__footer">
                    <span className="news-grid__action">
                      Read Article
                      <svg className="news-grid__arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 7h12M8 2l5 5-5 5" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
