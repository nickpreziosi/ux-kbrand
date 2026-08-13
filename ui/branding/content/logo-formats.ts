import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetFormat } from "@/contexts/brand-assets/domain/services/asset-grouping";
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
  asset: BrandAsset;
}

/** Attachment download URL for a catalog asset (forces save, not navigate). */
export function brandDownloadUrl(assetId: string): string {
  return `/api/brand-download/${assetId}`;
}

/** Zip of every format in an asset group (the card's "Download all"). */
export function brandBundleUrl(groupId: string): string {
  return `/api/brand-bundle/${groupId}`;
}

/** Narrow an asset's format to the four the logo pages offer. */
export function formatFromAsset(asset: BrandAsset): LogoFormat | null {
  const format = assetFormat(asset);
  return LOGO_FORMAT_ORDER.find((candidate) => candidate === format) ?? null;
}

/**
 * Formats available for a logo variant card. Only returns formats that have a
 * matching catalog asset; order is PNG → SVG → PDF → AI.
 */
export function getFormatsForVariant(
  assets: BrandAsset[],
  variant: LogoVariant,
): LogoFormatOption[] {
  const matched = assets.filter((asset) =>
    variant.matchTags.every((tag) => asset.tags.includes(tag)),
  );

  const byFormat = new Map<LogoFormat, BrandAsset>();
  for (const asset of matched) {
    const format = formatFromAsset(asset);
    if (!format || byFormat.has(format)) continue;
    byFormat.set(format, asset);
  }

  return LOGO_FORMAT_ORDER.filter((format) => byFormat.has(format)).map(
    (format) => ({ format, asset: byFormat.get(format)! }),
  );
}

/** Prefer PNG (then SVG) for on-page previews. */
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
