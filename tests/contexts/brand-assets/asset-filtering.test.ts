import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  ANY,
  EMPTY_ASSET_CATALOG_FILTER,
  filterCatalogAssets,
  hasActiveAssetCatalogFilter,
  type AssetCatalogFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

function filter(partial: Partial<AssetCatalogFilter> = {}): AssetCatalogFilter {
  return { ...EMPTY_ASSET_CATALOG_FILTER, ...partial };
}

function titles(assets: BrandAsset[]): string[] {
  return assets.map((asset) => asset.title);
}

describe("hasActiveAssetCatalogFilter", () => {
  it("is inactive by default and for whitespace-only search", () => {
    expect(hasActiveAssetCatalogFilter(EMPTY_ASSET_CATALOG_FILTER)).toBe(false);
    expect(hasActiveAssetCatalogFilter(filter({ search: "   " }))).toBe(false);
  });

  it("is active once any facet narrows", () => {
    expect(hasActiveAssetCatalogFilter(filter({ search: "logo" }))).toBe(true);
    expect(hasActiveAssetCatalogFilter(filter({ category: "logos" }))).toBe(true);
    expect(hasActiveAssetCatalogFilter(filter({ visibility: "employee" }))).toBe(
      true,
    );
    expect(hasActiveAssetCatalogFilter(filter({ status: "archived" }))).toBe(true);
  });
});

describe("filterCatalogAssets", () => {
  it("returns everything when nothing is set", () => {
    expect(
      filterCatalogAssets(SEED_BRAND_ASSETS, EMPTY_ASSET_CATALOG_FILTER),
    ).toHaveLength(SEED_BRAND_ASSETS.length);
  });

  it("matches the artwork title, case-insensitively", () => {
    expect(
      titles(filterCatalogAssets(SEED_BRAND_ASSETS, filter({ search: "LOGOMARK" }))),
    ).toEqual(
      expect.arrayContaining(["K Lab logomark", "K Lab logomark — white"]),
    );
  });

  it("reaches the file names and formats folded inside a row", () => {
    const byFileName = filterCatalogAssets(
      SEED_BRAND_ASSETS,
      filter({ search: "k-lab-logo-white" }),
    );
    expect(titles(byFileName)).toEqual(["K Lab logo — reversed (white)"]);

    const byFormat = filterCatalogAssets(SEED_BRAND_ASSETS, filter({ search: ".ai" }));
    expect(byFormat.length).toBeGreaterThan(0);
    for (const asset of byFormat) {
      expect(asset.files.some((file) => file.fileName.endsWith(".ai"))).toBe(true);
    }
  });

  it("matches a bare format term for formats that do not collide", () => {
    const svg = filterCatalogAssets(SEED_BRAND_ASSETS, filter({ search: "svg" }));
    expect(svg.length).toBeGreaterThan(0);
    for (const asset of svg) {
      expect(asset.files.some((file) => file.fileName.endsWith(".svg"))).toBe(true);
    }
  });

  it("ANDs the search terms rather than ORing them", () => {
    const both = filterCatalogAssets(
      SEED_BRAND_ASSETS,
      filter({ search: "logomark white" }),
    );
    expect(titles(both)).toEqual(["K Lab logomark — white"]);
  });

  it("narrows by category, visibility and status", () => {
    const logos = filterCatalogAssets(SEED_BRAND_ASSETS, filter({ category: "logos" }));
    expect(logos.length).toBeGreaterThan(0);
    for (const asset of logos) expect(asset.category).toBe("logos");

    const gated = filterCatalogAssets(
      SEED_BRAND_ASSETS,
      filter({ visibility: "employee" }),
    );
    expect(gated.length).toBeGreaterThan(0);
    for (const asset of gated) expect(asset.visibility).toBe("employee");

    const active = filterCatalogAssets(
      SEED_BRAND_ASSETS,
      filter({ status: "active" }),
    );
    for (const asset of active) expect(asset.status).toBe("active");
  });

  it("returns nothing rather than everything when the search matches nothing", () => {
    expect(
      filterCatalogAssets(SEED_BRAND_ASSETS, filter({ search: "zzzznope" })),
    ).toEqual([]);
  });

  it("treats ANY as no constraint on every facet", () => {
    expect(
      filterCatalogAssets(
        SEED_BRAND_ASSETS,
        filter({ category: ANY, visibility: ANY, status: ANY }),
      ),
    ).toHaveLength(SEED_BRAND_ASSETS.length);
  });
});
