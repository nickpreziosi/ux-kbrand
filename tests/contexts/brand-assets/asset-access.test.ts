import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  canManageAssets,
  canManageUsers,
  canSeeAssetGating,
  canSeeSalesSection,
  canViewAsset,
  visibilitiesForViewer,
} from "@/contexts/brand-assets/domain/services/asset-access";
import { isSalesCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

function assetWithVisibility(visibility: BrandAsset["visibility"]): BrandAsset {
  return { ...SEED_BRAND_ASSETS[0], visibility };
}

describe("asset-access", () => {
  it("public viewers see only public assets", () => {
    expect(visibilitiesForViewer("public")).toEqual(["public"]);
    expect(canViewAsset("public", assetWithVisibility("public"))).toBe(true);
    expect(canViewAsset("public", assetWithVisibility("employee"))).toBe(false);
  });

  it.each(["employee", "admin"] as const)(
    "%s viewers see public and employee assets",
    (role) => {
      expect(visibilitiesForViewer(role)).toEqual(["public", "employee"]);
      expect(canViewAsset(role, assetWithVisibility("public"))).toBe(true);
      expect(canViewAsset(role, assetWithVisibility("employee"))).toBe(true);
    },
  );

  it("hides the Sales section and gating badges from public viewers only", () => {
    expect(canSeeSalesSection("public")).toBe(false);
    expect(canSeeAssetGating("public")).toBe(false);
    for (const role of ["employee", "admin"] as const) {
      expect(canSeeSalesSection(role)).toBe(true);
      expect(canSeeAssetGating(role)).toBe(true);
    }
  });

  it("restricts asset and user management to admins", () => {
    expect(canManageAssets("admin")).toBe(true);
    expect(canManageUsers("admin")).toBe(true);
    for (const role of ["public", "employee"] as const) {
      expect(canManageAssets(role)).toBe(false);
      expect(canManageUsers(role)).toBe(false);
    }
  });

  // Sales categories are employee-only by domain rule; the rest of the seed
  // catalog is public-first. See sales-privacy.test.ts for the invariant.
  it("seeds every brand asset as public and every sales asset as employee", () => {
    expect(SEED_BRAND_ASSETS.length).toBeGreaterThan(0);
    for (const asset of SEED_BRAND_ASSETS) {
      expect(asset.visibility).toBe(
        isSalesCategory(asset.category) ? "employee" : "public",
      );
    }
  });
});
