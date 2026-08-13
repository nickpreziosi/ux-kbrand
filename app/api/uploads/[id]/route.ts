import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canViewAsset } from "@/contexts/brand-assets/domain";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import {
  getUpload,
  uploadDownloadUrl,
} from "@/contexts/brand-assets/infrastructure/mock/server-upload-store";
import { jsonError, resolveApiViewer } from "@/lib/api/viewer";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Serves bytes for admin-uploaded files. Gating follows the owning asset's
 * live visibility; uploads not (yet) linked to an asset stay signed-in only.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const upload = getUpload(id);
  if (!upload) return jsonError("errors.assets.notFound", 404);

  const viewer = await resolveApiViewer(request);
  const url = uploadDownloadUrl(id);
  const owner = (
    await getServerBrandAssetRepository().list({ includeArchived: true })
  ).find((asset) => asset.file.downloadUrl === url);

  const allowed = owner
    ? canViewAsset(viewer.role, owner)
    : viewer.role !== "public";
  if (!allowed) return jsonError("errors.api.unauthorized", 401);

  const isImage = upload.contentType.startsWith("image/");
  return new NextResponse(new Uint8Array(upload.bytes), {
    headers: {
      "Content-Type": upload.contentType,
      "Content-Disposition": `${isImage ? "inline" : "attachment"}; filename="${upload.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
