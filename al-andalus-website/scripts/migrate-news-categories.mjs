/**
 * One-time / idempotent migration: blog category select → news-categories relationship.
 *
 * Local:
 *   node scripts/migrate-news-categories.mjs
 *
 * cPanel (Application root, after upload, BEFORE Restart if possible):
 *   node scripts/migrate-news-categories.mjs /home/alandalus/private/data/database.db
 *
 * Uses DATABASE_URI from env when no path arg is passed.
 * Keep PAYLOAD_DATABASE_PUSH=false on the server.
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { pathToFileURL } from "node:url";

function resolveDbPath(arg) {
  if (arg) return path.resolve(arg);

  const raw = process.env.DATABASE_URI?.trim();
  if (!raw) {
    return path.resolve(process.cwd(), "database.db");
  }

  if (raw.startsWith("file:")) {
    const withoutScheme = raw.replace(/^file:/, "");
    // file:///C:/... or file:./database.db or file:///home/...
    if (withoutScheme.startsWith("///")) {
      const rest = withoutScheme.slice(3);
      if (/^[A-Za-z]:/.test(rest)) return rest; // Windows
      return `/${rest}`.replace(/^\/+/, "/");
    }
    return path.resolve(process.cwd(), withoutScheme.replace(/^\.\//, ""));
  }

  return path.resolve(raw);
}

const DEFAULT_CATEGORIES = [
  { id: 1, slug: "company", nameEn: "Company News", nameAr: "أخبار الشركة", order: 10 },
  { id: 2, slug: "motor", nameEn: "Motor Insurance", nameAr: "تأمين السيارات", order: 20 },
  { id: 3, slug: "health", nameEn: "Health Insurance", nameAr: "التأمين الصحي", order: 30 },
  { id: 4, slug: "travel", nameEn: "Travel Insurance", nameAr: "تأمين السفر", order: 40 },
  { id: 5, slug: "fire", nameEn: "Fire Insurance", nameAr: "تأمين الحريق", order: 50 },
  { id: 6, slug: "general", nameEn: "General", nameAr: "عام", order: 60 },
];

async function tableColumns(client, table) {
  const result = await client.execute(`PRAGMA table_info(${table})`);
  return new Set(result.rows.map((row) => String(row.name)));
}

async function main() {
  const dbPath = resolveDbPath(process.argv[2]);
  if (!fs.existsSync(dbPath)) {
    console.error(`[migrate] Database not found: ${dbPath}`);
    process.exit(1);
  }

  const url = pathToFileURL(dbPath).href;
  console.log(`[migrate] Using ${url}`);
  const client = createClient({ url });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS news_categories (
      id INTEGER PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      "order" numeric DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      name_en TEXT,
      name_ar TEXT
    )
  `);
  await client.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS news_categories_slug_idx ON news_categories (slug)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS news_categories_updated_at_idx ON news_categories (updated_at)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS news_categories_created_at_idx ON news_categories (created_at)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS news_categories_order_idx ON news_categories ("order")`,
  );

  for (const category of DEFAULT_CATEGORIES) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO news_categories (id, slug, name_en, name_ar, "order")
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        category.id,
        category.slug,
        category.nameEn,
        category.nameAr,
        category.order,
      ],
    });
  }
  console.log("[migrate] news_categories ready");

  const newsCols = await tableColumns(client, "news");
  if (newsCols.has("category") && !newsCols.has("category_id")) {
    console.log("[migrate] Converting news.category (text) → category_id…");
    await client.execute("BEGIN");
    try {
      await client.execute(`
        CREATE TABLE news_new (
          id INTEGER PRIMARY KEY NOT NULL,
          slug TEXT NOT NULL,
          cover_image_id INTEGER,
          category_id INTEGER NOT NULL,
          published_date TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          title_en TEXT,
          title_ar TEXT,
          content_en TEXT,
          content_ar TEXT,
          excerpt_en TEXT,
          excerpt_ar TEXT,
          FOREIGN KEY (cover_image_id) REFERENCES media(id),
          FOREIGN KEY (category_id) REFERENCES news_categories(id)
        )
      `);

      await client.execute(`
        INSERT INTO news_new (
          id, slug, cover_image_id, category_id, published_date, status,
          updated_at, created_at, title_en, title_ar, content_en, content_ar, excerpt_en, excerpt_ar
        )
        SELECT
          n.id,
          n.slug,
          n.cover_image_id,
          COALESCE(c.id, 6),
          n.published_date,
          n.status,
          n.updated_at,
          n.created_at,
          n.title_en,
          n.title_ar,
          n.content_en,
          n.content_ar,
          n.excerpt_en,
          n.excerpt_ar
        FROM news n
        LEFT JOIN news_categories c ON c.slug = n.category
      `);

      await client.execute(`DROP TABLE news`);
      await client.execute(`ALTER TABLE news_new RENAME TO news`);
      await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS news_slug_idx ON news (slug)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS news_created_at_idx ON news (created_at)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS news_updated_at_idx ON news (updated_at)`);
      await client.execute(
        `CREATE INDEX IF NOT EXISTS news_cover_image_idx ON news (cover_image_id)`,
      );
      await client.execute(`CREATE INDEX IF NOT EXISTS news_category_idx ON news (category_id)`);
      await client.execute("COMMIT");
      console.log("[migrate] news table updated");
    } catch (error) {
      await client.execute("ROLLBACK");
      throw error;
    }
  } else if (newsCols.has("category_id")) {
    console.log("[migrate] news.category_id already present — skip news rebuild");
  } else {
    console.warn("[migrate] Unexpected news schema — check manually");
  }

  const relCols = await tableColumns(client, "payload_locked_documents_rels");
  if (!relCols.has("news_categories_id")) {
    await client.execute(
      `ALTER TABLE payload_locked_documents_rels ADD COLUMN news_categories_id INTEGER REFERENCES news_categories(id)`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_news_categories_idx ON payload_locked_documents_rels (news_categories_id)`,
    );
    console.log("[migrate] added payload_locked_documents_rels.news_categories_id");
  } else {
    console.log("[migrate] news_categories_id column already present — skip");
  }

  const count = await client.execute(`SELECT COUNT(*) AS c FROM news_categories`);
  console.log(`[migrate] Done. Categories: ${count.rows[0]?.c ?? 0}`);
}

main().catch((error) => {
  console.error("[migrate] failed:", error);
  process.exit(1);
});
