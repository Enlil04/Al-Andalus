/** Format a CMS date as YYYY.MM.DD for news cards and detail pages. */
export function formatNewsDate(date?: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

const CATEGORY_LABELS_EN: Record<string, string> = {
  company: "Company",
  motor: "Motor",
  health: "Health",
  travel: "Travel",
  fire: "Fire",
  general: "General",
};

const CATEGORY_LABELS_AR: Record<string, string> = {
  company: "الشركة",
  motor: "السيارات",
  health: "الصحة",
  travel: "السفر",
  fire: "الحريق",
  general: "عام",
};

type NewsCategoryValue =
  | string
  | number
  | null
  | undefined
  | {
      slug?: string | null;
      nameEn?: string | null;
      nameAr?: string | null;
    };

/** Resolve a display label from a related category doc, legacy slug, or fallback. */
export function getNewsCategoryLabel(
  category: NewsCategoryValue,
  locale: "en" | "ar" = "en",
): string {
  if (category && typeof category === "object") {
    const localized =
      locale === "ar"
        ? category.nameAr || category.nameEn
        : category.nameEn || category.nameAr;
    if (localized) return String(localized);
    if (category.slug) {
      return getNewsCategoryLabel(category.slug, locale);
    }
  }

  if (typeof category === "string" && category.trim()) {
    const map = locale === "ar" ? CATEGORY_LABELS_AR : CATEGORY_LABELS_EN;
    return map[category] ?? category;
  }

  return locale === "ar" ? "عام" : "General";
}

/** Shared slugify used for job titles (CMS fallbacks and detail routes). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
