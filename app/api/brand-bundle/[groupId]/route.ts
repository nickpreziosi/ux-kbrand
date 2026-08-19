import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { getServerBrandAssetRepository } from "@/contexts/brand-assets/application/brand-assets-server-services";
import { getUpload } from "@/contexts/brand-assets/infrastructure/mock/server-upload-store";
import { resolveBrandFilePath } from "@/lib/brand/brand-file-path";
import { createZip, type ZipEntry } from "@/lib/zip/create-zip";
import { sortedFiles } from "@/contexts/brand-assets/domain/services/asset-files";

/**
 * A file's bytes can come from two places: files shipped under
 * public/brand-files, and admin uploads held in the mock storage backend. Both
 * belong in the bundle — otherwise a freshly uploaded format would 404 the
 * whole "Download all".
 */
async function readFileBytes(file: AssetFile): Promise<Uint8Array | null> {
  const uploadId = file.downloadUrl.startsWith("/api/uploads/")
    ? file.downloadUrl.slice("/api/uploads/".length)
    : null;
  if (uploadId) {
    return getUpload(decodeURIComponent(uploadId))?.bytes ?? null;
  }

  const filePath = resolveBrandFilePath(file.downloadUrl);
  if (!filePath) return null;
  try {
    return new Uint8Array(await readFile(filePath));
  } catch {
    return null;
  }
}

/** Two files on one asset can share a basename; keep both, distinctly named. */
function uniqueName(taken: Set<string>, fileName: string): string {
  if (!taken.has(fileName)) {
    taken.add(fileName);
    return fileName;
  }
  const dot = fileName.lastIndexOf(".");
  const stem = dot > 0 ? fileName.slice(0, dot) : fileName;
  const extension = dot > 0 ? fileName.slice(dot) : "";
  for (let n = 2; ; n += 1) {
    const candidate = `${stem}-${n}${extension}`;
    if (!taken.has(candidate)) {
      taken.add(candidate);
      return candidate;
    }
  }
}

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

  const taken = new Set<string>();
  const entries: ZipEntry[] = [];

  for (const file of sortedFiles(asset.files)) {
    const bytes = await readFileBytes(file);
    if (!bytes) {
      return NextResponse.json({ error: "File unavailable" }, { status: 404 });
    }
    entries.push({ name: uniqueName(taken, file.fileName), data: bytes });
  }

  return new NextResponse(createZip(entries), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${groupId}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
