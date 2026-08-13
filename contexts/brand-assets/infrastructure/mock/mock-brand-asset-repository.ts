import type {
  BrandAsset,
  CreateBrandAssetInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type {
  BrandAssetRepository,
  ListBrandAssetsParams,
} from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";
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
}
