import path from "node:path";

/**
 * LibSQL/URL parsing turns `file:./database.db` into pathname `/database.db`
 * (filesystem root), which fails with SQLITE_CANTOPEN (14) on hosts where
 * cwd is `/` or the relative URI is parsed as absolute-from-root.
 * Resolve relative file: URIs against process.cwd() instead.
 */
export function resolveSqliteDatabaseUri(
  raw: string | undefined,
  cwd: string = process.cwd(),
): string {
  const input = (raw && raw.trim()) || "file:./database.db";

  if (!input.startsWith("file:")) {
    return input;
  }

  const pathPart = input.slice("file:".length);

  // file:///absolute/path
  if (pathPart.startsWith("///")) {
    return input;
  }

  // file://localhost/absolute/path
  if (pathPart.startsWith("//localhost/")) {
    return `file://${pathPart.slice("//localhost".length)}`;
  }

  // file://host/... — leave unchanged
  if (pathPart.startsWith("//")) {
    return input;
  }

  // file:/absolute/path
  if (pathPart.startsWith("/")) {
    return `file://${pathPart}`;
  }

  // Relative: file:./database.db or file:database.db
  const relativePath = pathPart.replace(/^\.\//, "");
  const absolutePath = path.resolve(cwd, relativePath).replace(/\\/g, "/");
  const withLeadingSlash = absolutePath.startsWith("/")
    ? absolutePath
    : `/${absolutePath}`;

  return `file://${withLeadingSlash}`;
}
