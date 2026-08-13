import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAssetCategory,
  isAssetFile,
  visibilitiesForViewer,
  canManageAssets,
  type AssetVisibility,
  type CreateBrandAssetInput,
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

function isVisibility(value: unknown): value is AssetVisibility {
  return value === "public" || value === "employee";
}

/**
 * Mock HTTP backend — catalog listing. The viewer's session decides which
 * visibilities are actually returned: requested visibilities are intersected
 * with what the role allows, so an anonymous caller can never pull
 * employee-gated assets no matter what the query string says.
 */
export async function GET(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const params = request.nextUrl.searchParams;

  const categoryParam = params.get("category");
  if (categoryParam !== null && !isAssetCategory(categoryParam)) {
    return jsonError("errors.api.invalidRequest", 400);
  }
  const category = categoryParam ?? undefined;

  const includeArchived = params.get("includeArchived") === "true";
  if (includeArchived && !canManageAssets(viewer.role)) {
    const denied = denyUnlessAssetManager(viewer);
    if (denied) return denied;
  }

  const allowed = visibilitiesForViewer(viewer.role);
  const requested = params.get("visibilities")?.split(",").filter(isVisibility);
  const visibilities = requested
    ? requested.filter((v) => allowed.includes(v))
    : allowed;

  const assets = await getServerBrandAssetRepository().list({
    category,
    visibilities,
    includeArchived,
  });
  return NextResponse.json({ assets });
}

/** Admin create. The file metadata arrives ready-made (see /api/uploads). */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (
    !isRecord(body) ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.category !== "string" ||
    !isAssetCategory(body.category) ||
    !isVisibility(body.visibility) ||
    !isAssetFile(body.file)
  ) {
    return jsonError("errors.api.invalidRequest", 400);
  }

  const input: CreateBrandAssetInput = {
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description : "",
    category: body.category,
    visibility: body.visibility,
    file: body.file,
    // "" means "no preview" on create — there is nothing to clear yet.
    previewUrl:
      typeof body.previewUrl === "string" && body.previewUrl
        ? body.previewUrl
        : undefined,
    tags: Array.isArray(body.tags)
      ? body.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    createdBy:
      viewer.user?.id ??
      (typeof body.createdBy === "string" ? body.createdBy : "unknown"),
  };

  const asset = await getServerBrandAssetAdminService().create(input);
  return NextResponse.json({ asset }, { status: 201 });
}
