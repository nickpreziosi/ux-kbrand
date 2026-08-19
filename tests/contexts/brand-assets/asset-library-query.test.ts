import {
  ANY,
  EMPTY_LIBRARY_FILTER,
  filterLibraryAssets,
  filesForBulkDownload,
  hasActiveLibraryFilter,
  parseLibraryFilter,
  serializeLibraryFilter,
} from "@/contexts/brand-assets/domain/services/asset-filtering";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";

function file(fileName: string, id = fileName): AssetFile {
  return {
    id,
    fileName,
    contentType: "application/octet-stream",
    sizeBytes: 10,
    storagePath: `assets/${fileName}`,
    downloadUrl: `/brand-files/${fileName}`,
  };
}

function asset(
  partial: Partial<BrandAsset> & { id: string; title: string },
): BrandAsset {
  return {
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [file(`${partial.id}.png`)],
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...partial,
  };
}

const catalog: BrandAsset[] = [
  asset({
    id: "k-lab-logo-blue",
    title: "K Lab logo — primary (blue)",
    tags: ["primary", "logo"],
    files: [file("k-lab-logo-blue.png", "png"), file("k-lab-logo-blue.svg", "svg")],
  }),
  asset({
    id: "k-talk-logo",
    title: "K Talk — product logo",
    product: "k-talk",
    tags: ["dark"],
    files: [file("k-talk.webp", "webp")],
  }),
  asset({
    id: "deck",
    title: "Platform pitch",
    resourceType: "sales",
    category: "pitch-decks",
    visibility: "employee",
    files: [file("deck.pdf", "pdf")],
  }),
];

describe("library URL query", () => {
  it("parses category, product, format and search", () => {
    expect(
      parseLibraryFilter(
        new URLSearchParams("category=logos&product=k-talk&format=svg&q=lockup"),
      ),
    ).toEqual({
      search: "lockup",
      category: "logos",
      product: "k-talk",
      format: "svg",
      resourceType: ANY,
    });
  });

  it("serializes only set facets", () => {
    const params = serializeLibraryFilter({
      ...EMPTY_LIBRARY_FILTER,
      category: "logos",
      format: "svg",
    });
    expect(params.toString()).toBe("category=logos&format=svg");
  });
});

describe("filterLibraryAssets", () => {
  it("ANDs category, product, format and search", () => {
    const result = filterLibraryAssets(catalog, {
      ...EMPTY_LIBRARY_FILTER,
      category: "logos",
      product: "k-talk",
    });
    expect(result.map((row) => row.id)).toEqual(["k-talk-logo"]);
  });

  it("narrows by file format without dropping the artwork", () => {
    const result = filterLibraryAssets(catalog, {
      ...EMPTY_LIBRARY_FILTER,
      format: "svg",
    });
    expect(result.map((row) => row.id)).toEqual(["k-lab-logo-blue"]);
  });

  it("can hide sales resources from the brand library", () => {
    const result = filterLibraryAssets(catalog, {
      ...EMPTY_LIBRARY_FILTER,
      resourceType: "brand",
    });
    expect(result.every((row) => row.resourceType === "brand")).toBe(true);
  });
});

describe("hasActiveLibraryFilter", () => {
  it("is inactive by default", () => {
    expect(hasActiveLibraryFilter(EMPTY_LIBRARY_FILTER)).toBe(false);
    expect(hasActiveLibraryFilter({ ...EMPTY_LIBRARY_FILTER, search: "logo" })).toBe(
      true,
    );
  });
});

describe("filesForBulkDownload", () => {
  it("includes every file when no format filter is set", () => {
    expect(filesForBulkDownload(catalog.slice(0, 1)).map((file) => file.id)).toEqual(
      ["png", "svg"],
    );
  });

  it("keeps only the filtered format", () => {
    expect(
      filesForBulkDownload(catalog.slice(0, 1), "svg").map((file) => file.id),
    ).toEqual(["svg"]);
  });
});
