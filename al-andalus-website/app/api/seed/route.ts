import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isSeedAllowed(request: Request): boolean {
  if (process.env.ALLOW_SEED !== "true") return false;

  const secret = process.env.SEED_SECRET;
  if (!secret || secret.length < 16) return false;

  const header = request.headers.get("x-seed-secret");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  return header === secret || querySecret === secret;
}

export async function GET(request: Request) {
  if (!isSeedAllowed(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const payload = await getPayload({ config: configPromise });

    const products = [
      { name: "Cargo Insurance", status: "active", isFeatured: false },
      { name: "Engineering Insurance", status: "active", isFeatured: false },
      { name: "Glass Insurance", status: "active", isFeatured: false },
      { name: "Burglary Insurance", status: "active", isFeatured: false },
      { name: "Bankers Blanket", status: "under-development", isFeatured: false },
      { name: "Cash in Transit", status: "active", isFeatured: false },
      { name: "Public Liability", status: "active", isFeatured: false },
      { name: "Fire Insurance", status: "active", isFeatured: false },
      { name: "Fidelity Guarantee", status: "active", isFeatured: false },
      {
        name: "Motor Insurance",
        status: "active",
        isFeatured: true,
        desc: "Comprehensive coverage for vehicles against accidents, damages, and legal liabilities. Protecting you and your vehicle on every road in Iraq.",
      },
      {
        name: "Health Insurance",
        status: "active",
        isFeatured: true,
        desc: "Comprehensive healthcare coverage for medical treatment, hospitalization, surgeries, diagnostics, and related healthcare expenses for individuals and groups.",
      },
      { name: "Loan Protection", status: "under-development", isFeatured: false },
      { name: "Travel Insurance", status: "active", isFeatured: false },
      { name: "Medical Malpractice", status: "active", isFeatured: false },
      { name: "Hull Insurance", status: "active", isFeatured: false },
      { name: "Cyber Insurance", status: "under-development", isFeatured: false },
    ];

    let count = 0;
    for (const [index, p] of products.entries()) {
      const slug = p.name.toLowerCase().replace(/ /g, "-");
      const existing = await payload.find({
        collection: "products",
        where: { slug: { equals: slug } },
        overrideAccess: true,
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "products",
          overrideAccess: true,
          data: {
            title: p.name,
            slug,
            shortDescription: p.desc || "Comprehensive insurance protection.",
            isFeatured: p.isFeatured,
            status: p.status as "active" | "under-development",
            order: index + 1,
          },
        });
        count++;
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
            overrideAccess: true,
            data: { alt: `Partner ${index + 1} Logo` },
            filePath,
          });

          await payload.create({
            collection: "partners",
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
        title: "Al-Andalus Expands Insurance Network",
        category: "company",
        publishedDate: new Date().toISOString(),
      },
      {
        title: "New Health Insurance Packages for 2027",
        category: "health",
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: "Awarded Best Insurtech of the Year",
        category: "company",
        publishedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        title: "Important Update on Motor Policies",
        category: "motor",
        publishedDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        title: "Navigating Travel Insurance in 2026",
        category: "travel",
        publishedDate: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
    ];

    for (const news of dummyNews) {
      const slug = news.title.toLowerCase().replace(/ /g, "-");
      const existing = await payload.find({
        collection: "news",
        where: { slug: { equals: slug } },
        overrideAccess: true,
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "news",
          overrideAccess: true,
          data: {
            title: news.title,
            slug,
            category: news.category as
              | "company"
              | "health"
              | "motor"
              | "travel",
            publishedDate: news.publishedDate,
            status: "published",
            excerpt:
              "This is a placeholder excerpt for the news article to demonstrate the layout.",
          },
        });
        newsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${count} products, ${partnersCount} partners, and ${newsCount} news articles.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
