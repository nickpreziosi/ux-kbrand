import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  ANY,
  EMPTY_ASSET_GROUP_FILTER,
  filterAssetGroups,
  hasActiveAssetGroupFilter,
  type AssetGroupFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { groupBrandAssets } from "@/contexts/brand-assets/domain/services/asset-grouping";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

const GROUPS = groupBrandAssets(SEED_BRAND_ASSETS);

function filter(partial: Partial<AssetGroupFilter> = {}): AssetGroupFilter {
  return { ...EMPTY_ASSET_GROUP_FILTER, ...partial };
}

function titles(groups: ReturnType<typeof groupBrandAssets>): string[] {
  return groups.map((group) => group.title);
}

describe("hasActiveAssetGroupFilter", () => {
  it("is inactive by default and for whitespace-only search", () => {
    expect(hasActiveAssetGroupFilter(EMPTY_ASSET_GROUP_FILTER)).toBe(false);
    expect(hasActiveAssetGroupFilter(filter({ search: "   " }))).toBe(false);
  });

  it("is active once any facet narrows", () => {
    expect(hasActiveAssetGroupFilter(filter({ search: "logo" }))).toBe(true);
    expect(hasActiveAssetGroupFilter(filter({ category: "logos" }))).toBe(true);
    expect(hasActiveAssetGroupFilter(filter({ visibility: "employee" }))).toBe(
      true,
    );
    expect(hasActiveAssetGroupFilter(filter({ status: "archived" }))).toBe(true);
  });
});

describe("filterAssetGroups", () => {
  it("returns everything when nothing is set", () => {
    expect(filterAssetGroups(GROUPS, EMPTY_ASSET_GROUP_FILTER)).toHaveLength(
      GROUPS.length,
    );
  });

  it("matches the artwork title, case-insensitively", () => {
    expect(titles(filterAssetGroups(GROUPS, filter({ search: "LOGOMARK" })))).toEqual(
      expect.arrayContaining(["K Lab logomark", "K Lab logomark — white"]),
    );
  });

  it("reaches the file names and formats folded inside a row", () => {
    const byFileName = filterAssetGroups(
      GROUPS,
      filter({ search: "k-lab-logo-white" }),
    );
    expect(titles(byFileName)).toEqual(["K Lab logo — reversed (white)"]);

    // Matching is plain substring, so a short format like "ai" also hits the
    // "campaign" tag; ".ai" is the term that actually means the format.
    const byFormat = filterAssetGroups(GROUPS, filter({ search: ".ai" }));
    expect(byFormat.length).toBeGreaterThan(0);
    for (const group of byFormat) {
      expect(
        group.assets.some((asset: BrandAsset) =>
          asset.file.fileName.endsWith(".ai"),
        ),
      ).toBe(true);
    }
  });

  it("matches a bare format term for formats that do not collide", () => {
    const svg = filterAssetGroups(GROUPS, filter({ search: "svg" }));
    expect(svg.length).toBeGreaterThan(0);
    for (const group of svg) {
      expect(
        group.assets.some((asset: BrandAsset) =>
          asset.file.fileName.endsWith(".svg"),
        ),
      ).toBe(true);
    }
  });

  it("ANDs the search terms rather than ORing them", () => {
    const both = filterAssetGroups(GROUPS, filter({ search: "logomark white" }));
    expect(titles(both)).toEqual(["K Lab logomark — white"]);
  });

  it("ignores surrounding and repeated whitespace", () => {
    expect(
      filterAssetGroups(GROUPS, filter({ search: "  logomark   white  " })),
    ).toEqual(filterAssetGroups(GROUPS, filter({ search: "logomark white" })));
  });

  it("narrows by category, visibility and status", () => {
    const logos = filterAssetGroups(GROUPS, filter({ category: "logos" }));
    expect(logos.length).toBeGreaterThan(0);
    for (const group of logos) expect(group.category).toBe("logos");

    const gated = filterAssetGroups(GROUPS, filter({ visibility: "employee" }));
    expect(gated.length).toBeGreaterThan(0);
    for (const group of gated) expect(group.visibility).toBe("employee");

    const active = filterAssetGroups(GROUPS, filter({ status: "active" }));
    for (const group of active) expect(group.status).toBe("active");
  });

  it("ANDs the facets together with the search", () => {
    const result = filterAssetGroups(
      GROUPS,
      filter({ search: "logo", category: "brand-imagery" }),
    );
    for (const group of result) expect(group.category).toBe("brand-imagery");
    expect(result.length).toBeLessThan(
      filterAssetGroups(GROUPS, filter({ search: "logo" })).length,
    );
  });

  it("returns nothing rather than everything when the search matches nothing", () => {
    expect(filterAssetGroups(GROUPS, filter({ search: "zzzznope" }))).toEqual([]);
  });

  it("treats ANY as no constraint on every facet", () => {
    expect(
      filterAssetGroups(
        GROUPS,
        filter({ category: ANY, visibility: ANY, status: ANY }),
      ),
    ).toHaveLength(GROUPS.length);
  });
});
