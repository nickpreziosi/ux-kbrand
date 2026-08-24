import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  canViewAsset,
  isAssetCategory,
  isAssetProduct,
  type UpdateBrandAssetInput,
} from "@/contexts/brand-assets/domain";
import {
  getServerBrandAssetAdminService,
  getServerBrandAssetRepository,
} from "@/contexts/brand-assets/application/brand-assets-server-services";
import {
  denyUnlessAssetManager,
  jsonError,
  resolveApiViewer,
} from "@/lib/api/viewer";
import { isRecord } from "@/contexts/shared/domain/is-record";
import {
  isVisibility,
  readAssetFiles,
  readAssetIds,
  readTags,
} from "@/lib/api/asset-group-wire";

type RouteContext = { params: Promise<{ id: string }> };

function mapKnownError(err: unknown): NextResponse {
  if (err instanceof Error && err.message === "errors.assets.notFound") {
    return jsonError(err.message, 404);
  }
  if (err instanceof Error && err.message === "errors.assets.groupEmpty") {
    return jsonError(err.message, 400);
  }
  return jsonError("errors.api.requestFailed", 500);
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const viewer = await resolveApiViewer(request);
  const asset = await getServerBrandAssetRepository().getById(id);
  // Hidden assets 404 rather than 403 — don't reveal gated ids.
  if (!asset || !canViewAsset(viewer.role, asset)) {
    return jsonError("errors.assets.notFound", 404);
  }
  return NextResponse.json({ asset });
}

/** Admin edit. `{ archived: boolean }` toggles archive; other fields update. */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return jsonError("errors.api.invalidRequest", 400);

  try {
    if (typeof body.archived === "boolean") {
      const asset = await getServerBrandAssetAdminService().setArchived(
        id,
        body.archived,
      );
      return NextResponse.json({ asset });
    }

    const addFiles =
      body.addFiles === undefined ? undefined : readAssetFiles(body.addFiles);
    if (
      addFiles === null ||
      (body.category !== undefined &&
        (typeof body.category !== "string" || !isAssetCategory(body.category))) ||
      (body.visibility !== undefined && !isVisibility(body.visibility)) ||
      (body.product !== undefined &&
        (typeof body.product !== "string" || !isAssetProduct(body.product)))
    ) {
      return jsonError("errors.api.invalidRequest", 400);
    }

    const input: UpdateBrandAssetInput = {
      title: typeof body.title === "string" ? body.title : undefined,
      description:
        typeof body.description === "string" ? body.description : undefined,
      category:
        typeof body.category === "string" && isAssetCategory(body.category)
          ? body.category
          : undefined,
      visibility: isVisibility(body.visibility) ? body.visibility : undefined,
      product:
        typeof body.product === "string" && isAssetProduct(body.product)
          ? body.product
          : undefined,
      previewUrl:
        typeof body.previewUrl === "string" ? body.previewUrl : undefined,
      tags: readTags(body.tags),
      addFiles,
      removeFileIds: readAssetIds(body.removeFileIds),
    };
    const asset = await getServerBrandAssetAdminService().update(id, input);
    return NextResponse.json({ asset });
  } catch (err) {
    return mapKnownError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  try {
    await getServerBrandAssetAdminService().remove(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return mapKnownError(err);
  }
}
