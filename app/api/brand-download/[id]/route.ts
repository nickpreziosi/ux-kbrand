import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { findFile } from "@/contexts/brand-assets/domain/services/asset-files";
import { getUpload } from "@/contexts/brand-assets/infrastructure/mock/server-upload-store";
import { resolveBrandFilePath } from "@/lib/brand/brand-file-path";

/**
 * Forces attachment downloads for public brand files under /public/brand-files.
 * The `[id]` is a file id (not the artwork id). Employee-gated assets require
 * a session (same visibility rules as listings).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || id.includes("..") || id.includes("/") || id.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const assets = await getServerBrandAssetRepository().list({
    includeArchived: true,
  });
  const match = findFile(assets, id);
  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (match.asset.visibility !== "public") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return streamFile(match.file);
}

async function streamFile(file: AssetFile): Promise<NextResponse> {
  const filePath = resolveBrandFilePath(file.downloadUrl);
  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const bytes = await readFile(filePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
