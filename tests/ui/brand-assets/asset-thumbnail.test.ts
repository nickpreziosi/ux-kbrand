import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";
import { SEED_BRAND_ASSETS } from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import { assetThumbnail } from "@/ui/brand-assets/lib/asset-thumbnail";

function asset(
  partial: Partial<BrandAsset> & { id: string; fileName: string },
): BrandAsset {
  const { fileName, ...rest } = partial;
  return {
    title: partial.id,
    description: "",
    category: "logos",
    visibility: "public",
    status: "active",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdBy: "usr-001",
    ...rest,
    file: {
      fileName,
      contentType: "application/octet-stream",
      sizeBytes: 100,
      storagePath: `assets/logos/${fileName}`,
      downloadUrl: `/brand-files/logos/${fileName}`,
      ...partial.file,
    },
  };
}

describe("assetThumbnail", () => {
  it("never crops a logo — the lockup would lose its ends", () => {
    expect(
      assetThumbnail(asset({ id: "a", fileName: "k-lab-logo-blue.png" })).fit,
    ).toBe("contain");
  });

  it("gives transparent logo artwork a light brand surface and clearspace", () => {
    const thumbnail = assetThumbnail(
      asset({ id: "a", fileName: "k-lab-logo-blue.svg", tags: ["primary", "logo"] }),
    );

    expect(thumbnail.surfaceClassName).toBe("bg-brand-surface-light");
    expect(thumbnail.clearspace).toBe(true);
  });

  it("puts reversed artwork on the dark surface so it is not white on white", () => {
    for (const tag of ["reversed", "white"]) {
      expect(
        assetThumbnail(
          asset({ id: "a", fileName: "k-lab-logo-white.svg", tags: [tag] }),
        ).surfaceClassName,
      ).toBe("bg-brand-surface-dark");
    }
  });

  it("leaves an opaque logo image uncropped but un-inset — it composes its own background", () => {
    const thumbnail = assetThumbnail(
      asset({
        id: "a",
        fileName: "k-rails.webp",
        tags: ["product"],
        file: {
          fileName: "k-rails.webp",
          contentType: "image/webp",
          sizeBytes: 100,
          storagePath: "assets/logos/k-rails.webp",
          downloadUrl: "/brand-files/sub-brands/k-rails.webp",
        },
      }),
    );

    expect(thumbnail).toEqual({
      fit: "contain",
      surfaceClassName: "bg-secondary",
      clearspace: false,
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
      surfaceClassName: "bg-secondary",
      clearspace: false,
    });
  });

  it("contains every logo in the seeded catalog", () => {
    const logos = SEED_BRAND_ASSETS.filter((seed) => seed.category === "logos");

    expect(logos.length).toBeGreaterThan(0);
    for (const logo of logos) {
      expect(assetThumbnail(logo).fit).toBe("contain");
    }
  });
});
