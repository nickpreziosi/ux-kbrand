import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import {
  assetThumbnail,
  LOCKUP_INSET_CLASS,
  LOGOMARK_INSET_CLASS,
} from "@/ui/brand-assets/lib/asset-thumbnail";

function asset(
  partial: Partial<BrandAsset> & { id: string; fileName: string },
): BrandAsset {
  const { fileName, ...rest } = partial;
  return {
    title: partial.id,
    description: "",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...rest,
    files: [
      {
        id: partial.id,
        fileName,
        contentType: "application/octet-stream",
        sizeBytes: 100,
        storagePath: `assets/logos/${fileName}`,
        downloadUrl: `/brand-files/logos/${fileName}`,
        ...partial.files?.[0],
      },
    ],
  };
}

describe("assetThumbnail", () => {
  it("never crops a logo — the lockup would lose its ends", () => {
    expect(
      assetThumbnail(asset({ id: "a", fileName: "k-lab-logo-blue.png" })).fit,
    ).toBe("contain");
  });

  it("gives logo artwork a white surface and clearspace", () => {
    const thumbnail = assetThumbnail(
      asset({ id: "a", fileName: "k-lab-logo-blue.svg", tags: ["primary", "logo"] }),
    );

    expect(thumbnail.surfaceClassName).toBe("bg-white");
    expect(thumbnail.clearspace).toBe(true);
    expect(thumbnail.insetClassName).toBe(LOCKUP_INSET_CLASS);
  });

  it("gives standalone logomarks 0.5× clearspace so they do not fill the frame height", () => {
    const thumbnail = assetThumbnail(
      asset({
        id: "mark",
        fileName: "k-lab-logomark.png",
        tags: ["mark", "logomark"],
      }),
    );

    expect(thumbnail.clearspace).toBe(true);
    expect(thumbnail.insetClassName).toBe(LOGOMARK_INSET_CLASS);
  });

  it("puts reversed artwork on black so it is not white on white", () => {
    for (const tag of ["reversed", "white"]) {
      expect(
        assetThumbnail(
          asset({ id: "a", fileName: "k-lab-logo-white.svg", tags: [tag] }),
        ).surfaceClassName,
      ).toBe("bg-black");
    }
  });

  it("lets composed product lockups fill the frame — they already have a background", () => {
    const thumbnail = assetThumbnail(
      asset({
        id: "a",
        fileName: "k-rails.webp",
        previewUrl: "/brand-files/sub-brands/k-rails.webp",
        tags: [],
        files: [
          {
            id: "a",
            fileName: "k-rails.webp",
            contentType: "image/webp",
            sizeBytes: 100,
            storagePath: "assets/logos/k-rails.webp",
            downloadUrl: "/brand-files/sub-brands/k-rails.webp",
          },
        ],
      }),
    );

    expect(thumbnail).toEqual({
      fit: "contain",
      surfaceClassName: "bg-white",
      clearspace: false,
      insetClassName: "inset-0",
      paddingClassName: "",
    });
  });

  it("fills the frame for photography, which has no canonical shape", () => {
    const thumbnail = assetThumbnail(
      asset({
        id: "a",
        fileName: "k-lab-bg-001.webp",
        category: "brand-imagery",
        tags: ["background"],
      }),
    );

    expect(thumbnail).toEqual({
      fit: "cover",
      surfaceClassName: "bg-background",
      clearspace: false,
      insetClassName: "inset-0",
      paddingClassName: "",
    });
  });

  it("puts fonts, documents, and icons on the page background", () => {
    const font = assetThumbnail(
      asset({ id: "font", fileName: "sora.ttf", category: "fonts" }),
    );
    expect(font.surfaceClassName).toBe("bg-background");
    expect(font.fit).toBe("contain");

    const document = assetThumbnail(
      asset({
        id: "letterhead",
        fileName: "letterhead.pdf",
        category: "corporate-assets",
      }),
    );
    expect(document.surfaceClassName).toBe("bg-background");
    expect(document.fit).toBe("contain");

    const icon = assetThumbnail(
      asset({
        id: "icon",
        fileName: "k-lab-icon.svg",
        category: "iconography",
      }),
    );
    expect(icon.surfaceClassName).toBe("bg-background");
    expect(icon.fit).toBe("contain");
    expect(icon.insetClassName).toBe(LOGOMARK_INSET_CLASS);
  });

  it("fills the frame for photography the same way as brand imagery", () => {
    expect(
      assetThumbnail(
        asset({
          id: "photo",
          fileName: "portrait.webp",
          category: "photography",
        }),
      ).fit,
    ).toBe("cover");
  });

  it("contains every logo in the seeded catalog, with clearspace except composed shots", () => {
    const logos = SEED_BRAND_ASSETS.filter((seed) => seed.category === "logos");

    expect(logos.length).toBeGreaterThan(0);
    for (const logo of logos) {
      const thumbnail = assetThumbnail(logo);
      expect(thumbnail.fit).toBe("contain");
      const composed = ["webp", "jpg", "jpeg", "gif"].some((ext) =>
        (logo.previewUrl ?? logo.files[0]?.fileName ?? "").toLowerCase().endsWith(`.${ext}`),
      );
      const logomark = logo.tags.some((tag) =>
        ["logomark", "mark"].includes(tag.toLowerCase()),
      );
      expect(thumbnail.clearspace).toBe(!composed);
      expect(thumbnail.insetClassName).toBe(
        composed
          ? "inset-0"
          : logomark
            ? LOGOMARK_INSET_CLASS
            : LOCKUP_INSET_CLASS,
      );
    }
  });
});
