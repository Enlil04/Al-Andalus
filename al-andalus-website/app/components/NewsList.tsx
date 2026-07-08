"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import BlogCard from "@/app/components/ui/blog-cards";

const CATEGORY_LABELS: Record<string, string> = {
  company: "Company",
  motor: "Motor",
  health: "Health",
  travel: "Travel",
  fire: "Fire",
  general: "General",
};

export type NewsListItem = {
  id: string | number;
  title: string;
  slug: string;
  publishedDate?: string | null;
  category?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
};

type NewsListProps = {
  items: NewsListItem[];
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

export default function NewsList({
  items,
  itemBasePath = "/blogs",
}: NewsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setCursor({ x: e.clientX, y: e.clientY, visible: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursor((prev) => ({ ...prev, visible: false }));
  }, []);

  if (items.length === 0) {
    return (
      <p className="news__empty">No recent news articles.</p>
    );
  }

  return (
    <>
      <div
        ref={listRef}
        className="news__list"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              href={`${itemBasePath}/${item.slug}`}
              className="block"
            >
              <BlogCard
                title={item.title}
                date={formatNewsDate(item.publishedDate)}
                description={item.excerpt || ""}
                imageUrl={item.imageUrl}
              />
            </Link>
          );
        })}
      </div>

      <div
        className={`news-cursor${cursor.visible ? " news-cursor--visible" : ""}`}
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
        aria-hidden="true"
      />
    </>
  );
}
