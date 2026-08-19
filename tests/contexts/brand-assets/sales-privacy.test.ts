import { BrandAssetAdminService } from "@/contexts/brand-assets/application/services/brand-asset-admin-service";
import { BrandAssetCatalogService } from "@/contexts/brand-assets/application/services/brand-asset-catalog-service";
import {
  SALES_CATEGORIES,
  defaultVisibilityForCategory,
  isSalesCategory,
  resolveVisibilityForCategory,
  ASSET_CATEGORIES,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import { MockBrandAssetRepository } from "@/contexts/brand-assets/infrastructure/mock/mock-brand-asset-repository";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import type { CreateBrandAssetInput } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const file = {
  id: "fil-deck",
  fileName: "deck.pdf",
  contentType: "application/pdf",
  sizeBytes: 10,
  storagePath: "assets/pitch-decks/deck.pdf",
  downloadUrl: "/api/sales-files/new",
};

function createInput(
  overrides: Partial<CreateBrandAssetInput> = {},
): CreateBrandAssetInput {
  return {
    title: "New deck",
    description: "",
    category: "pitch-decks",
    product: "k-lab",
    visibility: "public",
    files: [{ file }],
    tags: [],
    createdBy: "usr-001",
    ...overrides,
  };
}

describe("resolveVisibilityForCategory", () => {
  it("forces every sales category to employee, whatever is asked for", () => {
    for (const category of SALES_CATEGORIES) {
      expect(resolveVisibilityForCategory(category, "public")).toBe("employee");
      expect(resolveVisibilityForCategory(category, "employee")).toBe("employee");
      expect(defaultVisibilityForCategory(category)).toBe("employee");
    }
  });

  it("leaves brand categories on the requested visibility", () => {
    for (const category of ASSET_CATEGORIES.filter((c) => !isSalesCategory(c))) {
      expect(resolveVisibilityForCategory(category, "public")).toBe("public");
      expect(resolveVisibilityForCategory(category, "employee")).toBe("employee");
      expect(defaultVisibilityForCategory(category)).toBe("public");
    }
  });
});

describe("seeded sales assets", () => {
  it("gates every sales-category asset behind employee auth", () => {
    const sales = SEED_BRAND_ASSETS.filter((asset) => isSalesCategory(asset.category));

    expect(sales.length).toBeGreaterThan(0);
    for (const asset of sales) {
      expect(asset.visibility).toBe("employee");
    }
  });

  it("keeps the generated catalog in step with the domain rule", () => {
    for (const asset of SEED_BRAND_ASSETS) {
      expect(asset.visibility).toBe(
        resolveVisibilityForCategory(asset.category, asset.visibility),
      );
    }
  });

  it("still leaves brand assets public", () => {
    const brand = SEED_BRAND_ASSETS.filter((asset) => !isSalesCategory(asset.category));

    expect(brand.every((asset) => asset.visibility === "public")).toBe(true);
  });
});

describe("BrandAssetAdminService gating invariant", () => {
  let repository: MockBrandAssetRepository;
  let service: BrandAssetAdminService;

  beforeEach(() => {
    repository = new MockBrandAssetRepository(0);
    service = new BrandAssetAdminService(repository);
  });

  it("gates a sales asset created as public", async () => {
    const asset = await service.create(createInput());

    expect(asset.visibility).toBe("employee");
  });

  it("honours the requested visibility for brand assets", async () => {
    const asset = await service.create(
      createInput({ category: "logos", visibility: "public" }),
    );

    expect(asset.visibility).toBe("public");
  });

  it("refuses to publish an existing sales asset", async () => {
    const created = await service.create(createInput());

    const updated = await service.update(created.id, { visibility: "public" });

    expect(updated.visibility).toBe("employee");
  });

  it("refuses to publish through the visibility shortcut", async () => {
    const created = await service.create(createInput());

    const updated = await service.setVisibility(created.id, "public");

    expect(updated.visibility).toBe("employee");
  });

  it("gates an asset moved into a sales category, even silently", async () => {
    const created = await service.create(
      createInput({ category: "logos", visibility: "public" }),
    );

    const updated = await service.update(created.id, { category: "sales-materials" });

    expect(updated.visibility).toBe("employee");
  });

  it("leaves gating alone when an edit is not about gating", async () => {
    const created = await service.create(
      createInput({ category: "logos", visibility: "employee" }),
    );

    const renamed = await service.update(created.id, { title: "Renamed" });
    expect(renamed.visibility).toBe("employee");

    const recategorized = await service.update(created.id, { category: "fonts" });
    expect(recategorized.visibility).toBe("employee");
  });

  it("lets a brand asset be published normally", async () => {
    const created = await service.create(
      createInput({ category: "logos", visibility: "employee" }),
    );

    const updated = await service.update(created.id, { visibility: "public" });

    expect(updated.visibility).toBe("public");
  });
});

describe("catalog listings for anonymous visitors", () => {
  it("returns no sales assets to a public viewer", async () => {
    const catalog = new BrandAssetCatalogService(new MockBrandAssetRepository(0));

    for (const category of SALES_CATEGORIES) {
      expect(await catalog.listCategory(category, "public")).toEqual([]);
    }

    const grouped = await catalog.listSalesAssets("public");
    expect(Object.values(grouped).flat()).toEqual([]);
  });

  it("keeps the brand library free of sales and employee-gated assets", async () => {
    const repository = new MockBrandAssetRepository(0);
    const catalog = new BrandAssetCatalogService(repository);
    const [logo] = await repository.list({ category: "logos" });
    await repository.update(logo.id, { visibility: "employee" });

    const library = await catalog.listLibrary("public", {
      search: "",
      category: "all",
      format: "all",
      product: "all",
      resourceType: "brand",
    });

    expect(library.length).toBeGreaterThan(0);
    expect(library.every((asset) => asset.resourceType === "brand")).toBe(true);
    expect(library.every((asset) => asset.visibility === "public")).toBe(true);
    expect(library.map((asset) => asset.id)).not.toContain(logo.id);
  });

  it("returns them to employees and admins", async () => {
    const catalog = new BrandAssetCatalogService(new MockBrandAssetRepository(0));

    for (const role of ["employee", "admin"] as const) {
      const grouped = await catalog.listSalesAssets(role);
      expect(Object.values(grouped).flat().length).toBeGreaterThan(0);
    }
  });
});
