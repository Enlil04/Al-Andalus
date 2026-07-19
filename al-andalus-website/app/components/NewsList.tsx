"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import BlogCard from "@/app/components/ui/blog-cards";
import { formatNewsDate } from "@/lib/cms/format";
import type { NewsListItem } from "@/lib/cms/content";

export type { NewsListItem };

type NewsListProps = {
  items: NewsListItem[];
  itemBasePath?: string;
};

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
    return <p className="news__empty">No recent news articles.</p>;
  }

  return (
    <>
      <div
        ref={listRef}
        className="news__list"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item) => (
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
        ))}
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
