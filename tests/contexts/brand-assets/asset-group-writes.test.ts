import type {
  AssetFile,
  AssetFileInput,
  CreateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { MockBrandAssetRepository } from "@/contexts/brand-assets/infrastructure/mock/mock-brand-asset-repository";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import { fileFormat } from "@/contexts/brand-assets/domain/services/asset-files";

function file(fileName: string, sizeBytes = 100): AssetFile {
  return {
    id: fileName,
    fileName,
    contentType: "application/octet-stream",
    sizeBytes,
    storagePath: `assets/logos/${fileName}`,
    downloadUrl: `/api/uploads/upl-${fileName}`,
  };
}

function entry(fileName: string, sizeBytes = 100): AssetFileInput {
  return { file: file(fileName, sizeBytes) };
}

const CREATE: Omit<CreateBrandAssetInput, "files"> = {
  title: "Partner lockup",
  description: "Co-branded lockup for joint campaigns.",
  category: "logos",
  product: "k-lab",
  visibility: "public",
  tags: ["partner", "logo"],
  createdBy: "usr-001",
};

describe("MockBrandAssetRepository.create", () => {
  it("publishes one artwork with every format on files[]", async () => {
    const repository = new MockBrandAssetRepository(0);

    const created = await repository.create({
      ...CREATE,
      files: [entry("partner-lockup.png", 900), entry("partner-lockup.svg", 300)],
    });

    expect(created.id).toBe("partner-lockup");
    expect(created.files).toHaveLength(2);
    expect(created.files.map((item) => fileFormat(item))).toEqual(["png", "svg"]);
    expect(created.resourceType).toBe("brand");
    expect(created.product).toBe("k-lab");
  });

  it("strips format tags so they do not leak onto the artwork", async () => {
    const repository = new MockBrandAssetRepository(0);

    const created = await repository.create({
      ...CREATE,
      tags: ["partner", "logo", "png"],
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    expect(created.tags).toEqual(["partner", "logo"]);
  });

  it("does not reuse an id another artwork already holds", async () => {
    const repository = new MockBrandAssetRepository(0);

    const first = await repository.create({
      ...CREATE,
      files: [entry("a.png")],
    });
    const second = await repository.create({
      ...CREATE,
      files: [entry("b.png")],
    });

    expect(first.id).toBe("partner-lockup");
    expect(second.id).toBe("partner-lockup-2");
  });

  it("refuses an artwork with no files", async () => {
    const repository = new MockBrandAssetRepository(0);

    await expect(repository.create({ ...CREATE, files: [] })).rejects.toThrow(
      "errors.assets.groupEmpty",
    );
  });
});

describe("MockBrandAssetRepository.update", () => {
  it("adds a missing format to an artwork that already has some", async () => {
    const repository = new MockBrandAssetRepository(0);
    const seeded = SEED_BRAND_ASSETS.find((asset) => asset.files.length > 1)!;
    const before = seeded.files.length;

    const updated = await repository.update(seeded.id, {
      addFiles: [entry("late-addition.eps", 4096)],
    });

    expect(updated.files).toHaveLength(before + 1);
    expect(updated.files.some((item) => item.fileName === "late-addition.eps")).toBe(
      true,
    );
  });

  it("drops a format an admin removed", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.create({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    const updated = await repository.update(created.id, {
      removeFileIds: [created.files[1].id],
    });

    expect(updated.files).toHaveLength(1);
    expect(updated.files[0].id).toBe(created.files[0].id);
  });

  it("refuses an edit that would leave the artwork with no files", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.create({
      ...CREATE,
      files: [entry("partner-lockup.png")],
    });

    await expect(
      repository.update(created.id, { removeFileIds: [created.files[0].id] }),
    ).rejects.toThrow("errors.assets.groupEmpty");
    expect(await repository.getById(created.id)).not.toBeNull();
  });

  it("404s on an asset that does not exist", async () => {
    const repository = new MockBrandAssetRepository(0);

    await expect(repository.update("nope", { title: "x" })).rejects.toThrow(
      "errors.assets.notFound",
    );
  });
});

describe("MockBrandAssetRepository archive and delete", () => {
  it("archives and restores the artwork", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.create({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    const archived = await repository.setArchived(created.id, true);
    expect(archived.status).toBe("archived");
    expect(
      (await repository.list()).some((asset) => asset.id === created.id),
    ).toBe(false);

    const restored = await repository.setArchived(created.id, false);
    expect(restored.status).toBe("active");
  });

  it("deletes the artwork", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.create({
      ...CREATE,
      files: [entry("partner-lockup.png")],
    });

    await repository.remove(created.id);

    expect(await repository.getById(created.id)).toBeNull();
  });
});
