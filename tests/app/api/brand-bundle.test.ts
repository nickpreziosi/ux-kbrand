/**
 * @jest-environment node
 */
import { inflateRawSync } from "node:zlib";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

const mockList = jest.fn();
const mockReadFile = jest.fn();

jest.mock("@/contexts/brand-assets/application/brand-assets-server-services", () => ({
  getServerBrandAssetRepository: () => ({
    list: mockList,
  }),
}));

jest.mock("node:fs/promises", () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
}));

import { GET } from "@/app/api/brand-bundle/[groupId]/route";

function member(
  id: string,
  fileName: string,
  overrides: Partial<BrandAsset> = {},
): BrandAsset {
  return {
    id,
    title: `K Lab logo — primary (blue), ${fileName.split(".").pop()!.toUpperCase()}`,
    description: "",
    category: "logos",
    visibility: "public",
    status: "active",
    groupId: "k-lab-logo-blue",
    groupTitle: "K Lab logo — primary (blue)",
    groupDescription: "The default lockup.",
    file: {
      fileName,
      contentType: "application/octet-stream",
      sizeBytes: 9,
      storagePath: `assets/logos/${fileName}`,
      downloadUrl: `/brand-files/logos/${fileName}`,
    },
    tags: ["primary", "logo"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...overrides,
  };
}

const GROUP = [
  member("ast-010", "k-lab-logo-blue.png"),
  member("ast-010-svg", "k-lab-logo-blue.svg"),
];

function requestFor(groupId: string) {
  return new Request(`http://localhost/api/brand-bundle/${groupId}`) as never;
}

function call(groupId: string) {
  return GET(requestFor(groupId), { params: Promise.resolve({ groupId }) });
}

/** File names in the archive, read out of the central directory. */
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

/** Bytes of the first entry, whichever storage method it used. */
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
    mockList.mockReset();
    mockReadFile.mockReset();
  });

  it("zips every format in the group as one attachment", async () => {
    mockList.mockResolvedValue(GROUP);
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

  it("returns 404 for a group id no asset carries", async () => {
    mockList.mockResolvedValue(GROUP);

    const response = await call("k-lab-logomark");

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("refuses a bundle when any member is employee-gated", async () => {
    mockList.mockResolvedValue([
      GROUP[0],
      member("ast-010-svg", "k-lab-logo-blue.svg", { visibility: "employee" }),
    ]);

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(401);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects path traversal via a tampered downloadUrl", async () => {
    mockList.mockResolvedValue([
      member("ast-010", "k-lab-logo-blue.png", {
        file: {
          fileName: "secret.txt",
          contentType: "text/plain",
          sizeBytes: 1,
          storagePath: "assets/logos/secret.txt",
          downloadUrl: "/brand-files/../.env",
        },
      }),
    ]);

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects a traversal attempt in the group id itself", async () => {
    const response = await call("..");

    expect(response.status).toBe(404);
    expect(mockList).not.toHaveBeenCalled();
  });

  it("returns 404 when a member's bytes are missing from disk", async () => {
    mockList.mockResolvedValue(GROUP);
    mockReadFile.mockRejectedValue(new Error("ENOENT"));

    const response = await call("k-lab-logo-blue");

    expect(response.status).toBe(404);
  });

  it("keeps both files when two members share a name", async () => {
    mockList.mockResolvedValue([
      member("ast-014", "k-lab-logomark.pdf", { groupId: "dupes" }),
      member("ast-014-b", "k-lab-logomark.pdf", { groupId: "dupes" }),
    ]);
    mockReadFile.mockResolvedValue(Buffer.from("pdf-bytes"));

    const response = await call("dupes");

    expect(namesIn(new Uint8Array(await response.arrayBuffer()))).toEqual([
      "k-lab-logomark.pdf",
      "k-lab-logomark-2.pdf",
    ]);
  });
});
