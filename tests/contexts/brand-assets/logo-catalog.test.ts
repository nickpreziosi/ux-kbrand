import { existsSync } from "node:fs";
import { join } from "node:path";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import {
  formatFromAsset,
  type LogoFormat,
} from "@/ui/branding/content/logo-formats";
import { LOGO_VARIANTS } from "@/ui/branding/content/logo-variants";

const publicBrandFiles = join(process.cwd(), "public", "brand-files");

/** Expected format sets after the rebrand — only formats that exist on disk. */
const EXPECTED_VARIANT_FORMATS: Record<string, LogoFormat[]> = {
  primary: ["png", "svg", "ai"],
  dark: ["png", "svg", "ai"],
  reversed: ["png", "svg", "ai"],
  logomark: ["png", "svg", "pdf", "ai"],
};

const PRODUCT_TAGS = ["k-rails", "k-talk"] as const;

/** Kena is retired (Brand & Sales Portal Expansion) — no asset may carry it. */
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

  it("keeps product logos tagged and present", () => {
    for (const tag of PRODUCT_TAGS) {
      const match = logoAssets.find((asset) => asset.tags.includes(tag));
      expect(match).toBeDefined();
      expect(match!.tags).toContain("product");
    }
  });

  it("ships flat dark lockups (png + svg) for K Rails and K Talk", () => {
    for (const tag of PRODUCT_TAGS) {
      const darkLockups = logoAssets.filter(
        (asset) => asset.tags.includes(tag) && asset.tags.includes("dark"),
      );
      const formats = darkLockups.map((asset) => formatFromAsset(asset)).sort();
      expect(formats).toEqual(["png", "svg"]);
    }
  });

  it("carries no retired product brand anywhere in the catalog", () => {
    for (const tag of RETIRED_PRODUCT_TAGS) {
      const matches = SEED_BRAND_ASSETS.filter(
        (asset) =>
          asset.tags.includes(tag) ||
          asset.title.toLowerCase().includes(tag) ||
          asset.file.fileName.includes(tag),
      );
      expect(matches).toEqual([]);
    }
  });

  it("retires obsolete dimensional raster masters from the catalog", () => {
    const fileNames = logoAssets.map((asset) => asset.file.fileName);
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
          matched
            .map((asset) => formatFromAsset(asset))
            .filter((format): format is LogoFormat => format !== null),
        ),
      ];
      expect(formats.sort()).toEqual(
        [...EXPECTED_VARIANT_FORMATS[variant.id]].sort(),
      );
    }
  });

  it("covers png, svg, pdf, and ai content types among K Lab logo files", () => {
    const kLabLogos = logoAssets.filter((asset) => !asset.tags.includes("product"));
    const types = new Set(kLabLogos.map((asset) => asset.file.contentType));
    expect(types.has("image/png")).toBe(true);
    expect(types.has("image/svg+xml")).toBe(true);
    expect(types.has("application/pdf")).toBe(true);
    expect(
      types.has("application/postscript") ||
        types.has("application/illustrator") ||
        types.has("application/octet-stream"),
    ).toBe(true);
    expect(kLabLogos.some((asset) => asset.file.fileName.endsWith(".ai"))).toBe(
      true,
    );
  });

  it("points every logo asset at a file under public/brand-files", () => {
    for (const asset of logoAssets) {
      expect(asset.file.downloadUrl.startsWith("/brand-files/")).toBe(true);
      const relative = asset.file.downloadUrl.replace(/^\/brand-files\//, "");
      expect(existsSync(join(publicBrandFiles, relative))).toBe(true);
    }
  });
});
