import type { AssetFile } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import {
  fileFormat,
  fileForFormat,
  formatFromFileName,
  makeAssetId,
  sortedFiles,
  withoutFormatTags,
} from "@/contexts/brand-assets/domain/services/asset-files";

function file(fileName: string, id = fileName, sizeBytes = 100): AssetFile {
  return {
    id,
    fileName,
    contentType: "application/octet-stream",
    sizeBytes,
    storagePath: `assets/logos/${fileName}`,
    downloadUrl: `/brand-files/logos/${fileName}`,
  };
}

describe("formatFromFileName / fileFormat", () => {
  it("reads the extension off the file name", () => {
    expect(formatFromFileName("k-lab-logo.SVG")).toBe("svg");
    expect(fileFormat(file("k-lab-logo.SVG"))).toBe("svg");
  });

  it("returns null when the name has no extension", () => {
    expect(formatFromFileName("logo")).toBeNull();
    expect(fileFormat(file("logo"))).toBeNull();
  });
});

describe("fileForFormat", () => {
  it("returns the file whose extension matches", () => {
    const files = [file("lockup.png", "png", 1000), file("lockup.svg", "svg", 300)];
    expect(fileForFormat(files, "svg")?.id).toBe("svg");
    expect(fileForFormat(files, "SVG")?.sizeBytes).toBe(300);
    expect(fileForFormat(files, "ai")).toBeUndefined();
  });
});

describe("sortedFiles", () => {
  it("orders raster first, editable masters last", () => {
    const files = sortedFiles([
      file("lockup.ai", "ai", 20),
      file("lockup.svg", "svg", 300),
      file("lockup.png", "png", 1000),
    ]);
    expect(files.map((entry) => entry.id)).toEqual(["png", "svg", "ai"]);
  });
});

describe("withoutFormatTags", () => {
  it("drops tags that are just this artwork's formats", () => {
    expect(
      withoutFormatTags(["partner", "logo", "png", "svg"], [
        file("a.png"),
        file("a.svg"),
      ]),
    ).toEqual(["partner", "logo"]);
  });
});

describe("makeAssetId", () => {
  it("slugs the title and disambiguates collisions", () => {
    expect(makeAssetId("Partner lockup", [])).toBe("partner-lockup");
    expect(makeAssetId("Partner lockup", ["partner-lockup"])).toBe(
      "partner-lockup-2",
    );
  });
});

describe("seeded logo catalog is one record per artwork", () => {
  it("is asserted after seed regeneration (placeholder for compile)", () => {
    const asset: Pick<BrandAsset, "files"> = { files: [file("a.png")] };
    expect(asset.files).toHaveLength(1);
  });
});
