/**
 * Turbopack/webpack may write hashed symlinks under .next/node_modules
 * (e.g. pino-<hash>, @libsql/client-<hash>). Windows zip breaks those on Linux.
 * Replace links with real directory copies. Skip native sharp (use server binary).
 */
import fs from "node:fs";
import path from "node:path";

const nextNm = path.resolve(".next/node_modules");

if (!fs.existsSync(nextNm)) {
  console.log("[materialize-next-externals] no .next/node_modules — skip");
  process.exit(0);
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true, dereference: true, force: true });
}

function tryReadlink(p) {
  try {
    return fs.readlinkSync(p);
  } catch {
    return null;
  }
}

function shouldSkip(name) {
  return name.startsWith("sharp-") || name === "sharp";
}

function materializeEntry(destPath, name) {
  if (shouldSkip(name)) {
    console.log(
      `[materialize-next-externals] skip ${name} (native) — on Linux: ln -sfn ../../node_modules/sharp ${path.relative(nextNm, destPath)}`,
    );
    return;
  }

  const link = tryReadlink(destPath);
  if (!link) return;

  const resolved = path.isAbsolute(link)
    ? link
    : path.resolve(path.dirname(destPath), link);

  if (!fs.existsSync(resolved)) {
    console.warn(
      `[materialize-next-externals] missing target for ${name}: ${resolved}`,
    );
    return;
  }

  fs.rmSync(destPath, { recursive: true, force: true });
  copyDir(resolved, destPath);
  console.log(`[materialize-next-externals] copied ${name} <- ${resolved}`);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    // Scoped package container: @libsql/...
    if (entry.isDirectory() && entry.name.startsWith("@")) {
      for (const child of fs.readdirSync(full, { withFileTypes: true })) {
        const childPath = path.join(full, child.name);
        materializeEntry(childPath, `${entry.name}/${child.name}`);
      }
      continue;
    }

    materializeEntry(full, entry.name);
  }
}

walk(nextNm);
console.log("[materialize-next-externals] done");
