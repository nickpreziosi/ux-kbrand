import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAssetCategory,
  isAssetProduct,
  visibilitiesForViewer,
  canManageAssets,
  type AssetResourceType,
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
import {
  isVisibility,
  readAssetFiles,
  readTags,
} from "@/lib/api/asset-group-wire";

function isResourceType(value: string): value is AssetResourceType {
  return value === "brand" || value === "sales";
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

  const productParam = params.get("product");
  if (productParam !== null && !isAssetProduct(productParam)) {
    return jsonError("errors.api.invalidRequest", 400);
  }

  const resourceTypeParam = params.get("resourceType");
  if (resourceTypeParam !== null && !isResourceType(resourceTypeParam)) {
    return jsonError("errors.api.invalidRequest", 400);
  }

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
    product: productParam ?? undefined,
    resourceType: resourceTypeParam ?? undefined,
    format: params.get("format") ?? undefined,
  });
  return NextResponse.json({ assets });
}

/** Admin create. File metadata arrives ready-made (see /api/uploads). */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  const files = isRecord(body) ? readAssetFiles(body.files) : null;
  if (
    !isRecord(body) ||
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.category !== "string" ||
    !isAssetCategory(body.category) ||
    typeof body.product !== "string" ||
    !isAssetProduct(body.product) ||
    !isVisibility(body.visibility) ||
    !files ||
    files.length === 0
  ) {
    return jsonError("errors.api.invalidRequest", 400);
  }

  const input: CreateBrandAssetInput = {
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description : "",
    category: body.category,
    product: body.product,
    visibility: body.visibility,
    files,
    previewUrl:
      typeof body.previewUrl === "string" && body.previewUrl
        ? body.previewUrl
        : undefined,
    tags: readTags(body.tags) ?? [],
    createdBy:
      viewer.user?.id ??
      (typeof body.createdBy === "string" ? body.createdBy : "unknown"),
  };

  const asset = await getServerBrandAssetAdminService().create(input);
  return NextResponse.json({ asset }, { status: 201 });
}
