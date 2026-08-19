import { featuredAssetsForCategory } from "@/contexts/brand-assets/domain/services/asset-featured";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";

function file(id: string): AssetFile {
  return {
    id,
    fileName: `${id}.png`,
    contentType: "image/png",
    sizeBytes: 1,
    storagePath: `assets/logos/${id}.png`,
    downloadUrl: `/brand-files/logos/${id}.png`,
  };
}

function asset(
  partial: Partial<BrandAsset> & { id: string; tags: string[] },
): BrandAsset {
  return {
    title: partial.id,
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [file(partial.id)],
    previewUrl: `/brand-files/logos/${partial.id}.png`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...partial,
  };
}

describe("featuredAssetsForCategory", () => {
  it("picks K Lab primary, dark, reversed and mark logos in that order", () => {
    const assets = [
      asset({ id: "talk", tags: ["primary", "logo"], product: "k-talk" }),
      asset({ id: "mark", tags: ["mark"] }),
      asset({ id: "primary", tags: ["primary", "logo"] }),
      asset({ id: "reversed", tags: ["reversed", "logo"] }),
      asset({ id: "dark", tags: ["dark", "logo"] }),
      asset({ id: "extra", tags: ["favicon"] }),
    ];

    expect(
      featuredAssetsForCategory(assets, "logos").map((row) => row.id),
    ).toEqual(["primary", "dark", "reversed", "mark"]);
  });

  it("caps other categories at the requested limit", () => {
    const assets = [
      asset({ id: "a", tags: [], category: "brand-imagery" }),
      asset({ id: "b", tags: [], category: "brand-imagery" }),
      asset({ id: "c", tags: [], category: "brand-imagery" }),
    ];
    expect(featuredAssetsForCategory(assets, "brand-imagery", 2)).toHaveLength(2);
  });
});
