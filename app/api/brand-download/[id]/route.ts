import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { resolveBrandFilePath } from "@/lib/brand/brand-file-path";

/**
 * Forces attachment downloads for public brand files under /public/brand-files.
 * Employee-gated assets require a session (same visibility rules as listings).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || id.includes("..") || id.includes("/") || id.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const asset = await getServerBrandAssetRepository().getById(id);
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (asset.visibility !== "public") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const filePath = resolveBrandFilePath(asset.file.downloadUrl);
  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const bytes = await readFile(filePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.file.contentType,
        "Content-Disposition": `attachment; filename="${asset.file.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
