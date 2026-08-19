import { NextResponse } from "next/server";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { sortedFiles } from "@/contexts/brand-assets/domain/services/asset-files";
import { zipBrandFiles } from "@/app/api/brand-bundle/zip-brand-files";

/**
 * Zips every format of an asset into one download — the "Download all"
 * action on a catalog card. Gating matches /api/brand-download.
 */
export async function GET(
  _request: Request,
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

  if (asset.visibility !== "public") {
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