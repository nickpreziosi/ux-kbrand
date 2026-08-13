import type {
  AssetFile,
  AssetGroupFileInput,
  CreateBrandAssetGroupInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { MockBrandAssetRepository } from "@/contexts/brand-assets/infrastructure/mock/mock-brand-asset-repository";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import {
  assetFormat,
  groupBrandAssets,
  groupMembers,
} from "@/contexts/brand-assets/domain/services/asset-grouping";

function file(fileName: string, sizeBytes = 100): AssetFile {
  return {
    fileName,
    contentType: "application/octet-stream",
    sizeBytes,
    storagePath: `assets/logos/${fileName}`,
    downloadUrl: `/api/uploads/upl-${fileName}`,
  };
}

function entry(fileName: string, sizeBytes = 100): AssetGroupFileInput {
  return { file: file(fileName, sizeBytes) };
}

const CREATE: Omit<CreateBrandAssetGroupInput, "files"> = {
  title: "Partner lockup",
  description: "Co-branded lockup for joint campaigns.",
  category: "logos",
  visibility: "public",
  tags: ["partner", "logo"],
  createdBy: "usr-001",
};

describe("MockBrandAssetRepository.createGroup", () => {
  it("publishes one record per format, all under one group id", async () => {
    const repository = new MockBrandAssetRepository(0);

    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png", 900), entry("partner-lockup.svg", 300)],
    });

    expect(created).toHaveLength(2);
    expect(new Set(created.map((asset) => asset.groupId))).toEqual(
      new Set(["partner-lockup"]),
    );
    expect(created.map((asset) => asset.id)).toEqual([
      ...new Set(created.map((asset) => asset.id)),
    ]);

    const [group] = groupBrandAssets(
      await repository.list({ category: "logos" }),
    ).filter((candidate) => candidate.id === "partner-lockup");
    expect(group.title).toBe("Partner lockup");
    expect(group.assets.map((asset) => assetFormat(asset))).toEqual([
      "png",
      "svg",
    ]);
    expect(group.totalBytes).toBe(1200);
  });

  it("titles and tags each format so a file is identifiable on its own", async () => {
    const repository = new MockBrandAssetRepository(0);

    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    expect(created.map((asset) => asset.title)).toEqual([
      "Partner lockup, PNG",
      "Partner lockup, SVG",
    ]);
    expect(created[0].tags).toEqual(["partner", "logo", "png"]);
    expect(created[1].tags).toEqual(["partner", "logo", "svg"]);
    // Group copy is denormalized so a card never has to fetch a sibling.
    expect(created.every((asset) => asset.groupTitle === "Partner lockup")).toBe(
      true,
    );
  });

  it("leaves a single-format upload with the plain artwork title", async () => {
    const repository = new MockBrandAssetRepository(0);

    const [created] = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.pdf")],
    });

    expect(created.title).toBe("Partner lockup");
    expect(created.groupId).toBe("partner-lockup");
  });

  it("does not reuse a group id another artwork already holds", async () => {
    const repository = new MockBrandAssetRepository(0);

    const first = await repository.createGroup({
      ...CREATE,
      files: [entry("a.png")],
    });
    const second = await repository.createGroup({
      ...CREATE,
      files: [entry("b.png")],
    });

    expect(first[0].groupId).toBe("partner-lockup");
    expect(second[0].groupId).toBe("partner-lockup-2");
  });

  it("refuses a group with no files", async () => {
    const repository = new MockBrandAssetRepository(0);

    await expect(
      repository.createGroup({ ...CREATE, files: [] }),
    ).rejects.toThrow("errors.assets.groupEmpty");
  });
});

describe("MockBrandAssetRepository.saveGroup", () => {
  it("adds a missing format to an artwork that already has some", async () => {
    const repository = new MockBrandAssetRepository(0);
    const seeded = SEED_BRAND_ASSETS.find((asset) => asset.groupId)!;
    const groupId = seeded.groupId!;
    const before = groupMembers(
      await repository.list({ includeArchived: true }),
      groupId,
    ).length;

    const members = await repository.saveGroup(groupId, {
      addFiles: [entry("late-addition.eps", 4096)],
    });

    expect(members).toHaveLength(before + 1);
    const added = members.find(
      (asset) => asset.file.fileName === "late-addition.eps",
    )!;
    expect(added.groupId).toBe(groupId);
    expect(added.groupTitle).toBe(seeded.groupTitle);
    expect(added.category).toBe(seeded.category);
    expect(added.visibility).toBe(seeded.visibility);
    expect(added.tags).toContain("eps");
  });

  it("promotes a lone asset into a group when a second format arrives", async () => {
    const repository = new MockBrandAssetRepository(0);
    // Pre-grouping assets carry no groupId; they group under their own id.
    const lone = await repository.create({
      title: "Legacy mark",
      description: "Uploaded before groups existed.",
      category: "logos",
      visibility: "public",
      file: file("legacy-mark.png"),
      tags: ["legacy"],
      createdBy: "usr-001",
    });

    const members = await repository.saveGroup(lone.id, {
      addFiles: [entry("legacy-mark.svg")],
    });

    expect(members).toHaveLength(2);
    expect(members.every((asset) => asset.groupId === lone.id)).toBe(true);
    expect(members.map((asset) => asset.title).sort()).toEqual([
      "Legacy mark, PNG",
      "Legacy mark, SVG",
    ]);
    expect(groupBrandAssets(await repository.list()).filter(
      (group) => group.id === lone.id,
    )).toHaveLength(1);
  });

  it("renames every format when the artwork is renamed", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    const members = await repository.saveGroup(created[0].groupId!, {
      title: "Partner lockup (2026)",
      description: "Refreshed for the new identity.",
      category: "brand-imagery",
      visibility: "employee",
      tags: ["partner"],
    });

    expect(members.map((asset) => asset.title)).toEqual([
      "Partner lockup (2026), PNG",
      "Partner lockup (2026), SVG",
    ]);
    expect(members.every((asset) => asset.category === "brand-imagery")).toBe(
      true,
    );
    expect(members.every((asset) => asset.visibility === "employee")).toBe(true);
    // The group's own tags never pick up a sibling's format marker.
    expect(members[0].tags).toEqual(["partner", "png"]);
    expect(members[1].tags).toEqual(["partner", "svg"]);
  });

  it("drops the formats an admin removed and re-titles what is left", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    const members = await repository.saveGroup(created[0].groupId!, {
      removeAssetIds: [created[1].id],
    });

    expect(members).toHaveLength(1);
    expect(members[0].id).toBe(created[0].id);
    expect(members[0].title).toBe("Partner lockup");
    expect(await repository.getById(created[1].id)).toBeNull();
  });

  it("refuses an edit that would leave the artwork with no files", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png")],
    });

    await expect(
      repository.saveGroup(created[0].groupId!, {
        removeAssetIds: [created[0].id],
      }),
    ).rejects.toThrow("errors.assets.groupEmpty");
    expect(await repository.getById(created[0].id)).not.toBeNull();
  });

  it("404s on a group that does not exist", async () => {
    const repository = new MockBrandAssetRepository(0);

    await expect(repository.saveGroup("nope", { title: "x" })).rejects.toThrow(
      "errors.assets.notFound",
    );
  });
});

describe("MockBrandAssetRepository group archive and delete", () => {
  it("archives and restores every format at once", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });
    const groupId = created[0].groupId!;

    const archived = await repository.setGroupArchived(groupId, true);
    expect(archived.every((asset) => asset.status === "archived")).toBe(true);
    expect(
      groupMembers(await repository.list(), groupId),
    ).toHaveLength(0);

    const restored = await repository.setGroupArchived(groupId, false);
    expect(restored.every((asset) => asset.status === "active")).toBe(true);
  });

  it("deletes every format of the artwork", async () => {
    const repository = new MockBrandAssetRepository(0);
    const created = await repository.createGroup({
      ...CREATE,
      files: [entry("partner-lockup.png"), entry("partner-lockup.svg")],
    });

    await repository.removeGroup(created[0].groupId!);

    const remaining = await repository.list({ includeArchived: true });
    expect(remaining.some((asset) => asset.groupId === "partner-lockup")).toBe(
      false,
    );
  });
});
