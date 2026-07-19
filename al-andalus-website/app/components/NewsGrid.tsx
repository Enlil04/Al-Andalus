import Link from "next/link";
import {
  formatNewsDate,
  getNewsCategoryLabel,
} from "@/lib/cms/format";
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
  locale?: "en" | "ar";
};

export default function NewsGrid({
  items,
  itemBasePath = "/blogs",
  locale = "en",
}: NewsGridProps) {
  if (items.length === 0) {
    return <p className="news-grid__empty">No recent news articles.</p>;
  }

  const readLabel = locale === "ar" ? "اقرأ المقال" : "Read Article";

  return (
    <div className="news-grid__container">
      <div className="news-grid__layout">
        {items.map((item) => {
          const categoryName = getNewsCategoryLabel(item.category, locale);
          const formattedDate = formatNewsDate(item.publishedDate);

          return (
            <article key={item.id} className="news-grid__card">
              <Link
                href={`${itemBasePath}/${item.slug}`}
                className="news-grid__card-link"
              >
                <div
                  className="news-grid__thumbnail"
                  style={
                    item.imageUrl
                      ? { backgroundImage: `url(${item.imageUrl})` }
                      : undefined
                  }
                  role="img"
                  aria-label={item.title}
                />

                <div className="news-grid__content">
                  <div className="news-grid__meta">
                    <span className="news-grid__category">{categoryName}</span>
                    <span className="news-grid__date">{formattedDate}</span>
                  </div>

                  <h3 className="news-grid__title">{item.title}</h3>

                  {item.excerpt ? (
                    <p className="news-grid__excerpt">{item.excerpt}</p>
                  ) : null}

                  <div className="news-grid__footer">
                    <span className="news-grid__action">
                      {readLabel}
                      <svg
                        className="news-grid__arrow"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
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
