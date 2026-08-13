import {
  isAssetFile,
  type AssetGroupFileInput,
  type AssetVisibility,
} from "@/contexts/brand-assets/domain";
import { isRecord } from "@/contexts/shared/domain/is-record";

/** Wire guards shared by the asset-group routes. */

export function isVisibility(value: unknown): value is AssetVisibility {
  return value === "public" || value === "employee";
}

/**
 * Reads a list of `{ file, previewUrl? }` entries. Returns null when the shape
 * is wrong at all — a half-valid file list would publish a broken group.
 */
export function readGroupFiles(value: unknown): AssetGroupFileInput[] | null {
  if (!Array.isArray(value)) return null;

  const files: AssetGroupFileInput[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || !isAssetFile(entry.file)) return null;
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

export function readTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((tag): tag is string => typeof tag === "string");
}

export function readAssetIds(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((id): id is string => typeof id === "string" && Boolean(id));
}
