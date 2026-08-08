import type { Payload } from "payload";

export const DEFAULT_NEWS_CATEGORIES = [
  { slug: "company", nameEn: "Company News", nameAr: "أخبار الشركة", order: 10 },
  { slug: "motor", nameEn: "Motor Insurance", nameAr: "تأمين السيارات", order: 20 },
  { slug: "health", nameEn: "Health Insurance", nameAr: "التأمين الصحي", order: 30 },
  { slug: "travel", nameEn: "Travel Insurance", nameAr: "تأمين السفر", order: 40 },
  { slug: "fire", nameEn: "Fire Insurance", nameAr: "تأمين الحريق", order: 50 },
  { slug: "general", nameEn: "General", nameAr: "عام", order: 60 },
] as const;

/** Ensure default blog categories exist. Returns a map of slug → category id. */
export async function ensureDefaultNewsCategories(
  payload: Payload,
): Promise<Map<string, string | number>> {
  const bySlug = new Map<string, string | number>();

  for (const category of DEFAULT_NEWS_CATEGORIES) {
    const existing = await payload.find({
      collection: "news-categories",
      where: { slug: { equals: category.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs[0]) {
      bySlug.set(category.slug, existing.docs[0].id);
      continue;
    }

    const created = await payload.create({
      collection: "news-categories",
      overrideAccess: true,
      data: {
        nameEn: category.nameEn,
        nameAr: category.nameAr,
        slug: category.slug,
        order: category.order,
      },
    });
    bySlug.set(category.slug, created.id);
  }

  return bySlug;
}

/**
 * Remap news posts that still store a legacy category slug string
 * (from the old select field) to the new relationship id.
 */
export async function remapLegacyNewsCategories(
  payload: Payload,
  bySlug: Map<string, string | number>,
): Promise<number> {
  const { docs } = await payload.find({
    collection: "news",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  let updated = 0;

  for (const doc of docs) {
    const raw = (doc as { category?: unknown }).category;

    if (raw == null) continue;

    // Already a relationship id (number/string id that is not a known slug).
    if (typeof raw === "number") continue;
    if (typeof raw === "object") continue;

    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) continue;

      // Numeric string id — already migrated.
      if (/^\d+$/.test(trimmed) && !bySlug.has(trimmed)) continue;

      const categoryId = bySlug.get(trimmed);
      if (!categoryId) continue;

      await payload.update({
        collection: "news",
        id: doc.id,
        overrideAccess: true,
        data: { category: categoryId },
      });
      updated += 1;
    }
  }

  return updated;
}
