import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAssetCategory,
  type CreateBrandAssetGroupInput,
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
  readGroupFiles,
  readTags,
} from "@/lib/api/asset-group-wire";

/**
 * Mock HTTP backend — admin publish. One artwork, one request, one asset record
 * per format: the group id is minted server-side so every file of an upload
 * lands in the same group even when several requests race.
 */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  const files = isRecord(body) ? readGroupFiles(body.files) : null;
  if (
    !isRecord(body) ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.category !== "string" ||
    !isAssetCategory(body.category) ||
    !isVisibility(body.visibility) ||
    !files ||
    files.length === 0
  ) {
    return jsonError("errors.api.invalidRequest", 400);
  }

  const input: CreateBrandAssetGroupInput = {
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description : "",
    category: body.category,
    visibility: body.visibility,
    files,
    tags: readTags(body.tags) ?? [],
    createdBy:
      viewer.user?.id ??
      (typeof body.createdBy === "string" ? body.createdBy : "unknown"),
  };

  const assets = await getServerBrandAssetAdminService().createGroup(input);
  return NextResponse.json({ assets }, { status: 201 });
}
