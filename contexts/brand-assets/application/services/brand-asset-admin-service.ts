import type {
  BrandAsset,
  CreateBrandAssetGroupInput,
  CreateBrandAssetInput,
  SaveBrandAssetGroupInput,
  UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  isSalesCategory,
  resolveVisibilityForCategory,
} from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { BrandAssetRepository } from "@/contexts/brand-assets/domain/repositories/brandAssetRepository.interface";
import { groupMembers } from "@/contexts/brand-assets/domain/services/asset-grouping";

/** Write side of the catalog — admin create / edit / replace / archive / delete. */
export class BrandAssetAdminService {
  constructor(private readonly assets: BrandAssetRepository) {}

  /** Full catalog including archived assets, for the admin table. */
  listAll(): Promise<BrandAsset[]> {
    return this.assets.list({ includeArchived: true });
  }

  create(input: CreateBrandAssetInput): Promise<BrandAsset> {
    return this.assets.create({
      ...input,
      visibility: resolveVisibilityForCategory(input.category, input.visibility),
    });
  }

  /**
   * Applies the sales-category gating invariant to the asset as it will be
   * *after* the edit: moving one into a sales category gates it, and a sales
   * asset can never be published. Reads the stored asset only when the edit
   * could lift gating without naming a category.
   */
  async update(id: string, input: UpdateBrandAssetInput): Promise<BrandAsset> {
    if (input.category) {
      // Moving into a sales category gates the asset even when the edit says
      // nothing about visibility; moving elsewhere leaves gating untouched.
      return this.assets.update(id, {
        ...input,
        visibility: isSalesCategory(input.category)
          ? "employee"
          : input.visibility,
      });
    }

    if (input.visibility === "public") {
      const current = await this.assets.getById(id);
      if (current) {
        return this.assets.update(id, {
          ...input,
          visibility: resolveVisibilityForCategory(current.category, "public"),
        });
      }
    }

    return this.assets.update(id, input);
  }

  /** Quick gating switch — who may view/download the asset. */
  setVisibility(id: string, visibility: BrandAsset["visibility"]): Promise<BrandAsset> {
    return this.update(id, { visibility });
  }

  setArchived(id: string, archived: boolean): Promise<BrandAsset> {
    return this.assets.setArchived(id, archived);
  }

  remove(id: string): Promise<void> {
    return this.assets.remove(id);
  }

  /** Publishes one artwork in every format it was uploaded with. */
  createGroup(input: CreateBrandAssetGroupInput): Promise<BrandAsset[]> {
    return this.assets.createGroup({
      ...input,
      visibility: resolveVisibilityForCategory(input.category, input.visibility),
    });
  }

  /**
   * Group edit — same sales-gating invariant as {@link update}, applied to the
   * group as it will be after the edit, so adding a format or renaming an
   * artwork can never quietly publish a sales resource.
   */
  async saveGroup(
    groupId: string,
    input: SaveBrandAssetGroupInput,
  ): Promise<BrandAsset[]> {
    if (input.category) {
      return this.assets.saveGroup(groupId, {
        ...input,
        visibility: isSalesCategory(input.category)
          ? "employee"
          : input.visibility,
      });
    }

    if (input.visibility === "public") {
      const members = groupMembers(
        await this.assets.list({ includeArchived: true }),
        groupId,
      );
      const [primary] = members;
      if (primary) {
        return this.assets.saveGroup(groupId, {
          ...input,
          visibility: resolveVisibilityForCategory(primary.category, "public"),
        });
      }
    }

    return this.assets.saveGroup(groupId, input);
  }

  setGroupVisibility(
    groupId: string,
    visibility: BrandAsset["visibility"],
  ): Promise<BrandAsset[]> {
    return this.saveGroup(groupId, { visibility });
  }

  setGroupArchived(groupId: string, archived: boolean): Promise<BrandAsset[]> {
    return this.assets.setGroupArchived(groupId, archived);
  }

  removeGroup(groupId: string): Promise<void> {
    return this.assets.removeGroup(groupId);
  }
}
