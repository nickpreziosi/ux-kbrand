import { readFile } from "node:fs/promises";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { getUpload } from "@/contexts/brand-assets/infrastructure/mock/server-upload-store";
import { resolveBrandFilePath } from "@/lib/brand/brand-file-path";
import { resolveSalesFilePath } from "@/lib/brand/private-asset-path";
import { createZip, uniqueZipEntryName, type ZipEntry } from "@/lib/zip/create-zip";

/**
 * A file's bytes can come from three places: files shipped under
 * public/brand-files, private sales files under private-assets, and admin
 * uploads held in the mock storage backend. All belong in the bundle —
 * otherwise a freshly uploaded format would 404 the whole download.
 */
export async function readBrandFileBytes(
  file: AssetFile,
): Promise<Uint8Array | null> {
  const uploadId = file.downloadUrl.startsWith("/api/uploads/")
    ? file.downloadUrl.slice("/api/uploads/".length)
    : null;
  if (uploadId) {
    return getUpload(decodeURIComponent(uploadId))?.bytes ?? null;
  }

  const filePath =
    resolveBrandFilePath(file.downloadUrl) ?? resolveSalesFilePath(file.downloadUrl);
  if (!filePath) return null;
  try {
    return new Uint8Array(await readFile(filePath));
  } catch {
    return null;
  }
}

/** Zip the given files, or null when any of them cannot be read. */
export async function zipBrandFiles(
  files: AssetFile[],
): Promise<Uint8Array<ArrayBuffer> | null> {
  const taken = new Set<string>();
  const entries: ZipEntry[] = [];

  for (const file of files) {
    const bytes = await readBrandFileBytes(file);
    if (!bytes) return null;
    entries.push({ name: uniqueZipEntryName(taken, file.fileName), data: bytes });
  }

  return createZip(entries);
}