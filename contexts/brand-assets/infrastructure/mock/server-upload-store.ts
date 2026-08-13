/**
 * In-memory byte store for admin uploads in the mock HTTP backend. Bytes live
 * for the server process (reset on restart) and are served by
 * GET /api/uploads/[id] — the stand-in for Firebase Storage download URLs.
 */
export interface StoredUpload {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  bytes: Uint8Array;
  createdAt: string;
}

const globalStore = globalThis as unknown as {
  __kbrandServerUploads?: Map<string, StoredUpload>;
  __kbrandServerUploadSequence?: number;
};

function uploads(): Map<string, StoredUpload> {
  globalStore.__kbrandServerUploads ??= new Map();
  return globalStore.__kbrandServerUploads;
}

export function saveUpload(input: {
  fileName: string;
  contentType: string;
  bytes: Uint8Array;
}): StoredUpload {
  globalStore.__kbrandServerUploadSequence =
    (globalStore.__kbrandServerUploadSequence ?? 0) + 1;
  const upload: StoredUpload = {
    id: `upl-${globalStore.__kbrandServerUploadSequence}-${Date.now()}`,
    fileName: input.fileName,
    contentType: input.contentType || "application/octet-stream",
    sizeBytes: input.bytes.byteLength,
    bytes: input.bytes,
    createdAt: new Date().toISOString(),
  };
  uploads().set(upload.id, upload);
  return upload;
}

export function getUpload(id: string): StoredUpload | null {
  return uploads().get(id) ?? null;
}

export function uploadDownloadUrl(id: string): string {
  return `/api/uploads/${id}`;
}
