import { MockBrandAssetRepository } from "@/contexts/brand-assets/infrastructure/mock/mock-brand-asset-repository";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

const SEEDED = SEED_BRAND_ASSETS[0];

describe("MockBrandAssetRepository.update", () => {
  it("keeps untouched fields when a partial update carries undefined values", async () => {
    const repository = new MockBrandAssetRepository(0);

    // The mock HTTP backend fills every field of UpdateBrandAssetInput, so a
    // visibility-only edit arrives with the rest present but undefined.
    const updated = await repository.update(SEEDED.id, {
      title: undefined,
      description: undefined,
      category: undefined,
      visibility: "employee",
      file: undefined,
      previewUrl: undefined,
      tags: undefined,
    });

    expect(updated.visibility).toBe("employee");
    expect(updated.title).toBe(SEEDED.title);
    expect(updated.description).toBe(SEEDED.description);
    expect(updated.category).toBe(SEEDED.category);
    expect(updated.file).toEqual(SEEDED.file);
    expect(updated.previewUrl).toBe(SEEDED.previewUrl);
    expect(updated.tags).toEqual(SEEDED.tags);
  });

  it("still applies the fields an edit does provide", async () => {
    const repository = new MockBrandAssetRepository(0);

    const updated = await repository.update(SEEDED.id, {
      title: "Renamed asset",
      category: "brand-imagery",
    });

    expect(updated.title).toBe("Renamed asset");
    expect(updated.category).toBe("brand-imagery");
    expect(updated.visibility).toBe(SEEDED.visibility);
  });

  it("keeps the asset listed under its category after a visibility edit", async () => {
    const repository = new MockBrandAssetRepository(0);

    await repository.update(SEEDED.id, { category: undefined, visibility: "employee" });
    const inCategory = await repository.list({
      category: SEEDED.category,
      visibilities: ["public", "employee"],
    });

    expect(inCategory.map((asset) => asset.id)).toContain(SEEDED.id);
  });
});
