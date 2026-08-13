import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAssetCategory,
  type SaveBrandAssetGroupInput,
} from "@/contexts/brand-assets/domain";
import { getServerBrandAssetAdminService } from "@/contexts/brand-assets/application/brand-assets-server-services";
import {
  denyUnlessAssetManager,
  jsonError,
  resolveApiViewer,
} from "@/lib/api/viewer";
import { isRecord } from "@/contexts/shared/domain/is-record";
import {
  isVisibility,
  readAssetIds,
  readGroupFiles,
  readTags,
} from "@/lib/api/asset-group-wire";

type RouteContext = { params: Promise<{ groupId: string }> };

function mapKnownError(err: unknown): NextResponse {
  if (err instanceof Error && err.message === "errors.assets.notFound") {
    return jsonError(err.message, 404);
  }
  // Emptying a group is a client bug, not a server failure — the form keeps at
  // least one file, so a 400 says which side to fix.
  if (err instanceof Error && err.message === "errors.assets.groupEmpty") {
    return jsonError(err.message, 400);
  }
  return jsonError("errors.api.requestFailed", 500);
}

/**
 * Admin group edit. `{ archived: boolean }` toggles the whole group; otherwise
 * shared metadata, added formats and removed formats are applied together so
 * the group's files never disagree about title, category or gating.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { groupId } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return jsonError("errors.api.invalidRequest", 400);

  try {
    if (typeof body.archived === "boolean") {
      const assets = await getServerBrandAssetAdminService().setGroupArchived(
        groupId,
        body.archived,
      );
      return NextResponse.json({ assets });
    }

    const addFiles =
      body.addFiles === undefined ? undefined : readGroupFiles(body.addFiles);
    if (
      addFiles === null ||
      (body.category !== undefined &&
        (typeof body.category !== "string" || !isAssetCategory(body.category))) ||
      (body.visibility !== undefined && !isVisibility(body.visibility))
    ) {
      return jsonError("errors.api.invalidRequest", 400);
    }

    const input: SaveBrandAssetGroupInput = {
      title: typeof body.title === "string" ? body.title : undefined,
      description:
        typeof body.description === "string" ? body.description : undefined,
      category:
        typeof body.category === "string" && isAssetCategory(body.category)
          ? body.category
          : undefined,
      visibility: isVisibility(body.visibility) ? body.visibility : undefined,
      tags: readTags(body.tags),
      addFiles,
      removeAssetIds: readAssetIds(body.removeAssetIds),
      createdBy: viewer.user?.id,
    };

    const assets = await getServerBrandAssetAdminService().saveGroup(
      groupId,
      input,
    );
    return NextResponse.json({ assets });
  } catch (err) {
    return mapKnownError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { groupId } = await params;
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  try {
    await getServerBrandAssetAdminService().removeGroup(groupId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return mapKnownError(err);
  }
}
