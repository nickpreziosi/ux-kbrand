import type { AssetCategory } from "@/contexts/brand-assets/domain/models/asset-category.model";
import type { AssetFileDraft } from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * Sends the chosen file to the mock HTTP backend (admin-gated) and returns the
 * AssetFile metadata pointing at the served bytes (/api/uploads/[id]).
 */
export async function uploadAssetFile(
  file: File,
  category: AssetCategory,
): Promise<AssetFileDraft> {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    let key = "errors.api.requestFailed";
    try {
      const payload = (await res.json()) as { error?: unknown };
      if (typeof payload.error === "string") key = payload.error;
    } catch {
      // Non-JSON error body — keep the generic key.
    }
    throw new Error(key);
  }

  const { file: assetFile } = (await res.json()) as { file: AssetFileDraft };
  return assetFile;
}
