import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRIVATE_SEED_FILES } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { canViewAsset } from "@/contexts/brand-assets/domain";
import { resolveApiViewer } from "@/lib/api/viewer";

/**
 * Downloads for private-location files (private-assets/, outside /public).
 * Visibility comes from the mock HTTP backend's server-side store, so an
 * admin re-gating an asset takes effect immediately — no seed-only caveat.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const fileName = PRIVATE_SEED_FILES[id];
  const asset = await getServerBrandAssetRepository().getById(id);

  if (!fileName || !asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const viewer = await resolveApiViewer(request);
  if (!canViewAsset(viewer.role, asset)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const bytes = await readFile(join(process.cwd(), "private-assets", fileName));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.files[0]?.contentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
