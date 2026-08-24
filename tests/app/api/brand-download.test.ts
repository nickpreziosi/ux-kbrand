/**
 * @jest-environment node
 */
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

import { GET } from "@/app/api/brand-download/[id]/route";

function publicLogoAsset(overrides: Partial<BrandAsset> = {}): BrandAsset {
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
      {
        id: "ast-010",
        fileName: "k-lab-logo-blue.png",
        contentType: "image/png",
        sizeBytes: 12,
        storagePath: "assets/logos/k-lab-logo-blue.png",
        downloadUrl: "/brand-files/logos/k-lab-logo-blue.png",
      },
    ],
    previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
    tags: ["primary", "logo"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...overrides,
  };
}

function requestFor(id: string) {
  return new Request(`http://localhost/api/brand-download/${id}`) as never;
}

describe("GET /api/brand-download/[id]", () => {
  beforeEach(() => {
    mockList.mockReset();
    mockReadFile.mockReset();
  });

  it("streams a public logo with Content-Disposition attachment", async () => {
    const asset = publicLogoAsset();
    mockList.mockResolvedValue([asset]);
    mockReadFile.mockResolvedValue(Buffer.from("png-bytes"));

    const response = await GET(requestFor("ast-010"), {
      params: Promise.resolve({ id: "ast-010" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="k-lab-logo-blue.png"',
    );
    expect(Buffer.from(await response.arrayBuffer()).toString()).toBe(
      "png-bytes",
    );
  });

  it("returns 404 for an unknown file id", async () => {
    mockList.mockResolvedValue([publicLogoAsset()]);

    const response = await GET(requestFor("missing"), {
      params: Promise.resolve({ id: "missing" }),
    });

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects employee-only assets for anonymous download", async () => {
    mockList.mockResolvedValue([publicLogoAsset({ visibility: "employee" })]);

    const response = await GET(requestFor("ast-010"), {
      params: Promise.resolve({ id: "ast-010" }),
    });

    expect(response.status).toBe(401);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("rejects path traversal via a tampered downloadUrl", async () => {
    mockList.mockResolvedValue([
      publicLogoAsset({
        files: [
          {
            id: "ast-010",
            fileName: "secret.txt",
            contentType: "text/plain",
            sizeBytes: 1,
            storagePath: "assets/logos/secret.txt",
            downloadUrl: "/brand-files/../.env",
          },
        ],
      }),
    ]);

    const response = await GET(requestFor("ast-010"), {
      params: Promise.resolve({ id: "ast-010" }),
    });

    expect(response.status).toBe(404);
    expect(mockReadFile).not.toHaveBeenCalled();
  });
});
