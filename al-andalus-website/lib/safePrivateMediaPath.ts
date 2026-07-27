import path from "path";

/**
 * Resolve a document filename under `private-media` with path-traversal protection.
 * Returns null if the name is empty or would escape the documents directory.
 */
export function resolvePrivateMediaPath(
  filename: string,
  cwd: string = process.cwd(),
): string | null {
  // Normalize Windows separators so basename works on POSIX too.
  const normalized = filename.trim().replace(/\\/g, "/");
  const safeName = path.posix.basename(normalized);

  if (!safeName || safeName === "." || safeName === "..") {
    return null;
  }

  // Reject null bytes or leftover separators after basename.
  if (safeName.includes("\0") || safeName.includes("/") || safeName.includes("\\")) {
    return null;
  }

  const documentsDir = path.resolve(cwd, "private-media");
  const resolved = path.resolve(documentsDir, safeName);

  const prefix = documentsDir.endsWith(path.sep)
    ? documentsDir
    : documentsDir + path.sep;

  if (resolved !== documentsDir && !resolved.startsWith(prefix)) {
    return null;
  }

  return resolved;
}
