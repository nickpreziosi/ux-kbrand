import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AssetFileDraft } from "@/contexts/brand-assets/domain";
import {
  saveUpload,
  uploadDownloadUrl,
} from "@/contexts/brand-assets/infrastructure/mock/server-upload-store";
import { denyUnlessAssetManager, jsonError, resolveApiViewer } from "@/lib/api/viewer";

/** Keep demo uploads bounded — the store is in-memory. */
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Mock HTTP backend — admin file upload (multipart `file` + `category`).
 * Stands in for Firebase Storage: bytes are held in server memory and served
 * back from GET /api/uploads/[id]; the returned AssetFile plugs straight into
 * asset create/replace.
 */
export async function POST(request: NextRequest) {
  const viewer = await resolveApiViewer(request);
  const denied = denyUnlessAssetManager(viewer);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const categoryRaw = form?.get("category");
  const category =
    typeof categoryRaw === "string" && isAssetCategory(categoryRaw)
      ? categoryRaw
      : null;

  if (!(file instanceof File) || !category) {
    return jsonError("errors.api.invalidRequest", 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("errors.api.invalidRequest", 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const upload = saveUpload({
    fileName: file.name,
    contentType: file.type,
    bytes,
  });

  const assetFile: AssetFileDraft = {
    fileName: upload.fileName,
    contentType: upload.contentType,
    sizeBytes: upload.sizeBytes,
    storagePath: `assets/${category}/${upload.fileName}`,
    downloadUrl: uploadDownloadUrl(upload.id),
  };
  return NextResponse.json({ file: assetFile }, { status: 201 });
}
