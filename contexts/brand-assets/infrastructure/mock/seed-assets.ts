import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * GENERATED — do not edit by hand.
 * Run `node scripts/generate-asset-catalog.mjs` after adding or replacing a
 * brand file; sizes are read from disk so the catalog cannot drift from what
 * the portal actually serves. Titles and descriptions live in that script.
 *
 * Files under /public/brand-files are served statically; private-location
 * files live outside the web root and stream through /api/sales-files/[id],
 * which enforces the session cookie only when the asset's visibility is
 * "employee". Visibility (role gating) is independent of where the bytes
 * live — every seed asset currently defaults to "public".
 */
export const SEED_BRAND_ASSETS: BrandAsset[] = [
  {
    id: "klab_full_logo_blue",
    title: "K Lab logo — primary (blue)",
    description: "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-010",
        fileName: "klab_full_logo_blue.png",
        contentType: "image/png",
        sizeBytes: 134965,
        storagePath: "assets/logos/k-lab/klab_full_logo_blue.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_blue.png"
      },
      {
        id: "ast-010-svg",
        fileName: "klab_full_logo_blue.svg",
        contentType: "image/svg+xml",
        sizeBytes: 7216,
        storagePath: "assets/logos/k-lab/klab_full_logo_blue.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_blue.svg"
      },
      {
        id: "ast-010-pdf",
        fileName: "klab_full_logo_blue.pdf",
        contentType: "application/pdf",
        sizeBytes: 376807,
        storagePath: "assets/logos/k-lab/klab_full_logo_blue.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_blue.pdf"
      },
      {
        id: "ast-010-ai",
        fileName: "klab_full_logo_blue.ai",
        contentType: "application/postscript",
        sizeBytes: 1587431,
        storagePath: "assets/logos/k-lab/klab_full_logo_blue.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_blue.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_full_logo_blue.svg",
    tags: [
      "primary",
      "logo",
      "blue"
    ],
    createdAt: "2025-11-04T09:05:00.000Z",
    updatedAt: "2025-11-04T09:05:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_full_logo_dark",
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-011",
        fileName: "klab_full_logo_dark.png",
        contentType: "image/png",
        sizeBytes: 102470,
        storagePath: "assets/logos/k-lab/klab_full_logo_dark.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_dark.png"
      },
      {
        id: "ast-011-svg",
        fileName: "klab_full_logo_dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 7077,
        storagePath: "assets/logos/k-lab/klab_full_logo_dark.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_dark.svg"
      },
      {
        id: "ast-011-pdf",
        fileName: "klab_full_logo_dark.pdf",
        contentType: "application/pdf",
        sizeBytes: 374834,
        storagePath: "assets/logos/k-lab/klab_full_logo_dark.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_dark.pdf"
      },
      {
        id: "ast-011-ai",
        fileName: "klab_full_logo_dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1587757,
        storagePath: "assets/logos/k-lab/klab_full_logo_dark.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_full_logo_dark.svg",
    tags: [
      "dark",
      "logo"
    ],
    createdAt: "2025-11-04T09:06:00.000Z",
    updatedAt: "2025-11-04T09:06:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_full_logo_light",
    title: "K Lab logo — reversed (light)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-012",
        fileName: "klab_full_logo_light.png",
        contentType: "image/png",
        sizeBytes: 90055,
        storagePath: "assets/logos/k-lab/klab_full_logo_light.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_light.png"
      },
      {
        id: "ast-012-svg",
        fileName: "klab_full_logo_light.svg",
        contentType: "image/svg+xml",
        sizeBytes: 5993,
        storagePath: "assets/logos/k-lab/klab_full_logo_light.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_light.svg"
      },
      {
        id: "ast-012-pdf",
        fileName: "klab_full_logo_light.pdf",
        contentType: "application/pdf",
        sizeBytes: 370007,
        storagePath: "assets/logos/k-lab/klab_full_logo_light.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_light.pdf"
      },
      {
        id: "ast-012-ai",
        fileName: "klab_full_logo_light.ai",
        contentType: "application/postscript",
        sizeBytes: 1585152,
        storagePath: "assets/logos/k-lab/klab_full_logo_light.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_light.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_full_logo_light.svg",
    tags: [
      "reversed",
      "light",
      "logo"
    ],
    createdAt: "2025-11-04T09:07:00.000Z",
    updatedAt: "2025-11-04T09:07:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_full_logo_flat_black",
    title: "K Lab logo — flat black",
    description: "Single-color black lockup for one-color print and monochrome layouts.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-013",
        fileName: "klab_full_logo_flat_black.png",
        contentType: "image/png",
        sizeBytes: 46727,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_black.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_black.png"
      },
      {
        id: "ast-013-svg",
        fileName: "klab_full_logo_flat_black.svg",
        contentType: "image/svg+xml",
        sizeBytes: 3351,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_black.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_black.svg"
      },
      {
        id: "ast-013-pdf",
        fileName: "klab_full_logo_flat_black.pdf",
        contentType: "application/pdf",
        sizeBytes: 372100,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_black.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_black.pdf"
      },
      {
        id: "ast-013-ai",
        fileName: "klab_full_logo_flat_black.ai",
        contentType: "application/postscript",
        sizeBytes: 1584482,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_black.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_black.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_black.svg",
    tags: [
      "flat",
      "black",
      "logo"
    ],
    createdAt: "2026-08-21T12:00:00.000Z",
    updatedAt: "2026-08-21T12:00:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_full_logo_flat_white",
    title: "K Lab logo — flat white",
    description: "Single-color white lockup for one-color reverse print and dark fields.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-016",
        fileName: "klab_full_logo_flat_white.png",
        contentType: "image/png",
        sizeBytes: 42448,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_white.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_white.png"
      },
      {
        id: "ast-016-svg",
        fileName: "klab_full_logo_flat_white.svg",
        contentType: "image/svg+xml",
        sizeBytes: 3438,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_white.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_white.svg"
      },
      {
        id: "ast-016-pdf",
        fileName: "klab_full_logo_flat_white.pdf",
        contentType: "application/pdf",
        sizeBytes: 366400,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_white.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_white.pdf"
      },
      {
        id: "ast-016-ai",
        fileName: "klab_full_logo_flat_white.ai",
        contentType: "application/postscript",
        sizeBytes: 1583509,
        storagePath: "assets/logos/k-lab/klab_full_logo_flat_white.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_white.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_full_logo_flat_white.svg",
    tags: [
      "flat",
      "white",
      "logo"
    ],
    createdAt: "2026-08-21T12:01:00.000Z",
    updatedAt: "2026-08-21T12:01:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_logomark_blue",
    title: "K Lab logomark — blue",
    description: "The standalone mark in its rounded container — avatars, app icons, and favicons.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-014",
        fileName: "klab_logomark_blue.png",
        contentType: "image/png",
        sizeBytes: 80585,
        storagePath: "assets/logos/k-lab/klab_logomark_blue.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_blue.png"
      },
      {
        id: "ast-014-svg",
        fileName: "klab_logomark_blue.svg",
        contentType: "image/svg+xml",
        sizeBytes: 2966,
        storagePath: "assets/logos/k-lab/klab_logomark_blue.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_blue.svg"
      },
      {
        id: "ast-014-pdf",
        fileName: "klab_logomark_blue.pdf",
        contentType: "application/pdf",
        sizeBytes: 374908,
        storagePath: "assets/logos/k-lab/klab_logomark_blue.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_blue.pdf"
      },
      {
        id: "ast-014-ai",
        fileName: "klab_logomark_blue.ai",
        contentType: "application/postscript",
        sizeBytes: 1582227,
        storagePath: "assets/logos/k-lab/klab_logomark_blue.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_blue.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_logomark_blue.svg",
    tags: [
      "mark",
      "icon",
      "logomark",
      "blue"
    ],
    createdAt: "2026-01-15T10:05:00.000Z",
    updatedAt: "2026-01-15T10:05:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_logomark_dark",
    title: "K Lab logomark — dark",
    description: "Dark logomark for light surfaces where the blue mark would compete.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-018",
        fileName: "klab_logomark_dark.png",
        contentType: "image/png",
        sizeBytes: 48025,
        storagePath: "assets/logos/k-lab/klab_logomark_dark.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_dark.png"
      },
      {
        id: "ast-018-svg",
        fileName: "klab_logomark_dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 3326,
        storagePath: "assets/logos/k-lab/klab_logomark_dark.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_dark.svg"
      },
      {
        id: "ast-018-pdf",
        fileName: "klab_logomark_dark.pdf",
        contentType: "application/pdf",
        sizeBytes: 372177,
        storagePath: "assets/logos/k-lab/klab_logomark_dark.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_dark.pdf"
      },
      {
        id: "ast-018-ai",
        fileName: "klab_logomark_dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1582634,
        storagePath: "assets/logos/k-lab/klab_logomark_dark.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_logomark_dark.svg",
    tags: [
      "logomark",
      "dark"
    ],
    createdAt: "2026-08-21T12:02:00.000Z",
    updatedAt: "2026-08-21T12:02:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_logomark_light",
    title: "K Lab logomark — light",
    description: "Reversed logomark for dark surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-015",
        fileName: "klab_logomark_light.png",
        contentType: "image/png",
        sizeBytes: 26746,
        storagePath: "assets/logos/k-lab/klab_logomark_light.png",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_light.png"
      },
      {
        id: "ast-015-svg",
        fileName: "klab_logomark_light.svg",
        contentType: "image/svg+xml",
        sizeBytes: 2197,
        storagePath: "assets/logos/k-lab/klab_logomark_light.svg",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_light.svg"
      },
      {
        id: "ast-015-pdf",
        fileName: "klab_logomark_light.pdf",
        contentType: "application/pdf",
        sizeBytes: 370847,
        storagePath: "assets/logos/k-lab/klab_logomark_light.pdf",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_light.pdf"
      },
      {
        id: "ast-015-ai",
        fileName: "klab_logomark_light.ai",
        contentType: "application/postscript",
        sizeBytes: 1581548,
        storagePath: "assets/logos/k-lab/klab_logomark_light.ai",
        downloadUrl: "/brand-files/logos/k-lab/klab_logomark_light.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab/klab_logomark_light.svg",
    tags: [
      "logomark",
      "reversed",
      "light"
    ],
    createdAt: "2026-08-13T14:00:09.000Z",
    updatedAt: "2026-08-13T14:00:12.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-rails-logo",
    title: "K Rails — product logo",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    resourceType: "brand",
    category: "logos",
    product: "k-rails",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-030",
        fileName: "k-rails.webp",
        contentType: "image/webp",
        sizeBytes: 30982,
        storagePath: "assets/logos/k-rails/k-rails.webp",
        downloadUrl: "/brand-files/logos/k-rails/k-rails.webp"
      },
      {
        id: "ast-030-png",
        fileName: "k-rails.png",
        contentType: "image/png",
        sizeBytes: 475110,
        storagePath: "assets/logos/k-rails/k-rails.png",
        downloadUrl: "/brand-files/logos/k-rails/k-rails.png"
      },
      {
        id: "ast-030-jpg",
        fileName: "k-rails.jpg",
        contentType: "image/jpeg",
        sizeBytes: 48564,
        storagePath: "assets/logos/k-rails/k-rails.jpg",
        downloadUrl: "/brand-files/logos/k-rails/k-rails.jpg"
      }
    ],
    previewUrl: "/brand-files/logos/k-rails/k-rails.webp",
    tags: [],
    createdAt: "2026-02-10T11:00:00.000Z",
    updatedAt: "2026-02-10T11:00:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-talk-logo",
    title: "K Talk — product logo",
    description: "Dimensional product lockup for K Talk.",
    resourceType: "brand",
    category: "logos",
    product: "k-talk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-031",
        fileName: "k-talk.webp",
        contentType: "image/webp",
        sizeBytes: 22158,
        storagePath: "assets/logos/k-talk/k-talk.webp",
        downloadUrl: "/brand-files/logos/k-talk/k-talk.webp"
      },
      {
        id: "ast-031-png",
        fileName: "k-talk.png",
        contentType: "image/png",
        sizeBytes: 448272,
        storagePath: "assets/logos/k-talk/k-talk.png",
        downloadUrl: "/brand-files/logos/k-talk/k-talk.png"
      },
      {
        id: "ast-031-jpg",
        fileName: "k-talk.jpg",
        contentType: "image/jpeg",
        sizeBytes: 45950,
        storagePath: "assets/logos/k-talk/k-talk.jpg",
        downloadUrl: "/brand-files/logos/k-talk/k-talk.jpg"
      }
    ],
    previewUrl: "/brand-files/logos/k-talk/k-talk.webp",
    tags: [],
    createdAt: "2026-02-10T11:01:00.000Z",
    updatedAt: "2026-02-10T11:01:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_krails_dark",
    title: "K Rails — logo, dark",
    description: "Flat K Rails lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-rails",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-033",
        fileName: "klab_sub_brands_krails_dark.png",
        contentType: "image/png",
        sizeBytes: 80136,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_dark.png",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_dark.png"
      },
      {
        id: "ast-033-svg",
        fileName: "klab_sub_brands_krails_dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 6866,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_dark.svg",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_dark.svg"
      },
      {
        id: "ast-033-pdf",
        fileName: "klab_sub_brands_krails_dark.pdf",
        contentType: "application/pdf",
        sizeBytes: 374394,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_dark.pdf",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_dark.pdf"
      },
      {
        id: "ast-033-ai",
        fileName: "klab_sub_brands_krails_dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1585895,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_dark.ai",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_dark.svg",
    tags: [
      "dark"
    ],
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_krails_light",
    title: "K Rails — logo, light",
    description: "Flat K Rails lockup reversed for dark surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-rails",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-035",
        fileName: "klab_sub_brands_krails_light.png",
        contentType: "image/png",
        sizeBytes: 78044,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_light.png",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_light.png"
      },
      {
        id: "ast-035-svg",
        fileName: "klab_sub_brands_krails_light.svg",
        contentType: "image/svg+xml",
        sizeBytes: 8437,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_light.svg",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_light.svg"
      },
      {
        id: "ast-035-pdf",
        fileName: "klab_sub_brands_krails_light.pdf",
        contentType: "application/pdf",
        sizeBytes: 369811,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_light.pdf",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_light.pdf"
      },
      {
        id: "ast-035-ai",
        fileName: "klab_sub_brands_krails_light.ai",
        contentType: "application/postscript",
        sizeBytes: 1586374,
        storagePath: "assets/logos/k-rails/klab_sub_brands_krails_light.ai",
        downloadUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_light.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-rails/klab_sub_brands_krails_light.svg",
    tags: [
      "light"
    ],
    createdAt: "2026-08-21T12:03:00.000Z",
    updatedAt: "2026-08-21T12:03:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_ktalk_dark",
    title: "K Talk — logo, dark",
    description: "Flat K Talk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-talk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-034",
        fileName: "klab_sub_brands_ktalk_dark.png",
        contentType: "image/png",
        sizeBytes: 68550,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_dark.png",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_dark.png"
      },
      {
        id: "ast-034-svg",
        fileName: "klab_sub_brands_ktalk_dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 5247,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_dark.svg",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_dark.svg"
      },
      {
        id: "ast-034-pdf",
        fileName: "klab_sub_brands_ktalk_dark.pdf",
        contentType: "application/pdf",
        sizeBytes: 370964,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_dark.pdf",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_dark.pdf"
      },
      {
        id: "ast-034-ai",
        fileName: "klab_sub_brands_ktalk_dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1584022,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_dark.ai",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_dark.svg",
    tags: [
      "dark"
    ],
    createdAt: "2026-08-17T10:00:02.000Z",
    updatedAt: "2026-08-17T10:00:05.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_ktalk_light",
    title: "K Talk — logo, light",
    description: "Flat K Talk lockup reversed for dark surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-talk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-036",
        fileName: "klab_sub_brands_ktalk_light.png",
        contentType: "image/png",
        sizeBytes: 58629,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_light.png",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_light.png"
      },
      {
        id: "ast-036-svg",
        fileName: "klab_sub_brands_ktalk_light.svg",
        contentType: "image/svg+xml",
        sizeBytes: 6448,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_light.svg",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_light.svg"
      },
      {
        id: "ast-036-pdf",
        fileName: "klab_sub_brands_ktalk_light.pdf",
        contentType: "application/pdf",
        sizeBytes: 366898,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_light.pdf",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_light.pdf"
      },
      {
        id: "ast-036-ai",
        fileName: "klab_sub_brands_ktalk_light.ai",
        contentType: "application/postscript",
        sizeBytes: 1584407,
        storagePath: "assets/logos/k-talk/klab_sub_brands_ktalk_light.ai",
        downloadUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_light.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-talk/klab_sub_brands_ktalk_light.svg",
    tags: [
      "light"
    ],
    createdAt: "2026-08-21T12:04:00.000Z",
    updatedAt: "2026-08-21T12:04:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_krisk_dark",
    title: "K Risk — logo, dark",
    description: "Flat K Risk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-risk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-037",
        fileName: "klab_sub_brands_krisk_dark.png",
        contentType: "image/png",
        sizeBytes: 81409,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_dark.png",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_dark.png"
      },
      {
        id: "ast-037-svg",
        fileName: "klab_sub_brands_krisk_dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 5509,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_dark.svg",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_dark.svg"
      },
      {
        id: "ast-037-pdf",
        fileName: "klab_sub_brands_krisk_dark.pdf",
        contentType: "application/pdf",
        sizeBytes: 373852,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_dark.pdf",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_dark.pdf"
      },
      {
        id: "ast-037-ai",
        fileName: "klab_sub_brands_krisk_dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1584734,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_dark.ai",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_dark.svg",
    tags: [
      "dark"
    ],
    createdAt: "2026-08-21T12:05:00.000Z",
    updatedAt: "2026-08-21T12:05:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "klab_sub_brands_krisk_light",
    title: "K Risk — logo, light",
    description: "Flat K Risk lockup reversed for dark surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-risk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-038",
        fileName: "klab_sub_brands_krisk_light.png",
        contentType: "image/png",
        sizeBytes: 81395,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_light.png",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_light.png"
      },
      {
        id: "ast-038-svg",
        fileName: "klab_sub_brands_krisk_light.svg",
        contentType: "image/svg+xml",
        sizeBytes: 6724,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_light.svg",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_light.svg"
      },
      {
        id: "ast-038-pdf",
        fileName: "klab_sub_brands_krisk_light.pdf",
        contentType: "application/pdf",
        sizeBytes: 368584,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_light.pdf",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_light.pdf"
      },
      {
        id: "ast-038-ai",
        fileName: "klab_sub_brands_krisk_light.ai",
        contentType: "application/postscript",
        sizeBytes: 1585625,
        storagePath: "assets/logos/k-risk/klab_sub_brands_krisk_light.ai",
        downloadUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_light.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-risk/klab_sub_brands_krisk_light.svg",
    tags: [
      "light"
    ],
    createdAt: "2026-08-21T12:06:00.000Z",
    updatedAt: "2026-08-21T12:06:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-001",
    title: "Chevron neon — deep navy",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-040",
        fileName: "k-lab-bg-001.webp",
        contentType: "image/webp",
        sizeBytes: 111164,
        storagePath: "assets/backgrounds/k-lab-bg-001.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-001.webp"
      },
      {
        id: "ast-040-png",
        fileName: "k-lab-bg-001.png",
        contentType: "image/png",
        sizeBytes: 578452,
        storagePath: "assets/backgrounds/k-lab-bg-001.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-001.png"
      },
      {
        id: "ast-040-jpg",
        fileName: "k-lab-bg-001.jpg",
        contentType: "image/jpeg",
        sizeBytes: 61894,
        storagePath: "assets/backgrounds/k-lab-bg-001.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-001.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-001.webp",
    tags: [
      "background",
      "hero",
      "navy"
    ],
    createdAt: "2025-12-02T12:00:00.000Z",
    updatedAt: "2025-12-02T12:00:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-002",
    title: "Blue gradient field",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-041",
        fileName: "k-lab-bg-002.webp",
        contentType: "image/webp",
        sizeBytes: 28334,
        storagePath: "assets/backgrounds/k-lab-bg-002.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002.webp"
      },
      {
        id: "ast-041-png",
        fileName: "k-lab-bg-002.png",
        contentType: "image/png",
        sizeBytes: 265674,
        storagePath: "assets/backgrounds/k-lab-bg-002.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002.png"
      },
      {
        id: "ast-041-jpg",
        fileName: "k-lab-bg-002.jpg",
        contentType: "image/jpeg",
        sizeBytes: 21944,
        storagePath: "assets/backgrounds/k-lab-bg-002.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-002.webp",
    tags: [
      "background",
      "gradient"
    ],
    createdAt: "2025-12-02T12:01:00.000Z",
    updatedAt: "2025-12-02T12:01:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-002-dots",
    title: "Blue gradient field — dot texture",
    description: "The blue gradient with the brand dot matrix overlay.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-042",
        fileName: "k-lab-bg-002-dots.webp",
        contentType: "image/webp",
        sizeBytes: 42128,
        storagePath: "assets/backgrounds/k-lab-bg-002-dots.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.webp"
      },
      {
        id: "ast-042-png",
        fileName: "k-lab-bg-002-dots.png",
        contentType: "image/png",
        sizeBytes: 329934,
        storagePath: "assets/backgrounds/k-lab-bg-002-dots.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.png"
      },
      {
        id: "ast-042-jpg",
        fileName: "k-lab-bg-002-dots.jpg",
        contentType: "image/jpeg",
        sizeBytes: 27567,
        storagePath: "assets/backgrounds/k-lab-bg-002-dots.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.webp",
    tags: [
      "background",
      "gradient",
      "texture"
    ],
    createdAt: "2025-12-02T12:02:00.000Z",
    updatedAt: "2025-12-02T12:02:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-003",
    title: "Depth gradient",
    description: "Layered blue depth field for presentation backgrounds.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-043",
        fileName: "k-lab-bg-003.webp",
        contentType: "image/webp",
        sizeBytes: 100376,
        storagePath: "assets/backgrounds/k-lab-bg-003.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003.webp"
      },
      {
        id: "ast-043-png",
        fileName: "k-lab-bg-003.png",
        contentType: "image/png",
        sizeBytes: 356405,
        storagePath: "assets/backgrounds/k-lab-bg-003.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003.png"
      },
      {
        id: "ast-043-jpg",
        fileName: "k-lab-bg-003.jpg",
        contentType: "image/jpeg",
        sizeBytes: 39578,
        storagePath: "assets/backgrounds/k-lab-bg-003.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-003.webp",
    tags: [
      "background",
      "gradient",
      "slides"
    ],
    createdAt: "2025-12-02T12:03:00.000Z",
    updatedAt: "2025-12-02T12:03:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-003-dots",
    title: "Depth gradient — dot texture",
    description: "Depth field with the brand dot matrix overlay.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-044",
        fileName: "k-lab-bg-003-dots.webp",
        contentType: "image/webp",
        sizeBytes: 110128,
        storagePath: "assets/backgrounds/k-lab-bg-003-dots.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.webp"
      },
      {
        id: "ast-044-png",
        fileName: "k-lab-bg-003-dots.png",
        contentType: "image/png",
        sizeBytes: 381282,
        storagePath: "assets/backgrounds/k-lab-bg-003-dots.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.png"
      },
      {
        id: "ast-044-jpg",
        fileName: "k-lab-bg-003-dots.jpg",
        contentType: "image/jpeg",
        sizeBytes: 41895,
        storagePath: "assets/backgrounds/k-lab-bg-003-dots.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.webp",
    tags: [
      "background",
      "gradient",
      "texture"
    ],
    createdAt: "2025-12-02T12:04:00.000Z",
    updatedAt: "2025-12-02T12:04:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-004",
    title: "Horizon gradient",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-045",
        fileName: "k-lab-bg-004.webp",
        contentType: "image/webp",
        sizeBytes: 133570,
        storagePath: "assets/backgrounds/k-lab-bg-004.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004.webp"
      },
      {
        id: "ast-045-png",
        fileName: "k-lab-bg-004.png",
        contentType: "image/png",
        sizeBytes: 717113,
        storagePath: "assets/backgrounds/k-lab-bg-004.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004.png"
      },
      {
        id: "ast-045-jpg",
        fileName: "k-lab-bg-004.jpg",
        contentType: "image/jpeg",
        sizeBytes: 72769,
        storagePath: "assets/backgrounds/k-lab-bg-004.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-004.webp",
    tags: [
      "background",
      "hero"
    ],
    createdAt: "2025-12-02T12:05:00.000Z",
    updatedAt: "2025-12-02T12:05:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-004-dots",
    title: "Horizon gradient — dot texture",
    description: "Horizon gradient with the brand dot matrix overlay.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-046",
        fileName: "k-lab-bg-004-dots.webp",
        contentType: "image/webp",
        sizeBytes: 143014,
        storagePath: "assets/backgrounds/k-lab-bg-004-dots.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.webp"
      },
      {
        id: "ast-046-png",
        fileName: "k-lab-bg-004-dots.png",
        contentType: "image/png",
        sizeBytes: 732230,
        storagePath: "assets/backgrounds/k-lab-bg-004-dots.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.png"
      },
      {
        id: "ast-046-jpg",
        fileName: "k-lab-bg-004-dots.jpg",
        contentType: "image/jpeg",
        sizeBytes: 73997,
        storagePath: "assets/backgrounds/k-lab-bg-004-dots.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.webp",
    tags: [
      "background",
      "hero",
      "texture"
    ],
    createdAt: "2025-12-02T12:06:00.000Z",
    updatedAt: "2025-12-02T12:06:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-005",
    title: "Circuit field",
    description: "Technical circuit texture for data and infrastructure stories.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-047",
        fileName: "k-lab-bg-005.webp",
        contentType: "image/webp",
        sizeBytes: 159398,
        storagePath: "assets/backgrounds/k-lab-bg-005.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-005.webp"
      },
      {
        id: "ast-047-png",
        fileName: "k-lab-bg-005.png",
        contentType: "image/png",
        sizeBytes: 1105118,
        storagePath: "assets/backgrounds/k-lab-bg-005.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-005.png"
      },
      {
        id: "ast-047-jpg",
        fileName: "k-lab-bg-005.jpg",
        contentType: "image/jpeg",
        sizeBytes: 101207,
        storagePath: "assets/backgrounds/k-lab-bg-005.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-005.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-005.webp",
    tags: [
      "background",
      "technical"
    ],
    createdAt: "2025-12-02T12:07:00.000Z",
    updatedAt: "2025-12-02T12:07:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-bg-006",
    title: "Signal field",
    description: "Abstract signal texture for section breaks and covers.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-048",
        fileName: "k-lab-bg-006.webp",
        contentType: "image/webp",
        sizeBytes: 126606,
        storagePath: "assets/backgrounds/k-lab-bg-006.webp",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-006.webp"
      },
      {
        id: "ast-048-png",
        fileName: "k-lab-bg-006.png",
        contentType: "image/png",
        sizeBytes: 625821,
        storagePath: "assets/backgrounds/k-lab-bg-006.png",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-006.png"
      },
      {
        id: "ast-048-jpg",
        fileName: "k-lab-bg-006.jpg",
        contentType: "image/jpeg",
        sizeBytes: 68653,
        storagePath: "assets/backgrounds/k-lab-bg-006.jpg",
        downloadUrl: "/brand-files/backgrounds/k-lab-bg-006.jpg"
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-006.webp",
    tags: [
      "background",
      "technical"
    ],
    createdAt: "2025-12-02T12:08:00.000Z",
    updatedAt: "2025-12-02T12:08:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-01",
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-050",
        fileName: "k-lab-screen-01.webp",
        contentType: "image/webp",
        sizeBytes: 89430,
        storagePath: "assets/screens/k-lab-screen-01.webp",
        downloadUrl: "/brand-files/screens/k-lab-screen-01.webp"
      },
      {
        id: "ast-050-png",
        fileName: "k-lab-screen-01.png",
        contentType: "image/png",
        sizeBytes: 897488,
        storagePath: "assets/screens/k-lab-screen-01.png",
        downloadUrl: "/brand-files/screens/k-lab-screen-01.png"
      },
      {
        id: "ast-050-jpg",
        fileName: "k-lab-screen-01.jpg",
        contentType: "image/jpeg",
        sizeBytes: 82957,
        storagePath: "assets/screens/k-lab-screen-01.jpg",
        downloadUrl: "/brand-files/screens/k-lab-screen-01.jpg"
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-01.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:30:00.000Z",
    updatedAt: "2026-02-18T09:30:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-02",
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-051",
        fileName: "k-lab-screen-02.webp",
        contentType: "image/webp",
        sizeBytes: 47666,
        storagePath: "assets/screens/k-lab-screen-02.webp",
        downloadUrl: "/brand-files/screens/k-lab-screen-02.webp"
      },
      {
        id: "ast-051-png",
        fileName: "k-lab-screen-02.png",
        contentType: "image/png",
        sizeBytes: 342365,
        storagePath: "assets/screens/k-lab-screen-02.png",
        downloadUrl: "/brand-files/screens/k-lab-screen-02.png"
      },
      {
        id: "ast-051-jpg",
        fileName: "k-lab-screen-02.jpg",
        contentType: "image/jpeg",
        sizeBytes: 41434,
        storagePath: "assets/screens/k-lab-screen-02.jpg",
        downloadUrl: "/brand-files/screens/k-lab-screen-02.jpg"
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-02.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:31:00.000Z",
    updatedAt: "2026-02-18T09:31:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-03",
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-052",
        fileName: "k-lab-screen-03.webp",
        contentType: "image/webp",
        sizeBytes: 163600,
        storagePath: "assets/screens/k-lab-screen-03.webp",
        downloadUrl: "/brand-files/screens/k-lab-screen-03.webp"
      },
      {
        id: "ast-052-png",
        fileName: "k-lab-screen-03.png",
        contentType: "image/png",
        sizeBytes: 922093,
        storagePath: "assets/screens/k-lab-screen-03.png",
        downloadUrl: "/brand-files/screens/k-lab-screen-03.png"
      },
      {
        id: "ast-052-jpg",
        fileName: "k-lab-screen-03.jpg",
        contentType: "image/jpeg",
        sizeBytes: 97175,
        storagePath: "assets/screens/k-lab-screen-03.jpg",
        downloadUrl: "/brand-files/screens/k-lab-screen-03.jpg"
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-03.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:32:00.000Z",
    updatedAt: "2026-02-18T09:32:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-060",
    title: "Sora — variable font",
    description: "The K Lab brand typeface as a variable font covering weights 300 to 700.",
    resourceType: "brand",
    category: "fonts",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-060",
        fileName: "sora-variable.ttf",
        contentType: "font/ttf",
        sizeBytes: 110224,
        storagePath: "assets/fonts/sora-variable.ttf",
        downloadUrl: "/brand-files/fonts/sora-variable.ttf"
      }
    ],
    tags: [
      "typeface",
      "sora",
      "variable"
    ],
    createdAt: "2025-11-08T15:00:00.000Z",
    updatedAt: "2025-11-08T15:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-061",
    title: "Sora web font kit",
    description: "Ready-to-drop font-face declarations and the fallback stack for web use.",
    resourceType: "brand",
    category: "fonts",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-061",
        fileName: "sora-font-kit.css",
        contentType: "text/css",
        sizeBytes: 581,
        storagePath: "assets/fonts/sora-font-kit.css",
        downloadUrl: "/brand-files/fonts/sora-font-kit.css"
      }
    ],
    tags: [
      "typography",
      "sora",
      "webfont"
    ],
    createdAt: "2025-11-08T15:10:00.000Z",
    updatedAt: "2025-11-08T15:10:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-062",
    title: "Typography tokens",
    description: "CSS custom properties for the type scale: sizes, weights, line heights, and tracking.",
    resourceType: "brand",
    category: "fonts",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-062",
        fileName: "k-lab-typography-tokens.css",
        contentType: "text/css",
        sizeBytes: 526,
        storagePath: "assets/fonts/k-lab-typography-tokens.css",
        downloadUrl: "/brand-files/fonts/k-lab-typography-tokens.css"
      }
    ],
    tags: [
      "typography",
      "tokens"
    ],
    createdAt: "2025-11-08T15:12:00.000Z",
    updatedAt: "2025-11-08T15:12:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-001",
    title: "K Lab Brand Guidelines (WIP)",
    description: "The complete brand guidelines. Placeholder export — the working document is an Illustrator file pending a PDF export from the design team.",
    resourceType: "brand",
    category: "brand-guidelines",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-001",
        fileName: "k-lab-brand-guidelines-wip.pdf",
        contentType: "application/pdf",
        sizeBytes: 1783,
        storagePath: "assets/docs/k-lab-brand-guidelines-wip.pdf",
        downloadUrl: "/brand-files/docs/k-lab-brand-guidelines-wip.pdf"
      }
    ],
    tags: [
      "brand-book",
      "guidelines",
      "identity"
    ],
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-100",
    title: "K Lab Platform Pitch 2026",
    description: "Master platform deck: suite overview, architecture story, and pricing framework. Approved 2026-07.",
    resourceType: "sales",
    category: "pitch-decks",
    product: "k-lab",
    visibility: "employee",
    status: "active",
    files: [
      {
        id: "ast-100",
        fileName: "k-lab-platform-pitch-2026.pdf",
        contentType: "application/pdf",
        sizeBytes: 1128,
        storagePath: "assets/pitch-decks/k-lab-platform-pitch-2026.pdf",
        downloadUrl: "/api/sales-files/ast-100"
      }
    ],
    tags: [
      "deck",
      "platform",
      "approved"
    ],
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z",
    createdBy: "usr-002"
  },
  {
    id: "ast-101",
    title: "K Rails Invoice Portal Pitch",
    description: "Product deck for the invoice financing portal — municipality and enterprise variants.",
    resourceType: "sales",
    category: "pitch-decks",
    product: "k-rails",
    visibility: "employee",
    status: "active",
    files: [
      {
        id: "ast-101",
        fileName: "k-rails-invoice-pitch.pdf",
        contentType: "application/pdf",
        sizeBytes: 1031,
        storagePath: "assets/pitch-decks/k-rails-invoice-pitch.pdf",
        downloadUrl: "/api/sales-files/ast-101"
      }
    ],
    tags: [
      "deck",
      "invoice"
    ],
    createdAt: "2026-07-05T11:30:00.000Z",
    updatedAt: "2026-07-05T11:30:00.000Z",
    createdBy: "usr-002"
  },
  {
    id: "ast-110",
    title: "Product One-Pagers Pack",
    description: "One-page leave-behinds for KBPM, K Risk, K Leads, and K Rails — print-ready.",
    resourceType: "sales",
    category: "sales-materials",
    product: "k-lab",
    visibility: "employee",
    status: "active",
    files: [
      {
        id: "ast-110",
        fileName: "k-lab-product-one-pagers.pdf",
        contentType: "application/pdf",
        sizeBytes: 1047,
        storagePath: "assets/sales-materials/k-lab-product-one-pagers.pdf",
        downloadUrl: "/api/sales-files/ast-110"
      }
    ],
    tags: [
      "one-pager",
      "leave-behind"
    ],
    createdAt: "2026-07-10T10:00:00.000Z",
    updatedAt: "2026-07-10T10:00:00.000Z",
    createdBy: "usr-002"
  },
  {
    id: "ast-111",
    title: "Case Study — Regional Bank",
    description: "Anonymized results story: 40% faster onboarding with KBPM. Cleared for external sharing by legal.",
    resourceType: "sales",
    category: "sales-materials",
    product: "k-lab",
    visibility: "employee",
    status: "active",
    files: [
      {
        id: "ast-111",
        fileName: "case-study-regional-bank.pdf",
        contentType: "application/pdf",
        sizeBytes: 1034,
        storagePath: "assets/sales-materials/case-study-regional-bank.pdf",
        downloadUrl: "/api/sales-files/ast-111"
      }
    ],
    tags: [
      "case study",
      "kbpm"
    ],
    createdAt: "2026-07-15T13:45:00.000Z",
    updatedAt: "2026-07-15T13:45:00.000Z",
    createdBy: "usr-002"
  },
  {
    id: "ast-112",
    title: "Legacy Pricing Sheet 2025",
    description: "Superseded by the 2026 pricing framework in the platform pitch. Kept for reference.",
    resourceType: "sales",
    category: "sales-materials",
    product: "k-lab",
    visibility: "employee",
    status: "archived",
    files: [
      {
        id: "ast-112",
        fileName: "legacy-pricing-sheet-2025.pdf",
        contentType: "application/pdf",
        sizeBytes: 853,
        storagePath: "assets/sales-materials/legacy-pricing-sheet-2025.pdf",
        downloadUrl: "/api/sales-files/ast-112"
      }
    ],
    tags: [
      "pricing",
      "superseded"
    ],
    createdAt: "2025-11-20T09:00:00.000Z",
    updatedAt: "2025-11-20T09:00:00.000Z",
    createdBy: "usr-002"
  },
];

/** Private-location files streamed by /api/sales-files/[id] from private-assets/. */
export const PRIVATE_SEED_FILES: Record<string, string> = {
  "ast-100": "k-lab-platform-pitch-2026.pdf",
  "ast-101": "k-rails-invoice-pitch.pdf",
  "ast-110": "k-lab-product-one-pagers.pdf",
  "ast-111": "case-study-regional-bank.pdf",
  "ast-112": "legacy-pricing-sheet-2025.pdf",
};
