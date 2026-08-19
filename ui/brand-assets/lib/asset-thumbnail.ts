import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { fileFormat } from "@/contexts/brand-assets/domain/services/asset-files";
import {
  assetPresentationKind,
  presentationImageFit,
} from "@/contexts/brand-assets/domain/services/asset-presentation";

/**
 * Formats that carry an alpha channel, so the artwork arrives as a lockup on
 * nothing rather than as a finished picture. These are the files that need a
 * surface put behind them and clearspace around them.
 */
const TRANSPARENT_FORMATS = ["svg", "png", "pdf", "ai", "eps", "ico"];

/** Tags that mark artwork drawn to sit on a dark surface. */
const REVERSED_TAGS = ["reversed", "white"];

export interface AssetThumbnail {
  /** Fits the whole artwork in the frame; only photography is allowed to crop. */
  fit: "contain" | "cover";
  /** Surface the artwork is shown against. */
  surfaceClassName: string;
  /** Lockups need breathing room; a finished picture is shown edge to edge. */
  clearspace: boolean;
}

/**
 * How an asset's artwork meets its frame.
 */
export function assetThumbnail(asset: BrandAsset): AssetThumbnail {
  const kind = assetPresentationKind(asset.category);
  if (kind !== "logo") {
    return {
      fit: presentationImageFit(kind),
      surfaceClassName: "bg-secondary",
      clearspace: false,
    };
  }

  const format = fileFormat(asset.files[0] ?? { fileName: "" });
  if (!format || !TRANSPARENT_FORMATS.includes(format)) {
    return {
      fit: "contain",
      surfaceClassName: "bg-secondary",
      clearspace: false,
    };
  }

  const reversed = asset.tags.some((tag) =>
    REVERSED_TAGS.includes(tag.toLowerCase()),
  );

  return {
    fit: "contain",
    surfaceClassName: reversed
      ? "bg-brand-surface-dark"
      : "bg-brand-surface-light",
    clearspace: true,
  };
}
