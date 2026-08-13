/**
 * @jest-environment node
 */
import type { NextRequest } from "next/server";
import type { ViewerRole } from "@/contexts/shared/domain/viewer-role";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";

const mockGetById = jest.fn();
const mockReadFile = jest.fn();
const mockViewerRole = jest.fn<ViewerRole, []>();

jest.mock("@/contexts/brand-assets/application/brand-assets-server-services", () => ({
  getServerBrandAssetRepository: () => ({
    getById: mockGetById,
  }),
}));

jest.mock("@/lib/api/viewer", () => ({
  resolveApiViewer: async () => ({ role: mockViewerRole(), user: null }),
}));

jest.mock("node:fs/promises", () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
}));

import { GET } from "@/app/api/sales-files/[id]/route";

/** A real seeded pitch deck — the id must exist in PRIVATE_SEED_FILES. */
const DECK = SEED_BRAND_ASSETS.find((asset) => asset.id === "ast-100")!;

function call(id: string) {
  return GET(new Request(`http://localhost/api/sales-files/${id}`) as NextRequest, {
    params: Promise.resolve({ id }),
  });
}

describe("GET /api/sales-files/[id]", () => {
  beforeEach(() => {
    mockGetById.mockReset();
    mockReadFile.mockReset();
    mockViewerRole.mockReset();
    mockGetById.mockResolvedValue(DECK);
    mockReadFile.mockResolvedValue(Buffer.from("%PDF-1.4"));
  });

  it("keeps the seeded pitch deck employee-gated", () => {
    expect(DECK.category).toBe("pitch-decks");
    expect(DECK.visibility).toBe("employee");
  });

  it("refuses to serve a pitch deck to an anonymous visitor", async () => {
    mockViewerRole.mockReturnValue("public");

    const response = await call("ast-100");

    expect(response.status).toBe(401);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("serves it to employees and admins", async () => {
    for (const role of ["employee", "admin"] as const) {
      mockViewerRole.mockReturnValue(role);

      const response = await call("ast-100");

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Disposition")).toContain(
        "k-lab-platform-pitch-2026.pdf",
      );
    }
  });
});
