import type { MetadataRoute } from "next";
import { getCMSPayload } from "@/lib/cms/payload";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/application",
  "/download",
  "/partners",
  "/jobs",
  "/blogs",
  "/contact",
  "/request-quote",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const payload = await getCMSPayload();

    const [products, news] = await Promise.all([
      payload.find({
        collection: "products",
        limit: 100,
        overrideAccess: true,
        where: { status: { equals: "active" } },
      }),
      payload.find({
        collection: "news",
        limit: 200,
        overrideAccess: true,
        where: { status: { equals: "published" } },
      }),
    ]);

    for (const product of products.docs) {
      if (product.slug) {
        entries.push({
          url: `${siteUrl}/services/${product.slug}`,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }

    for (const post of news.docs) {
      if (post.slug) {
        entries.push({
          url: `${siteUrl}/blogs/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // CMS unavailable during build — ship the static routes only.
  }

  return entries;
}
