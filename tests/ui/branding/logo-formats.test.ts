import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  brandDownloadUrl,
  formatFromAsset,
  getFormatsForVariant,
  previewAssetForVariant,
} from "@/ui/branding/content/logo-formats";
import { LOGO_VARIANTS } from "@/ui/branding/content/logo-variants";

function asset(partial: {
  id: string;
  fileName: string;
  tags: string[];
  contentType?: string;
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.id,
    description: "",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: partial.fileName,
      contentType: partial.contentType ?? "application/octet-stream",
      sizeBytes: 1,
      storagePath: `assets/logos/${partial.fileName}`,
      downloadUrl: `/brand-files/logos/${partial.fileName}`,
    },
    previewUrl: `/brand-files/logos/${partial.fileName}`,
    tags: partial.tags,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const fixture: BrandAsset[] = [
  asset({
    id: "primary-png",
    fileName: "k-lab-logo-blue.png",
    tags: ["primary", "logo", "png", "blue"],
  }),
  asset({
    id: "primary-svg",
    fileName: "k-lab-logo-blue.svg",
    tags: ["primary", "logo", "svg", "blue"],
  }),
  asset({
    id: "primary-ai",
    fileName: "k-lab-logo-blue.ai",
    tags: ["primary", "logo", "ai", "blue"],
  }),
  asset({
    id: "dark-png",
    fileName: "k-lab-logo-dark.png",
    tags: ["dark", "logo", "png"],
  }),
  asset({
    id: "mark-png",
    fileName: "k-lab-logomark.png",
    tags: ["mark", "icon", "logomark", "png"],
  }),
  asset({
    id: "mark-pdf",
    fileName: "k-lab-logomark.pdf",
    tags: ["mark", "logomark", "pdf"],
  }),
  asset({
    id: "dark-mark",
    fileName: "k-lab-logomark-dark.png",
    tags: ["logomark", "dark", "png"],
  }),
];

describe("logo-formats", () => {
  it("builds an attachment download URL from the asset id", () => {
    expect(brandDownloadUrl("ast-010")).toBe("/api/brand-download/ast-010");
  });

  it("infers format from file extension", () => {
    expect(formatFromAsset(fixture[0])).toBe("png");
    expect(formatFromAsset(fixture[1])).toBe("svg");
    expect(formatFromAsset(fixture[2])).toBe("ai");
    expect(formatFromAsset(fixture[5])).toBe("pdf");
  });

  it("returns only formats present for a variant, in PNG → SVG → PDF → AI order", () => {
    const primary = LOGO_VARIANTS.find((variant) => variant.id === "primary")!;
    const formats = getFormatsForVariant(fixture, primary).map(
      (entry) => entry.format,
    );
    expect(formats).toEqual(["png", "svg", "ai"]);
  });

  it("does not include a dark logomark when resolving the dark lockup variant", () => {
    const dark = LOGO_VARIANTS.find((variant) => variant.id === "dark")!;
    const formats = getFormatsForVariant(fixture, dark);
    expect(formats.map((entry) => entry.asset.id)).toEqual(["dark-png"]);
  });

  it("returns an empty list when no assets match the variant", () => {
    const reversed = LOGO_VARIANTS.find((variant) => variant.id === "reversed")!;
    expect(getFormatsForVariant(fixture, reversed)).toEqual([]);
  });

  it("prefers PNG for the variant preview asset", () => {
    const primary = LOGO_VARIANTS.find((variant) => variant.id === "primary")!;
    expect(previewAssetForVariant(fixture, primary)?.id).toBe("primary-png");
  });
});
