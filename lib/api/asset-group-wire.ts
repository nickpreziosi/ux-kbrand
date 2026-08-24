import {
  isAssetFileDraft,
  type AssetFileInput,
  type AssetVisibility,
} from "@/contexts/brand-assets/domain";
import { isRecord } from "@/contexts/shared/domain/is-record";

export function isVisibility(value: unknown): value is AssetVisibility {
  return value === "public" || value === "employee";
}

/**
 * Reads a list of `{ file, previewUrl? }` entries. Returns null when the shape
 * is wrong at all — a half-valid file list would publish a broken asset.
 */
export function readAssetFiles(value: unknown): AssetFileInput[] | null {
  if (!Array.isArray(value)) return null;

  const files: AssetFileInput[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || !isAssetFileDraft(entry.file)) return null;
    files.push({
      file: entry.file,
      previewUrl:
        typeof entry.previewUrl === "string" && entry.previewUrl
          ? entry.previewUrl
          : undefined,
    });
  }
  return files;
}

/** @deprecated Use readAssetFiles. */
export const readGroupFiles = readAssetFiles;

export function readTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((tag): tag is string => typeof tag === "string");
}

export function readAssetIds(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((id): id is string => typeof id === "string" && Boolean(id));
}
