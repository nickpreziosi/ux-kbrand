import { resolve, sep } from "node:path";
import { PRIVATE_SEED_FILES } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

export const PRIVATE_ASSETS_ROOT = resolve(process.cwd(), "private-assets");

const SALES_FILES_PREFIX = "/api/sales-files/";

/**
 * Resolve a private `/api/sales-files/{fileId}` downloadUrl to a file under
 * private-assets/. Returns null for unknown ids or anything that escapes
 * that root.
 */
export function resolveSalesFilePath(downloadUrl: string): string | null {
  if (!downloadUrl.startsWith(SALES_FILES_PREFIX)) return null;

  const id = downloadUrl.slice(SALES_FILES_PREFIX.length);
  if (
    !id ||
    id.includes("\0") ||
    id.includes("..") ||
    id.includes("/") ||
    id.includes("\\")
  ) {
    return null;
  }

  const fileName = PRIVATE_SEED_FILES[id];
  if (
    !fileName ||
    fileName.includes("\0") ||
    fileName.includes("..") ||
    fileName.includes("/") ||
    fileName.includes("\\")
  ) {
    return null;
  }

  const absolute = resolve(PRIVATE_ASSETS_ROOT, fileName);
  if (!absolute.startsWith(PRIVATE_ASSETS_ROOT + sep)) return null;
  return absolute;
}
