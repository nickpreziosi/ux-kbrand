import { readFile } from "node:fs/promises";
import { normalize, resolve, sep } from "node:path";
import { NextResponse } from "next/server";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";

const BRAND_FILES_ROOT = resolve(process.cwd(), "public", "brand-files");

/**
 * Resolve a public `/brand-files/...` downloadUrl to an absolute path under
 * public/brand-files. Rejects anything that escapes that root.
 */
function resolveBrandFilePath(downloadUrl: string): string | null {
  if (!downloadUrl.startsWith("/brand-files/")) return null;
  const relative = downloadUrl.slice("/brand-files/".length);
  if (!relative || relative.includes("\0")) return null;

  const absolute = resolve(BRAND_FILES_ROOT, relative);
  const normalizedRoot = normalize(BRAND_FILES_ROOT + sep);
  if (
    absolute !== BRAND_FILES_ROOT &&
    !normalize(absolute + sep).startsWith(normalizedRoot) &&
    !absolute.startsWith(normalizedRoot)
  ) {
    return null;
  }
  // Extra guard: resolved path must still live under brand-files
  if (!absolute.startsWith(BRAND_FILES_ROOT + sep) && absolute !== BRAND_FILES_ROOT) {
    return null;
  }
  return absolute;
}

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
