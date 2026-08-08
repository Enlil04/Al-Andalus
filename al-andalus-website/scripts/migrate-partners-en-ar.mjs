/**
 * Migrate partners from Payload localized `name` (partners_locales)
 * to explicit name_en / name_ar columns (EN/AR admin tabs).
 *
 * On cPanel (after extract):
 *   cd ~/alandalus-iq.com/nodejs
 *   source /home/alandalus/nodevenv/.../bin/activate   # if your host uses this
 *   node scripts/migrate-partners-en-ar.mjs
 *
 * Uses DATABASE_URI from the environment (Node.js App env vars).
 * Safe to re-run. Does not delete partners_locales.
 */
import { createClient } from "@libsql/client";
import path from "node:path";

function resolveDbUrl() {
  const raw = (process.env.DATABASE_URI || "file:./database.db").trim();
  if (raw.startsWith("file:")) {
    const without = raw.slice("file:".length);
    // Absolute Unix/Windows paths stay as-is; relative resolve from cwd.
    if (without.startsWith("/") || /^[A-Za-z]:[\\/]/.test(without)) {
      return `file:${without}`;
    }
    return `file:${path.resolve(without)}`;
  }
  return raw;
}

const url = resolveDbUrl();
console.log("DATABASE_URI →", url);
const db = createClient({ url });

const cols = await db.execute("PRAGMA table_info(partners)");
const names = new Set(cols.rows.map((r) => String(r.name)));

if (!names.has("name_en")) {
  await db.execute("ALTER TABLE partners ADD COLUMN name_en text");
  console.log("added name_en");
}
if (!names.has("name_ar")) {
  await db.execute("ALTER TABLE partners ADD COLUMN name_ar text");
  console.log("added name_ar");
}

let hasLocales = true;
try {
  await db.execute("SELECT 1 FROM partners_locales LIMIT 1");
} catch {
  hasLocales = false;
  console.log("no partners_locales table — will only backfill empty name_en/name_ar from each other");
}

const partners = await db.execute(
  "SELECT id, name_en, name_ar FROM partners",
);
let updated = 0;

for (const row of partners.rows) {
  const id = row.id;
  let en = String(row.name_en || "").trim();
  let ar = String(row.name_ar || "").trim();

  if (hasLocales && (!en || !ar)) {
    const locales = await db.execute(
      "SELECT name, _locale FROM partners_locales WHERE _parent_id = ?",
      [id],
    );
    for (const loc of locales.rows) {
      const value = String(loc.name || "").trim();
      if (loc._locale === "en" && value && !en) en = value;
      if (loc._locale === "ar" && value && !ar) ar = value;
    }
  }

  if (!en && ar) en = ar;
  if (!ar && en) ar = en;

  await db.execute(
    "UPDATE partners SET name_en = ?, name_ar = ? WHERE id = ?",
    [en || null, ar || null, id],
  );
  updated += 1;
  console.log(`partner ${id}: en=${JSON.stringify(en)} ar=${JSON.stringify(ar)}`);
}

console.log(`done — updated ${updated} partners`);
