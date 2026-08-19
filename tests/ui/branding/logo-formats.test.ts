import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  brandDownloadUrl,
  formatFromFile,
  getFormatsForVariant,
  previewAssetForVariant,
} from "@/ui/branding/content/logo-formats";
import { LOGO_VARIANTS } from "@/ui/branding/content/logo-variants";

function file(partial: {
  id: string;
  fileName: string;
  contentType?: string;
}): AssetFile {
  return {
    id: partial.id,
    fileName: partial.fileName,
    contentType: partial.contentType ?? "application/octet-stream",
    sizeBytes: 1,
    storagePath: `assets/logos/${partial.fileName}`,
    downloadUrl: `/brand-files/logos/${partial.fileName}`,
  };
}

function asset(partial: {
  id: string;
  tags: string[];
  files: AssetFile[];
}): BrandAsset {
  return {
    id: partial.id,
    title: partial.id,
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: partial.files,
    previewUrl: `/brand-files/logos/${partial.files[0]?.fileName}`,
    tags: partial.tags,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
  };
}

const fixture: BrandAsset[] = [
  asset({
    id: "primary",
    tags: ["primary", "logo", "blue"],
    files: [
      file({ id: "primary-png", fileName: "k-lab-logo-blue.png" }),
      file({ id: "primary-svg", fileName: "k-lab-logo-blue.svg" }),
      file({ id: "primary-ai", fileName: "k-lab-logo-blue.ai" }),
    ],
  }),
  asset({
    id: "dark",
    tags: ["dark", "logo"],
    files: [file({ id: "dark-png", fileName: "k-lab-logo-dark.png" })],
  }),
  asset({
    id: "mark",
    tags: ["mark", "icon", "logomark"],
    files: [
      file({ id: "mark-png", fileName: "k-lab-logomark.png" }),
      file({ id: "mark-pdf", fileName: "k-lab-logomark.pdf" }),
    ],
  }),
  asset({
    id: "dark-mark",
    tags: ["logomark", "dark"],
    files: [file({ id: "dark-mark", fileName: "k-lab-logomark-dark.png" })],
  }),
];

describe("logo-formats", () => {
  it("builds an attachment download URL from the file id", () => {
    expect(brandDownloadUrl("ast-010")).toBe("/api/brand-download/ast-010");
  });

  it("infers format from file extension", () => {
    expect(formatFromFile(fixture[0].files[0])).toBe("png");
    expect(formatFromFile(fixture[0].files[1])).toBe("svg");
    expect(formatFromFile(fixture[0].files[2])).toBe("ai");
    expect(formatFromFile(fixture[2].files[1])).toBe("pdf");
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
    expect(formats.map((entry) => entry.asset.id)).toEqual(["dark"]);
  });

  it("returns an empty list when no assets match the variant", () => {
    const reversed = LOGO_VARIANTS.find((variant) => variant.id === "reversed")!;
    expect(getFormatsForVariant(fixture, reversed)).toEqual([]);
  });

  it("prefers PNG for the variant preview asset", () => {
    const primary = LOGO_VARIANTS.find((variant) => variant.id === "primary")!;
    expect(previewAssetForVariant(fixture, primary)?.id).toBe("primary");
  });
});
