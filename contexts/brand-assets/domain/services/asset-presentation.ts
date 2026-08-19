import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";

/**
 * How a catalog card should preview and act. Driven by category so logos,
 * photography, fonts, documents and icons do not share one interaction pattern.
 */
export type AssetPresentationKind =
  | "logo"
  | "imagery"
  | "font"
  | "document"
  | "icon";

export function assetPresentationKind(
  category: AssetCategory,
): AssetPresentationKind {
  switch (category) {
    case "logos":
      return "logo";
    case "brand-imagery":
    case "photography":
      return "imagery";
    case "fonts":
      return "font";
    case "iconography":
      return "icon";
    default:
      return "document";
  }
}

export function presentationAllowsExpand(kind: AssetPresentationKind): boolean {
  return kind === "imagery";
}
