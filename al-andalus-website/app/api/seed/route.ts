import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProductSeedEntries } from "@/lib/productSeed";

function isSeedAllowed(request: Request): boolean {
  if (process.env.ALLOW_SEED !== "true") return false;

  const secret = process.env.SEED_SECRET;
  if (!secret || secret.length < 16) return false;

  const header = request.headers.get("x-seed-secret");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  return header === secret || querySecret === secret;
}

async function upsertProduct(
  payload: Awaited<ReturnType<typeof getPayload>>,
  productId: number | string,
  product: ReturnType<typeof getProductSeedEntries>[number],
) {
  await payload.update({
    collection: "products",
    id: productId,
    overrideAccess: true,
    data: {
      titleEn: product.titleEn,
      titleAr: product.titleAr,
      shortDescriptionEn: product.shortDescriptionEn,
      shortDescriptionAr: product.shortDescriptionAr,
      category: product.category,
      isFeatured: product.isFeatured,
      status: product.status,
      order: product.order,
    },
  });
}

export async function GET(request: Request) {
  if (!isSeedAllowed(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const products = getProductSeedEntries();

    let created = 0;
    let updated = 0;

    for (const product of products) {
      const existing = await payload.find({
        collection: "products",
        where: { slug: { equals: product.slug } },
        limit: 1,
        overrideAccess: true,
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "products",
          overrideAccess: true,
          data: {
            titleEn: product.titleEn,
            titleAr: product.titleAr,
            slug: product.slug,
            shortDescriptionEn: product.shortDescriptionEn,
            shortDescriptionAr: product.shortDescriptionAr,
            category: product.category,
            isFeatured: product.isFeatured,
            status: product.status,
            order: product.order,
          },
        });
        created++;
      } else {
        await upsertProduct(payload, existing.docs[0].id, product);
        updated++;
      }
    }

    let partnersCount = 0;
    const partnersDir =
      process.env.PARTNERS_LOGOS_DIR ||
      path.join(process.cwd(), "public", "partners-logos");

    if (fs.existsSync(partnersDir)) {
      const files = fs
        .readdirSync(partnersDir)
        .filter(
          (f) =>
            f.endsWith(".png") ||
            f.endsWith(".jpg") ||
            f.endsWith(".jpeg") ||
            f.endsWith(".svg"),
        );

      for (const [index, file] of files.entries()) {
        const existingPartner = await payload.find({
          collection: "partners",
          where: { name: { equals: `Partner ${index + 1}` } },
          overrideAccess: true,
        });

        if (existingPartner.totalDocs === 0) {
          const filePath = path.join(partnersDir, file);
          const mediaDoc = await payload.create({
            collection: "media",
            locale: "en",
            overrideAccess: true,
            data: { alt: `Partner ${index + 1} Logo` },
            filePath,
          });

          await payload.create({
            collection: "partners",
            locale: "en",
            overrideAccess: true,
            data: {
              name: `Partner ${index + 1}`,
              logo: mediaDoc.id,
              order: index + 1,
            },
          });
          partnersCount++;
        }
      }
    }

    let newsCount = 0;
    const dummyNews = [
      {
        titleEn: "Al-Andalus Expands Insurance Network",
        titleAr: "الأندلس توسّع شبكة التأمين",
        excerptEn:
          "This is a placeholder excerpt for the news article to demonstrate the layout.",
        excerptAr: "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
        category: "company",
        publishedDate: new Date().toISOString(),
      },
      {
        titleEn: "New Health Insurance Packages for 2027",
        titleAr: "باقات تأمين صحي جديدة لعام 2027",
        excerptEn:
          "This is a placeholder excerpt for the news article to demonstrate the layout.",
        excerptAr: "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
        category: "health",
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        titleEn: "Awarded Best Insurtech of the Year",
        titleAr: "جائزة أفضل شركة تكنولوجيا تأمين للعام",
        excerptEn:
          "This is a placeholder excerpt for the news article to demonstrate the layout.",
        excerptAr: "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
        category: "company",
        publishedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        titleEn: "Important Update on Motor Policies",
        titleAr: "تحديث مهم حول وثائق تأمين السيارات",
        excerptEn:
          "This is a placeholder excerpt for the news article to demonstrate the layout.",
        excerptAr: "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
        category: "motor",
        publishedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        titleEn: "Navigating Travel Insurance in 2026",
        titleAr: "دليلك لتأمين السفر في 2026",
        excerptEn:
          "This is a placeholder excerpt for the news article to demonstrate the layout.",
        excerptAr: "هذا مقتطف تجريبي للمقال لإظهار تخطيط الصفحة.",
        category: "travel",
        publishedDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
    ];

    for (const news of dummyNews) {
      const slug = news.titleEn.toLowerCase().replace(/ /g, "-");
      const existing = await payload.find({
        collection: "news",
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: true,
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "news",
          overrideAccess: true,
          data: {
            titleEn: news.titleEn,
            titleAr: news.titleAr,
            slug,
            category: news.category as
              | "company"
              | "health"
              | "motor"
              | "travel",
            publishedDate: news.publishedDate,
            status: "published",
            excerptEn: news.excerptEn,
            excerptAr: news.excerptAr,
          },
        });
        newsCount++;
      } else {
        await payload.update({
          collection: "news",
          id: existing.docs[0].id,
          locale: "en",
          overrideAccess: true,
          data: {
            title: news.titleEn,
            excerpt: news.excerptEn,
          },
        });
        await payload.update({
          collection: "news",
          id: existing.docs[0].id,
          locale: "ar",
          overrideAccess: true,
          data: {
            title: news.titleAr,
            excerpt: news.excerptAr,
          },
        });
        newsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Products: ${created} created, ${updated} updated (EN+AR). Partners: ${partnersCount}. News: ${newsCount} synced (EN+AR).`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
