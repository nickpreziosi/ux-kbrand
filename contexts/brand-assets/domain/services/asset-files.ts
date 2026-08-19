import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * Display order for format chips. Raster first (what most people came for),
 * then vector, then editable masters. Anything unlisted sorts after these,
 * alphabetically, so a new extension appears predictably.
 */
export const ASSET_FORMAT_ORDER: readonly string[] = [
  "png",
  "svg",
  "webp",
  "jpg",
  "jpeg",
  "gif",
  "ico",
  "pdf",
  "ai",
  "eps",
  "ttf",
  "otf",
  "css",
] as const;

/** The format a file name encodes, lowercased, or null when it has none. */
export function formatFromFileName(fileName: string): string | null {
  const dot = fileName.lastIndexOf(".");
  if (dot >= 0 && dot < fileName.length - 1) {
    return fileName.slice(dot + 1).toLowerCase();
  }
  return null;
}

/** The file's format, lowercased, from its extension. */
export function fileFormat(file: Pick<AssetFile, "fileName">): string | null {
  return formatFromFileName(file.fileName);
}

function formatRank(file: Pick<AssetFile, "fileName">): number {
  const format = fileFormat(file);
  const index = format ? ASSET_FORMAT_ORDER.indexOf(format) : -1;
  return index === -1 ? ASSET_FORMAT_ORDER.length : index;
}

/** Files in `ASSET_FORMAT_ORDER`; the first is the default download. */
export function sortedFiles(files: AssetFile[]): AssetFile[] {
  return [...files].sort((a, b) => {
    const rank = formatRank(a) - formatRank(b);
    if (rank !== 0) return rank;
    return (fileFormat(a) ?? "").localeCompare(fileFormat(b) ?? "");
  });
}

export function assetTotalBytes(asset: Pick<BrandAsset, "files">): number {
  return asset.files.reduce((sum, file) => sum + file.sizeBytes, 0);
}

/**
 * Drops the tags that are just format markers for files in this set, so asset
 * tags survive a round trip through the admin form without "png" leaking in.
 */
export function withoutFormatTags(
  tags: string[],
  files: Pick<AssetFile, "fileName">[],
): string[] {
  const formats = new Set(
    files
      .map((file) => formatFromFileName(file.fileName))
      .filter((format): format is string => Boolean(format)),
  );
  return tags.filter((tag) => !formats.has(tag.toLowerCase()));
}

/**
 * Stable, readable asset id from the artwork title ("K Lab logo — primary" →
 * "k-lab-logo-primary"), disambiguated against ids already in use.
 */
export function makeAssetId(title: string, taken: Iterable<string>): string {
  const slug =
    title
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "asset";

  const used = new Set(taken);
  if (!used.has(slug)) return slug;
  for (let n = 2; ; n += 1) {
    const candidate = `${slug}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

export function findFile(
  assets: BrandAsset[],
  fileId: string,
): { asset: BrandAsset; file: AssetFile } | null {
  for (const asset of assets) {
    const file = asset.files.find((candidate) => candidate.id === fileId);
    if (file) return { asset, file };
  }
  return null;
}
