import { existsSync } from "node:fs";
import { join } from "node:path";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import {
  formatFromFile,
  type LogoFormat,
} from "@/ui/branding/content/logo-formats";
import { LOGO_VARIANTS } from "@/ui/branding/content/logo-variants";

const publicBrandFiles = join(process.cwd(), "public", "brand-files");

const EXPECTED_VARIANT_FORMATS: Record<string, LogoFormat[]> = {
  primary: ["png", "svg", "ai"],
  dark: ["png", "svg", "ai"],
  reversed: ["png", "svg", "ai"],
  logomark: ["png", "svg", "pdf", "ai"],
};

const PRODUCT_VALUES = ["k-rails", "k-talk"] as const;
const RETIRED_PRODUCT_TAGS = ["kena"] as const;

const OBSOLETE_FILE_NAMES = [
  "k-lab-logo-2025.png",
  "k-lab-logomark-2025.png",
  "kena.webp",
  "kena-keyvisual.webp",
];

describe("logo catalog (rebrand)", () => {
  const logoAssets = SEED_BRAND_ASSETS.filter(
    (asset) => asset.category === "logos",
  );

  it("keeps product logos tagged by product field", () => {
    for (const product of PRODUCT_VALUES) {
      const match = logoAssets.find((asset) => asset.product === product);
      expect(match).toBeDefined();
    }
  });

  it("ships flat dark lockups (png + svg) for K Rails and K Talk", () => {
    for (const product of PRODUCT_VALUES) {
      const darkLockups = logoAssets.filter(
        (asset) => asset.product === product && asset.tags.includes("dark"),
      );
      const formats = darkLockups.flatMap((asset) =>
        asset.files.map((file) => formatFromFile(file)),
      );
      expect(formats.sort()).toEqual(["png", "svg"]);
    }
  });

  it("carries no retired product brand anywhere in the catalog", () => {
    for (const tag of RETIRED_PRODUCT_TAGS) {
      const matches = SEED_BRAND_ASSETS.filter(
        (asset) =>
          asset.tags.includes(tag) ||
          asset.product === tag ||
          asset.title.toLowerCase().includes(tag) ||
          asset.files.some((file) => file.fileName.includes(tag)),
      );
      expect(matches).toEqual([]);
    }
  });

  it("retires obsolete dimensional raster masters from the catalog", () => {
    const fileNames = logoAssets.flatMap((asset) =>
      asset.files.map((file) => file.fileName),
    );
    for (const obsolete of OBSOLETE_FILE_NAMES) {
      expect(fileNames).not.toContain(obsolete);
    }
  });

  it("exposes the expected formats per logo variant (only what exists)", () => {
    for (const variant of LOGO_VARIANTS) {
      const matched = logoAssets.filter((asset) =>
        variant.matchTags.every((tag) => asset.tags.includes(tag)),
      );
      const formats = [
        ...new Set(
          matched.flatMap((asset) =>
            asset.files
              .map((file) => formatFromFile(file))
              .filter((format): format is LogoFormat => format !== null),
          ),
        ),
      ];
      expect(formats.sort()).toEqual(
        [...EXPECTED_VARIANT_FORMATS[variant.id]].sort(),
      );
    }
  });

  it("covers png, svg, pdf, and ai content types among K Lab logo files", () => {
    const kLabLogos = logoAssets.filter((asset) => asset.product === "k-lab");
    const types = new Set(
      kLabLogos.flatMap((asset) => asset.files.map((file) => file.contentType)),
    );
    expect(types.has("image/png")).toBe(true);
    expect(types.has("image/svg+xml")).toBe(true);
    expect(types.has("application/pdf")).toBe(true);
    expect(
      types.has("application/postscript") ||
        types.has("application/illustrator") ||
        types.has("application/octet-stream"),
    ).toBe(true);
    expect(
      kLabLogos.some((asset) =>
        asset.files.some((file) => file.fileName.endsWith(".ai")),
      ),
    ).toBe(true);
  });

  it("is one record per artwork", () => {
    expect(logoAssets).toHaveLength(9);
  });

  it("points every logo file at a path under public/brand-files", () => {
    for (const asset of logoAssets) {
      for (const file of asset.files) {
        expect(file.downloadUrl.startsWith("/brand-files/")).toBe(true);
        const relative = file.downloadUrl.replace(/^\/brand-files\//, "");
        expect(existsSync(join(publicBrandFiles, relative))).toBe(true);
      }
    }
  });
});
