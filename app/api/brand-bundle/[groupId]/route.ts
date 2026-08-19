import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { canViewAsset } from "@/contexts/brand-assets/domain/services/asset-access";
import { sortedFiles } from "@/contexts/brand-assets/domain/services/asset-files";
import { resolveApiViewer } from "@/lib/api/viewer";
import { zipBrandFiles } from "@/app/api/brand-bundle/zip-brand-files";

/**
 * Zips every format of an asset into one download — the "Download all"
 * action on a catalog card. Gating matches /api/brand-download: the viewer
 * must be allowed to see the asset.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;
  if (!groupId || groupId.includes("..") || groupId.includes("/") || groupId.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const asset = await getServerBrandAssetRepository().getById(groupId);
  if (!asset || asset.files.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const viewer = await resolveApiViewer(request);
  if (!canViewAsset(viewer.role, asset)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const archive = await zipBrandFiles(sortedFiles(asset.files));
  if (!archive) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  return new NextResponse(archive, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${groupId}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
