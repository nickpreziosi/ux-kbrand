import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { assetFormat } from "@/contexts/brand-assets/domain/services/asset-grouping";

/**
 * Formats that carry an alpha channel, so the artwork arrives as a lockup on
 * nothing rather than as a finished picture. These are the files that need a
 * surface put behind them and clearspace around them.
 */
const TRANSPARENT_FORMATS = ["svg", "png", "pdf", "ai", "eps"];

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
 *
 * A logo is a fixed shape with its own proportions — a 3.4:1 lockup cropped to
 * fill a 16:9 frame loses its ends, which is exactly the misuse the guidelines
 * page forbids. So logos are contained, and the transparent ones get the same
 * treatment they get on that page: a valid brand surface behind them (dark for
 * the reversed artwork, which would otherwise be white on white) and padding
 * standing in for clearspace.
 *
 * Photography and screens are different — they have no canonical shape, so
 * filling the frame is the better-looking answer and cropping costs nothing.
 */
export function assetThumbnail(asset: BrandAsset): AssetThumbnail {
  if (asset.category !== "logos") {
    return { fit: "cover", surfaceClassName: "bg-secondary", clearspace: false };
  }

  const format = assetFormat(asset);
  if (!format || !TRANSPARENT_FORMATS.includes(format)) {
    // An opaque logo image is already composed against its own background —
    // contained so it stays uncropped, but never inset or re-surfaced.
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
