import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { formatFromFileName } from "@/contexts/brand-assets/domain/services/asset-files";
import {
  assetPresentationKind,
  presentationImageFit,
} from "@/contexts/brand-assets/domain/services/asset-presentation";

/** Tags that mark artwork drawn to sit on a dark surface. */
const REVERSED_TAGS = ["reversed", "white", "light"];

/** Standalone marks (the K), as opposed to the full wordmark lockup. */
const LOGOMARK_TAGS = ["logomark", "mark"];

/**
 * Finished pictures that already include a background. Insetting these would
 * frame a photograph in white — they fill the card instead.
 */
const COMPOSED_FORMATS = ["webp", "jpg", "jpeg", "gif"];

/**
 * Brand clearspace is 0.5× the logomark height on every side. In a 16:9 card
 * that means a square mark occupies half the frame height → 25% inset.
 * Wide lockups only need a modest inset; they already breathe vertically.
 */
export const LOCKUP_INSET_CLASS = "inset-[max(1rem,12%)]";
export const LOGOMARK_INSET_CLASS = "inset-[max(1.5rem,25%)]";
export const LOCKUP_PADDING_CLASS = "p-[max(2rem,12%)]";
export const LOGOMARK_PADDING_CLASS = "p-[max(2rem,25%)]";

export interface AssetThumbnail {
  /** Fits the whole artwork in the frame; only photography is allowed to crop. */
  fit: "contain" | "cover";
  /** Surface the artwork is shown against. */
  surfaceClassName: string;
  /** Lockups need breathing room; a finished picture is shown edge to edge. */
  clearspace: boolean;
  /** Absolute inset on the card artwork. */
  insetClassName: string;
  /** Padding on the large preview dialog. */
  paddingClassName: string;
}

function previewFormat(asset: BrandAsset): string | null {
  const fromPreview = asset.previewUrl
    ? formatFromFileName(asset.previewUrl)
    : null;
  if (fromPreview) return fromPreview;
  return formatFromFileName(asset.files[0]?.fileName ?? "");
}

function isLogomark(asset: BrandAsset): boolean {
  return (
    assetPresentationKind(asset.category) === "icon" ||
    asset.tags.some((tag) => LOGOMARK_TAGS.includes(tag.toLowerCase()))
  );
}

/**
 * How an asset's artwork meets its frame.
 */
export function assetThumbnail(asset: BrandAsset): AssetThumbnail {
  const kind = assetPresentationKind(asset.category);
  if (kind === "imagery") {
    return {
      fit: presentationImageFit(kind),
      surfaceClassName: "bg-background",
      clearspace: false,
      insetClassName: "inset-0",
      paddingClassName: "",
    };
  }

  if (kind === "font" || kind === "document") {
    return {
      fit: "contain",
      surfaceClassName: "bg-background",
      clearspace: false,
      insetClassName: "inset-0",
      paddingClassName: "",
    };
  }

  if (kind === "icon") {
    return {
      fit: "contain",
      surfaceClassName: "bg-background",
      clearspace: true,
      insetClassName: LOGOMARK_INSET_CLASS,
      paddingClassName: LOGOMARK_PADDING_CLASS,
    };
  }

  const reversed = asset.tags.some((tag) =>
    REVERSED_TAGS.includes(tag.toLowerCase()),
  );
  const composed = COMPOSED_FORMATS.includes(previewFormat(asset) ?? "");
  if (composed) {
    return {
      fit: "contain",
      surfaceClassName: reversed ? "bg-black" : "bg-white",
      clearspace: false,
      insetClassName: "inset-0",
      paddingClassName: "",
    };
  }

  const mark = isLogomark(asset);
  return {
    fit: "contain",
    surfaceClassName: reversed ? "bg-black" : "bg-white",
    clearspace: true,
    insetClassName: mark ? LOGOMARK_INSET_CLASS : LOCKUP_INSET_CLASS,
    paddingClassName: mark ? LOGOMARK_PADDING_CLASS : LOCKUP_PADDING_CLASS,
  };
}
