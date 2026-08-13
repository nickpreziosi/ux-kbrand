import type {
  AssetGroupFileInput,
  BrandAsset,
  CreateBrandAssetGroupInput,
  CreateBrandAssetInput,
  SaveBrandAssetGroupInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type {
  BrandAssetRepository,
  ListBrandAssetsParams,
} from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";
import {
  groupKey,
  makeGroupId,
  memberTitle,
  withFormatTag,
  withoutFormatTags,
} from "@/contexts/brand-assets/domain/services/asset-grouping";
import { SEED_BRAND_ASSETS } from "./seed-assets";

const MOCK_LATENCY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Partial updates arrive with untouched fields present but undefined — merging
 *  those as-is would blank the stored values. */
function definedOnly<T extends object>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/**
 * In-memory catalog seeded from SEED_BRAND_ASSETS. Mutations survive client
 * navigation (module scope) but reset on reload — enough for the prototype.
 * A FirestoreBrandAssetRepository will replace this behind the same interface.
 */
export class MockBrandAssetRepository implements BrandAssetRepository {
  private assets: BrandAsset[] = clone(SEED_BRAND_ASSETS);
  private sequence = 0;

  /** Server-side (mock HTTP backend) passes 0 — the network already adds latency. */
  constructor(private readonly latencyMs: number = MOCK_LATENCY_MS) {}

  async list(params?: ListBrandAssetsParams): Promise<BrandAsset[]> {
    await delay(this.latencyMs);
    return clone(
      this.assets.filter((asset) => {
        if (!params?.includeArchived && asset.status === "archived") return false;
        if (params?.category && asset.category !== params.category) return false;
        if (params?.visibilities && !params.visibilities.includes(asset.visibility)) return false;
        return true;
      }),
    );
  }

  async getById(id: string): Promise<BrandAsset | null> {
    await delay(this.latencyMs);
    const asset = this.assets.find((a) => a.id === id);
    return asset ? clone(asset) : null;
  }

  async create(input: CreateBrandAssetInput): Promise<BrandAsset> {
    await delay(this.latencyMs);
    const now = new Date().toISOString();
    const asset: BrandAsset = {
      id: `ast-local-${++this.sequence}-${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      visibility: input.visibility,
      status: "active",
      file: input.file,
      previewUrl: input.previewUrl,
      groupId: input.groupId,
      groupTitle: input.groupTitle,
      groupDescription: input.groupDescription,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    };
    this.assets = [asset, ...this.assets];
    return clone(asset);
  }

  async update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset> {
    await delay(this.latencyMs);
    const existing = this.assets.find((a) => a.id === id);
    if (!existing) throw new Error("errors.assets.notFound");
    const updated: BrandAsset = {
      ...existing,
      ...definedOnly(input),
      updatedAt: new Date().toISOString(),
    };
    this.assets = this.assets.map((a) => (a.id === id ? updated : a));
    return clone(updated);
  }

  async setArchived(id: string, archived: boolean): Promise<BrandAsset> {
    await delay(this.latencyMs);
    const existing = this.assets.find((a) => a.id === id);
    if (!existing) throw new Error("errors.assets.notFound");
    const updated: BrandAsset = {
      ...existing,
      status: archived ? "archived" : "active",
      updatedAt: new Date().toISOString(),
    };
    this.assets = this.assets.map((a) => (a.id === id ? updated : a));
    return clone(updated);
  }

  async remove(id: string): Promise<void> {
    await delay(this.latencyMs);
    if (!this.assets.some((a) => a.id === id)) {
      throw new Error("errors.assets.notFound");
    }
    this.assets = this.assets.filter((a) => a.id !== id);
  }

  async createGroup(input: CreateBrandAssetGroupInput): Promise<BrandAsset[]> {
    await delay(this.latencyMs);
    if (input.files.length === 0) throw new Error("errors.assets.groupEmpty");

    const groupId = makeGroupId(input.title, this.assets.map(groupKey));
    const created = input.files.map((entry) =>
      this.buildMember(entry, {
        groupId,
        groupTitle: input.title,
        groupDescription: input.description,
        category: input.category,
        visibility: input.visibility,
        tags: input.tags ?? [],
        createdBy: input.createdBy,
        multiFormat: input.files.length > 1,
      }),
    );

    this.assets = [...created, ...this.assets];
    return clone(created);
  }

  /**
   * One transaction over a whole group: shared metadata, added formats, dropped
   * formats. Member titles and format tags are re-derived from the result, so a
   * rename or a new format can never leave the set inconsistent.
   */
  async saveGroup(
    groupId: string,
    input: SaveBrandAssetGroupInput,
  ): Promise<BrandAsset[]> {
    await delay(this.latencyMs);
    const members = this.assets.filter((a) => groupKey(a) === groupId);
    if (members.length === 0) throw new Error("errors.assets.notFound");

    const removing = new Set(input.removeAssetIds ?? []);
    const kept = members.filter((a) => !removing.has(a.id));
    const addFiles = input.addFiles ?? [];
    if (kept.length + addFiles.length === 0) {
      throw new Error("errors.assets.groupEmpty");
    }

    const [primary] = members;
    const title = input.title?.trim() || primary.groupTitle || primary.title;
    const description =
      input.description ?? primary.groupDescription ?? primary.description;
    const category = input.category ?? primary.category;
    const visibility = input.visibility ?? primary.visibility;
    const files = [...kept.map((a) => a.file), ...addFiles.map((f) => f.file)];
    const tags = withoutFormatTags(
      input.tags ?? primary.tags,
      files.map((file) => ({ file })),
    );
    const multiFormat = files.length > 1;
    const now = new Date().toISOString();

    const updated = new Map(
      kept.map((asset) => [
        asset.id,
        {
          ...asset,
          title: memberTitle(title, asset.file.fileName, multiFormat),
          description: asset.description,
          category,
          visibility,
          groupId,
          groupTitle: title,
          groupDescription: description,
          tags: withFormatTag(tags, asset.file.fileName),
          updatedAt: now,
        } satisfies BrandAsset,
      ]),
    );

    const added = addFiles.map((entry) =>
      this.buildMember(entry, {
        groupId,
        groupTitle: title,
        groupDescription: description,
        category,
        visibility,
        tags,
        createdBy: input.createdBy ?? primary.createdBy,
        multiFormat,
        // Formats joining an archived group stay in step with it.
        status: kept.every((a) => a.status === "archived") && kept.length > 0
          ? "archived"
          : "active",
      }),
    );

    // Keep the group where it sits in the catalog: members are replaced in
    // place and new formats land right after the last surviving one.
    const lastIndex = this.assets.reduce(
      (index, asset, at) => (groupKey(asset) === groupId ? at : index),
      -1,
    );
    const next: BrandAsset[] = [];
    this.assets.forEach((asset, index) => {
      if (groupKey(asset) === groupId) {
        const member = updated.get(asset.id);
        if (member) next.push(member);
      } else {
        next.push(asset);
      }
      if (index === lastIndex) next.push(...added);
    });
    this.assets = next;

    return clone(this.assets.filter((a) => groupKey(a) === groupId));
  }

  async setGroupArchived(
    groupId: string,
    archived: boolean,
  ): Promise<BrandAsset[]> {
    await delay(this.latencyMs);
    const members = this.assets.filter((a) => groupKey(a) === groupId);
    if (members.length === 0) throw new Error("errors.assets.notFound");

    const now = new Date().toISOString();
    this.assets = this.assets.map((asset) =>
      groupKey(asset) === groupId
        ? {
            ...asset,
            status: archived ? "archived" : "active",
            updatedAt: now,
          }
        : asset,
    );
    return clone(this.assets.filter((a) => groupKey(a) === groupId));
  }

  async removeGroup(groupId: string): Promise<void> {
    await delay(this.latencyMs);
    if (!this.assets.some((a) => groupKey(a) === groupId)) {
      throw new Error("errors.assets.notFound");
    }
    this.assets = this.assets.filter((a) => groupKey(a) !== groupId);
  }

  private buildMember(
    entry: AssetGroupFileInput,
    shared: {
      groupId: string;
      groupTitle: string;
      groupDescription: string;
      category: BrandAsset["category"];
      visibility: BrandAsset["visibility"];
      tags: string[];
      createdBy: string;
      multiFormat: boolean;
      status?: BrandAsset["status"];
    },
  ): BrandAsset {
    const now = new Date().toISOString();
    return {
      id: `ast-local-${++this.sequence}-${Date.now()}`,
      title: memberTitle(
        shared.groupTitle,
        entry.file.fileName,
        shared.multiFormat,
      ),
      description: shared.groupDescription,
      category: shared.category,
      visibility: shared.visibility,
      status: shared.status ?? "active",
      file: entry.file,
      previewUrl: entry.previewUrl || undefined,
      groupId: shared.groupId,
      groupTitle: shared.groupTitle,
      groupDescription: shared.groupDescription,
      tags: withFormatTag(shared.tags, entry.file.fileName),
      createdAt: now,
      updatedAt: now,
      createdBy: shared.createdBy,
    };
  }
}
