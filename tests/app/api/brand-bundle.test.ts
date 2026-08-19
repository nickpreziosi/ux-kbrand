/**
 * @jest-environment node
 */
import { inflateRawSync } from "node:zlib";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const mockGetById = jest.fn();
const mockReadFile = jest.fn();

jest.mock("@/contexts/brand-assets/application/brand-assets-server-services", () => ({
  getServerBrandAssetRepository: () => ({
    getById: mockGetById,
  }),
}));

jest.mock("node:fs/promises", () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
}));

import { GET } from "@/app/api/brand-bundle/[groupId]/route";

function file(id: string, fileName: string, overrides: Partial<AssetFile> = {}): AssetFile {
  return {
    id,
    fileName,
    contentType: "application/octet-stream",
    sizeBytes: 9,
    storagePath: `assets/logos/${fileName}`,
    downloadUrl: `/brand-files/logos/${fileName}`,
    ...overrides,
  };
}

function artwork(overrides: Partial<BrandAsset> = {}): BrandAsset {
  return {
    id: "k-lab-logo-blue",
    title: "K Lab logo — primary (blue)",
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      file("ast-010", "k-lab-logo-blue.png"),
      file("ast-010-svg", "k-lab-logo-blue.svg"),
    ],
    tags: ["primary", "logo"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...overrides,
  };
}

function requestFor(groupId: string) {
  return new Request(`http://localhost/api/brand-bundle/${groupId}`) as never;
}

function call(groupId: string) {
  return GET(requestFor(groupId), { params: Promise.resolve({ groupId }) });
}

function namesIn(archive: Uint8Array): string[] {
  const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
  const end = archive.length - 22;
  const count = view.getUint16(end + 10, true);
  let cursor = view.getUint32(end + 16, true);
  const names: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const nameLength = view.getUint16(cursor + 28, true);
    names.push(
      Buffer.from(archive.slice(cursor + 46, cursor + 46 + nameLength)).toString("utf8"),
    );
    cursor += 46 + nameLength;
  }
  return names;
}

function firstEntryBytes(archive: Uint8Array): Buffer {
  const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
  const method = view.getUint16(8, true);
  const compressedSize = view.getUint32(18, true);
  const nameLength = view.getUint16(26, true);
  const extraLength = view.getUint16(28, true);
  const start = 30 + nameLength + extraLength;
  const body = Buffer.from(archive.slice(start, start + compressedSize));
  return method === 8 ? inflateRawSync(body) : body;
}

describe("GET /api/brand-bundle/[groupId]", () => {
  beforeEach(() => {
    mockGetById.mockReset();
    mockReadFile.mockReset();
  });

  it("zips every format in the asset as one attachment", async () => {
    mockGetById.mockResolvedValue(artwork());
    mockReadFile.mockResolvedValue(Buffer.from("png-bytes"));

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/zip");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="k-lab-logo-blue.zip"',
    );

    const archive = new Uint8Array(await response.arrayBuffer());
    expect(namesIn(archive)).toEqual([
      "k-lab-logo-blue.png",
      "k-lab-logo-blue.svg",
    ]);
    expect(firstEntryBytes(archive).toString()).toBe("png-bytes");
  });

  it("returns 404 for an asset id the catalog does not have", async () => {
    mockGetById.mockResolvedValue(null);

    const response = await call("k-lab-logomark");

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("refuses a bundle when the asset is employee-gated", async () => {
    mockGetById.mockResolvedValue(artwork({ visibility: "employee" }));

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(401);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects path traversal via a tampered downloadUrl", async () => {
    mockGetById.mockResolvedValue(
      artwork({
        files: [
          file("ast-010", "k-lab-logo-blue.png", {
            downloadUrl: "/brand-files/../.env",
          }),
        ],
      }),
    );

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects a traversal attempt in the asset id itself", async () => {
    const response = await call("..");

    expect(response.status).toBe(404);
    expect(mockGetById).not.toHaveBeenCalled();
  });

  it("returns 404 when a file's bytes are missing from disk", async () => {
    mockGetById.mockResolvedValue(artwork());
    mockReadFile.mockRejectedValue(new Error("ENOENT"));

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(404);
  });

  it("keeps both files when two members share a name", async () => {
    mockGetById.mockResolvedValue(
      artwork({
        id: "dupes",
        files: [
          file("ast-014", "k-lab-logomark.pdf"),
          file("ast-014-b", "k-lab-logomark.pdf"),
        ],
      }),
    );
    mockReadFile.mockResolvedValue(Buffer.from("pdf-bytes"));

    const response = await call("dupes");

    expect(namesIn(new Uint8Array(await response.arrayBuffer()))).toEqual([
      "k-lab-logomark.pdf",
      "k-lab-logomark-2.pdf",
    ]);
  });
});
