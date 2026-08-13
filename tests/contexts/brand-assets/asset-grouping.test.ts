import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  assetFormat,
  groupBrandAssets,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

function asset(partial: Partial<BrandAsset> & { id: string; fileName: string }): BrandAsset {
  const { fileName, ...rest } = partial;
  return {
    title: partial.id,
    description: "",
    category: "logos",
    visibility: "public",
    status: "active",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...rest,
    file: {
      fileName,
      contentType: "application/octet-stream",
      sizeBytes: 100,
      storagePath: `assets/logos/${fileName}`,
      downloadUrl: `/brand-files/logos/${fileName}`,
      ...partial.file,
    },
  };
}

describe("assetFormat", () => {
  it("reads the extension off the file name", () => {
    expect(assetFormat(asset({ id: "a", fileName: "k-lab-logo.SVG" }))).toBe("svg");
  });

  it("falls back to a format tag when there is no extension", () => {
    expect(
      assetFormat(asset({ id: "a", fileName: "logo", tags: ["logo", "pdf"] })),
    ).toBe("pdf");
  });

  it("returns null when neither the name nor the tags say", () => {
    expect(assetFormat(asset({ id: "a", fileName: "logo", tags: ["logo"] }))).toBeNull();
  });
});

describe("groupBrandAssets", () => {
  const png = asset({
    id: "ast-010",
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
    title: "K Lab logo — primary (blue), PNG",
    fileName: "k-lab-logo-blue.png",
    previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
    file: { sizeBytes: 1000 } as BrandAsset["file"],
  });
  const ai = asset({
    id: "ast-010-ai",
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
    title: "K Lab logo — primary (blue), AI",
    fileName: "k-lab-logo-blue.ai",
    file: { sizeBytes: 20 } as BrandAsset["file"],
  });
  const svg = asset({
    id: "ast-010-svg",
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
    title: "K Lab logo — primary (blue), SVG",
    fileName: "k-lab-logo-blue.svg",
    file: { sizeBytes: 300 } as BrandAsset["file"],
  });

  it("collapses one artwork's formats into a single group", () => {
    const [group, ...rest] = groupBrandAssets([png, ai, svg]);

    expect(rest).toHaveLength(0);
    expect(group.id).toBe("k-lab-logo-blue");
    expect(group.title).toBe("K Lab logo — primary (blue)");
    expect(group.description).toBe("The default lockup.");
    expect(group.totalBytes).toBe(1320);
  });

  it("orders members raster first, editable masters last", () => {
    const [group] = groupBrandAssets([ai, svg, png]);

    expect(group.assets.map((member) => member.id)).toEqual([
      "ast-010",
      "ast-010-svg",
      "ast-010-ai",
    ]);
  });

  it("picks the first member that has a thumbnail as the group preview", () => {
    const [group] = groupBrandAssets([ai, svg, png]);

    expect(group.preview.id).toBe("ast-010");
  });

  it("falls back to the first member when nothing has a thumbnail", () => {
    const [group] = groupBrandAssets([ai, svg]);

    expect(group.preview.id).toBe("ast-010-svg");
  });

  it("keeps ungrouped assets as one-member groups, in input order", () => {
    const first = asset({ id: "ast-040", fileName: "bg-001.webp", title: "Chevron neon" });
    const second = asset({ id: "ast-041", fileName: "bg-002.webp", title: "Blue gradient" });

    const groups = groupBrandAssets([first, second]);

    expect(groups.map((group) => group.id)).toEqual(["ast-040", "ast-041"]);
    expect(groups[0].title).toBe("Chevron neon");
    expect(groups[0].assets).toHaveLength(1);
  });

  it("preserves the order groups first appear in", () => {
    const other = asset({ id: "ast-040", fileName: "bg-001.webp" });

    expect(groupBrandAssets([other, png, ai]).map((group) => group.id)).toEqual([
      "ast-040",
      "k-lab-logo-blue",
    ]);
  });

  it("reports a group as employee-gated when any member is", () => {
    const gated = { ...ai, visibility: "employee" as const };

    expect(groupBrandAssets([png, gated])[0].visibility).toBe("employee");
    expect(groupBrandAssets([png, ai])[0].visibility).toBe("public");
  });

  it("collapses the seeded logo catalog to one card per artwork", () => {
    const logos = SEED_BRAND_ASSETS.filter((seed) => seed.category === "logos");
    const groups = groupBrandAssets(logos);

    // 20 logo files, but 5 grouped lockups/marks plus 3 ungrouped product logos.
    expect(logos.length).toBeGreaterThan(groups.length);
    expect(groups).toHaveLength(8);

    const logomark = groups.find((group) => group.id === "k-lab-logomark");
    expect(logomark?.title).toBe("K Lab logomark");
    expect(logomark?.assets.map((member) => assetFormat(member))).toEqual([
      "png",
      "svg",
      "pdf",
      "ai",
    ]);
  });

  it("gives every seeded group member the same display copy", () => {
    for (const group of groupBrandAssets(SEED_BRAND_ASSETS)) {
      for (const member of group.assets) {
        if (!member.groupId) continue;
        expect(member.groupTitle).toBe(group.title);
        expect(member.groupDescription).toBe(group.description);
      }
    }
  });
});
