import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { fileFormat } from "@/contexts/brand-assets/domain/services/asset-files";
import type { LogoVariant } from "@/ui/branding/content/logo-variants";

/** Downloadable logo file formats, in display order. */
export type LogoFormat = "png" | "svg" | "pdf" | "ai";

export const LOGO_FORMAT_ORDER: readonly LogoFormat[] = [
  "png",
  "svg",
  "pdf",
  "ai",
] as const;

export interface LogoFormatOption {
  format: LogoFormat;
  file: AssetFile;
  asset: BrandAsset;
}

export function brandDownloadUrl(fileId: string): string {
  return `/api/brand-download/${fileId}`;
}

export function assetBundleUrl(assetId: string): string {
  return `/api/asset-bundle/${assetId}`;
}

export function formatFromFile(file: AssetFile): LogoFormat | null {
  const format = fileFormat(file);
  return LOGO_FORMAT_ORDER.find((candidate) => candidate === format) ?? null;
}

/** @deprecated Use formatFromFile. */
export function formatFromAsset(asset: BrandAsset): LogoFormat | null {
  const [file] = asset.files;
  return file ? formatFromFile(file) : null;
}

export function getFormatsForVariant(
  assets: BrandAsset[],
  variant: LogoVariant,
): LogoFormatOption[] {
  const matched = assets.filter((asset) =>
    variant.matchTags.every((tag) => asset.tags.includes(tag)),
  );

  const byFormat = new Map<LogoFormat, LogoFormatOption>();
  for (const asset of matched) {
    for (const file of asset.files) {
      const format = formatFromFile(file);
      if (!format || byFormat.has(format)) continue;
      byFormat.set(format, { format, file, asset });
    }
  }

  return LOGO_FORMAT_ORDER.filter((format) => byFormat.has(format)).map(
    (format) => byFormat.get(format)!,
  );
}

export function previewAssetForVariant(
  assets: BrandAsset[],
  variant: LogoVariant,
): BrandAsset | undefined {
  const formats = getFormatsForVariant(assets, variant);
  return (
    formats.find((entry) => entry.format === "png")?.asset ??
    formats.find((entry) => entry.format === "svg")?.asset ??
    formats[0]?.asset
  );
}
