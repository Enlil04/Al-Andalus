const { spawnSync } = require("child_process");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database.db");

function run(sql) {
  const result = spawnSync("sqlite3", [dbPath], {
    input: sql,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(result.stderr);
    throw new Error(result.stderr || "sqlite failed");
  }
  return (result.stdout || "").trim();
}

function tableInfo(name) {
  return run(`PRAGMA table_info(${name});`);
}

function hasColumn(table, column) {
  return tableInfo(table)
    .split("\n")
    .some((line) => line.split("|")[1] === column);
}

function tableExists(name) {
  return Boolean(
    run(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${name}';`,
    ),
  );
}

const steps = [];

if (!tableExists("partners_locales")) {
  steps.push(`
CREATE TABLE partners_locales (
  name TEXT NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  _locale TEXT NOT NULL,
  _parent_id INTEGER NOT NULL,
  UNIQUE (_locale, _parent_id)
);`);
}

if (hasColumn("partners", "name")) {
  steps.push(`
INSERT OR IGNORE INTO partners_locales (name, _locale, _parent_id)
SELECT name, 'ar', id FROM partners WHERE name IS NOT NULL;
INSERT OR IGNORE INTO partners_locales (name, _locale, _parent_id)
SELECT name, 'en', id FROM partners WHERE name IS NOT NULL;
ALTER TABLE partners DROP COLUMN name;
`);
}

if (!tableExists("media_locales")) {
  steps.push(`
CREATE TABLE media_locales (
  alt TEXT NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  _locale TEXT NOT NULL,
  _parent_id INTEGER NOT NULL,
  UNIQUE (_locale, _parent_id)
);`);
}

if (hasColumn("media", "alt")) {
  steps.push(`
INSERT OR IGNORE INTO media_locales (alt, _locale, _parent_id)
SELECT alt, 'ar', id FROM media WHERE alt IS NOT NULL;
INSERT OR IGNORE INTO media_locales (alt, _locale, _parent_id)
SELECT alt, 'en', id FROM media WHERE alt IS NOT NULL;
ALTER TABLE media DROP COLUMN alt;
`);
}

if (!tableExists("proposals_locales")) {
  steps.push(`
CREATE TABLE proposals_locales (
  title TEXT NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  _locale TEXT NOT NULL,
  _parent_id INTEGER NOT NULL,
  UNIQUE (_locale, _parent_id)
);`);
}

if (hasColumn("proposals", "title")) {
  steps.push(`
INSERT OR IGNORE INTO proposals_locales (title, _locale, _parent_id)
SELECT title, 'ar', id FROM proposals WHERE title IS NOT NULL;
INSERT OR IGNORE INTO proposals_locales (title, _locale, _parent_id)
SELECT title, 'en', id FROM proposals WHERE title IS NOT NULL;
ALTER TABLE proposals DROP COLUMN title;
`);
}

if (tableExists("about_page_leadership") && hasColumn("about_page_leadership", "name")) {
  if (!hasColumn("about_page_leadership_locales", "name")) {
    steps.push(`ALTER TABLE about_page_leadership_locales ADD COLUMN name TEXT;`);
  }
  steps.push(`
INSERT OR IGNORE INTO about_page_leadership_locales (_locale, _parent_id, name, role, bio)
SELECT 'en', id, name, NULL, NULL FROM about_page_leadership;
INSERT OR IGNORE INTO about_page_leadership_locales (_locale, _parent_id, name, role, bio)
SELECT 'ar', id, name, NULL, NULL FROM about_page_leadership;
ALTER TABLE about_page_leadership DROP COLUMN name;
`);
}

if (steps.length === 0) {
  console.log("Nothing to migrate.");
} else {
  run("BEGIN;\n" + steps.join("\n") + "\nCOMMIT;");
  console.log("Migration applied.");
}

console.log("partners has name?", hasColumn("partners", "name"));
console.log("media has alt?", hasColumn("media", "alt"));
console.log("proposals has title?", hasColumn("proposals", "title"));
console.log("partners_locales", run("SELECT COUNT(*) FROM partners_locales;"));
console.log("media_locales", run("SELECT COUNT(*) FROM media_locales;"));
console.log("proposals_locales", run("SELECT COUNT(*) FROM proposals_locales;"));
