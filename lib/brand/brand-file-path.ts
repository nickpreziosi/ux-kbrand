import { resolve, sep } from "node:path";

export const BRAND_FILES_ROOT = resolve(process.cwd(), "public", "brand-files");

/**
 * Resolve a public `/brand-files/...` downloadUrl to an absolute path under
 * public/brand-files. Returns null for anything that is not a brand file or
 * that escapes that root — the single guard both download routes rely on, so
 * traversal only has to be got right in one place.
 */
export function resolveBrandFilePath(downloadUrl: string): string | null {
  if (!downloadUrl.startsWith("/brand-files/")) return null;

  const relative = downloadUrl.slice("/brand-files/".length);
  if (!relative || relative.includes("\0")) return null;

  const absolute = resolve(BRAND_FILES_ROOT, relative);
  if (!absolute.startsWith(BRAND_FILES_ROOT + sep)) return null;

  return absolute;
}
