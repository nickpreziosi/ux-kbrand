import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { canViewAsset } from "@/contexts/brand-assets/domain/services/asset-access";
import { filesForBulkDownload } from "@/contexts/brand-assets/domain/services/asset-filtering";
import { isRecord } from "@/contexts/shared/domain/is-record";
import { readAssetIds } from "@/lib/api/asset-group-wire";
import { resolveApiViewer } from "@/lib/api/viewer";
import { zipBrandFiles } from "@/app/api/brand-bundle/zip-brand-files";

/**
 * Zips files from many assets into one download — the library "Download
 * selected" action. Gating matches GET /api/brand-bundle/[id]: the viewer
 * must be allowed to see every selected asset. A format filter keeps just
 * that extension; otherwise every file.
 */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const body: unknown = await request.json().catch(() => null);
  const assetIds = isRecord(body) ? readAssetIds(body.assetIds) : undefined;
  if (!assetIds || assetIds.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const format =
    isRecord(body) && typeof body.format === "string" && body.format
      ? body.format.toLowerCase()
      : undefined;

  const repository = getServerBrandAssetRepository();
  const assets: BrandAsset[] = [];

  for (const id of assetIds) {
    if (id.includes("..") || id.includes("/") || id.includes("\\")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const asset = await repository.getById(id);
    if (!asset || asset.files.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!canViewAsset(viewer.role, asset)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    assets.push(asset);
  }

  const files = filesForBulkDownload(assets, format);
  if (files.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const archive = await zipBrandFiles(files);
  if (!archive) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  const filename = assets.every((asset) => asset.resourceType === "sales")
    ? "sales-resources.zip"
    : "brand-assets.zip";

  return new NextResponse(archive, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
