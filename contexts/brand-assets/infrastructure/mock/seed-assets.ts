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
    id: "k-lab-logo-blue",
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
        fileName: "k-lab-logo-blue.png",
        contentType: "image/png",
        sizeBytes: 127850,
        storagePath: "assets/logos/k-lab-logo-blue.png",
        downloadUrl: "/brand-files/logos/k-lab-logo-blue.png"
      },
      {
        id: "ast-010-svg",
        fileName: "k-lab-logo-blue.svg",
        contentType: "image/svg+xml",
        sizeBytes: 347196,
        storagePath: "assets/logos/vector/k-lab-logo-blue.svg",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-blue.svg"
      },
      {
        id: "ast-010-ai",
        fileName: "k-lab-logo-blue.ai",
        contentType: "application/postscript",
        sizeBytes: 4338417,
        storagePath: "assets/logos/vector/k-lab-logo-blue.ai",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-blue.ai"
      },
      {
        id: "ast-010-ico",
        fileName: "k-lab-logo-blue.ico",
        contentType: "image/x-icon",
        sizeBytes: 4286,
        storagePath: "assets/logos/favicons/k-lab-logo-blue.ico",
        downloadUrl: "/brand-files/logos/favicons/k-lab-logo-blue.ico"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
    tags: [
      "primary",
      "logo",
      "blue",
      "favicon"
    ],
    createdAt: "2025-11-04T09:05:00.000Z",
    updatedAt: "2026-08-18T09:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-logo-dark",
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
        fileName: "k-lab-logo-dark.png",
        contentType: "image/png",
        sizeBytes: 77075,
        storagePath: "assets/logos/k-lab-logo-dark.png",
        downloadUrl: "/brand-files/logos/k-lab-logo-dark.png"
      },
      {
        id: "ast-011-svg",
        fileName: "k-lab-logo-dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 10263,
        storagePath: "assets/logos/vector/k-lab-logo-dark.svg",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-dark.svg"
      },
      {
        id: "ast-011-ai",
        fileName: "k-lab-logo-dark.ai",
        contentType: "application/postscript",
        sizeBytes: 1585822,
        storagePath: "assets/logos/vector/k-lab-logo-dark.ai",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-dark.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab-logo-dark.png",
    tags: [
      "dark",
      "logo"
    ],
    createdAt: "2025-11-04T09:06:00.000Z",
    updatedAt: "2026-08-13T14:00:03.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-logo-white",
    title: "K Lab logo — reversed (white)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-012",
        fileName: "k-lab-logo-white.png",
        contentType: "image/png",
        sizeBytes: 78693,
        storagePath: "assets/logos/k-lab-logo-white.png",
        downloadUrl: "/brand-files/logos/k-lab-logo-white.png"
      },
      {
        id: "ast-012-svg",
        fileName: "k-lab-logo-white.svg",
        contentType: "image/svg+xml",
        sizeBytes: 8942,
        storagePath: "assets/logos/vector/k-lab-logo-white.svg",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-white.svg"
      },
      {
        id: "ast-012-ai",
        fileName: "k-lab-logo-white.ai",
        contentType: "application/postscript",
        sizeBytes: 1582103,
        storagePath: "assets/logos/vector/k-lab-logo-white.ai",
        downloadUrl: "/brand-files/logos/vector/k-lab-logo-white.ai"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab-logo-white.png",
    tags: [
      "reversed",
      "white",
      "logo"
    ],
    createdAt: "2025-11-04T09:07:00.000Z",
    updatedAt: "2026-08-13T14:00:05.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-logomark",
    title: "K Lab logomark",
    description: "The standalone mark in its rounded container — avatars, app icons, and favicons.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-014",
        fileName: "k-lab-logomark.png",
        contentType: "image/png",
        sizeBytes: 624236,
        storagePath: "assets/logos/k-lab-logomark.png",
        downloadUrl: "/brand-files/logos/k-lab-logomark.png"
      },
      {
        id: "ast-014-svg",
        fileName: "k-lab-logomark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 4776,
        storagePath: "assets/logos/vector/k-lab-logomark.svg",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark.svg"
      },
      {
        id: "ast-014-pdf",
        fileName: "k-lab-logomark.pdf",
        contentType: "application/pdf",
        sizeBytes: 379252,
        storagePath: "assets/logos/vector/k-lab-logomark.pdf",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark.pdf"
      },
      {
        id: "ast-014-ai",
        fileName: "k-lab-logomark.ai",
        contentType: "application/postscript",
        sizeBytes: 1587467,
        storagePath: "assets/logos/vector/k-lab-logomark.ai",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark.ai"
      },
      {
        id: "ast-014-ico",
        fileName: "k-lab-logomark.ico",
        contentType: "image/x-icon",
        sizeBytes: 4286,
        storagePath: "assets/logos/favicons/k-lab-logomark.ico",
        downloadUrl: "/brand-files/logos/favicons/k-lab-logomark.ico"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab-logomark.png",
    tags: [
      "mark",
      "icon",
      "logomark",
      "vector",
      "print",
      "favicon"
    ],
    createdAt: "2026-01-15T10:05:00.000Z",
    updatedAt: "2026-08-18T09:00:02.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-logomark-white",
    title: "K Lab logomark — white",
    description: "Reversed logomark for dark surfaces.",
    resourceType: "brand",
    category: "logos",
    product: "k-lab",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-015",
        fileName: "k-lab-logomark-white.png",
        contentType: "image/png",
        sizeBytes: 410086,
        storagePath: "assets/logos/k-lab-logomark-white.png",
        downloadUrl: "/brand-files/logos/k-lab-logomark-white.png"
      },
      {
        id: "ast-015-svg",
        fileName: "k-lab-logomark-white.svg",
        contentType: "image/svg+xml",
        sizeBytes: 3451,
        storagePath: "assets/logos/vector/k-lab-logomark-white.svg",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark-white.svg"
      },
      {
        id: "ast-015-pdf",
        fileName: "k-lab-logomark-white.pdf",
        contentType: "application/pdf",
        sizeBytes: 370397,
        storagePath: "assets/logos/vector/k-lab-logomark-white.pdf",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark-white.pdf"
      },
      {
        id: "ast-015-ai",
        fileName: "k-lab-logomark-white.ai",
        contentType: "application/postscript",
        sizeBytes: 1577963,
        storagePath: "assets/logos/vector/k-lab-logomark-white.ai",
        downloadUrl: "/brand-files/logos/vector/k-lab-logomark-white.ai"
      },
      {
        id: "ast-015-ico",
        fileName: "k-lab-logomark-white.ico",
        contentType: "image/x-icon",
        sizeBytes: 4286,
        storagePath: "assets/logos/favicons/k-lab-logomark-white.ico",
        downloadUrl: "/brand-files/logos/favicons/k-lab-logomark-white.ico"
      }
    ],
    previewUrl: "/brand-files/logos/k-lab-logomark-white.png",
    tags: [
      "logomark",
      "reversed",
      "white",
      "vector",
      "print",
      "favicon"
    ],
    createdAt: "2025-11-04T09:13:00.000Z",
    updatedAt: "2026-08-18T09:00:01.000Z",
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
        storagePath: "assets/sub-brands/k-rails.webp",
        downloadUrl: "/brand-files/sub-brands/k-rails.webp"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-rails.webp",
    tags: [],
    createdAt: "2026-02-10T11:00:00.000Z",
    updatedAt: "2026-02-10T11:00:00.000Z",
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
        storagePath: "assets/sub-brands/k-talk.webp",
        downloadUrl: "/brand-files/sub-brands/k-talk.webp"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-talk.webp",
    tags: [],
    createdAt: "2026-02-10T11:01:00.000Z",
    updatedAt: "2026-02-10T11:01:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-rails-logo-dark",
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
        fileName: "k-rails-logo-dark.png",
        contentType: "image/png",
        sizeBytes: 57311,
        storagePath: "assets/sub-brands/k-rails-logo-dark.png",
        downloadUrl: "/brand-files/sub-brands/k-rails-logo-dark.png"
      },
      {
        id: "ast-033-svg",
        fileName: "k-rails-logo-dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 4328,
        storagePath: "assets/sub-brands/k-rails-logo-dark.svg",
        downloadUrl: "/brand-files/sub-brands/k-rails-logo-dark.svg"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-rails-logo-dark.png",
    tags: [
      "dark"
    ],
    createdAt: "2026-08-17T10:00:00.000Z",
    updatedAt: "2026-08-17T10:00:01.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-talk-logo-dark",
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
        fileName: "k-talk-logo-dark.png",
        contentType: "image/png",
        sizeBytes: 48825,
        storagePath: "assets/sub-brands/k-talk-logo-dark.png",
        downloadUrl: "/brand-files/sub-brands/k-talk-logo-dark.png"
      },
      {
        id: "ast-034-svg",
        fileName: "k-talk-logo-dark.svg",
        contentType: "image/svg+xml",
        sizeBytes: 3013,
        storagePath: "assets/sub-brands/k-talk-logo-dark.svg",
        downloadUrl: "/brand-files/sub-brands/k-talk-logo-dark.svg"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-talk-logo-dark.png",
    tags: [
      "dark"
    ],
    createdAt: "2026-08-17T10:00:02.000Z",
    updatedAt: "2026-08-17T10:00:03.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-001.webp",
    tags: [
      "background",
      "hero",
      "navy"
    ],
    createdAt: "2025-12-02T12:00:00.000Z",
    updatedAt: "2025-12-02T12:00:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-002.webp",
    tags: [
      "background",
      "gradient"
    ],
    createdAt: "2025-12-02T12:01:00.000Z",
    updatedAt: "2025-12-02T12:01:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.webp",
    tags: [
      "background",
      "gradient",
      "texture"
    ],
    createdAt: "2025-12-02T12:02:00.000Z",
    updatedAt: "2025-12-02T12:02:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-003.webp",
    tags: [
      "background",
      "gradient",
      "slides"
    ],
    createdAt: "2025-12-02T12:03:00.000Z",
    updatedAt: "2025-12-02T12:03:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.webp",
    tags: [
      "background",
      "gradient",
      "texture"
    ],
    createdAt: "2025-12-02T12:04:00.000Z",
    updatedAt: "2025-12-02T12:04:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-004.webp",
    tags: [
      "background",
      "hero"
    ],
    createdAt: "2025-12-02T12:05:00.000Z",
    updatedAt: "2025-12-02T12:05:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.webp",
    tags: [
      "background",
      "hero",
      "texture"
    ],
    createdAt: "2025-12-02T12:06:00.000Z",
    updatedAt: "2025-12-02T12:06:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-005.webp",
    tags: [
      "background",
      "technical"
    ],
    createdAt: "2025-12-02T12:07:00.000Z",
    updatedAt: "2025-12-02T12:07:00.000Z",
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
      }
    ],
    previewUrl: "/brand-files/backgrounds/k-lab-bg-006.webp",
    tags: [
      "background",
      "technical"
    ],
    createdAt: "2025-12-02T12:08:00.000Z",
    updatedAt: "2025-12-02T12:08:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-01",
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
    resourceType: "brand",
    category: "photography",
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
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-01.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:30:00.000Z",
    updatedAt: "2026-02-18T09:30:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-02",
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
    resourceType: "brand",
    category: "photography",
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
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-02.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:31:00.000Z",
    updatedAt: "2026-02-18T09:31:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-lab-screen-03",
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
    resourceType: "brand",
    category: "photography",
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
      }
    ],
    previewUrl: "/brand-files/screens/k-lab-screen-03.webp",
    tags: [
      "render",
      "marketing"
    ],
    createdAt: "2026-02-18T09:32:00.000Z",
    updatedAt: "2026-02-18T09:32:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-rails-keyvisual",
    title: "K Rails — key visual",
    description: "Campaign key visual for K Rails.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-rails",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-053",
        fileName: "k-rails-keyvisual.webp",
        contentType: "image/webp",
        sizeBytes: 30038,
        storagePath: "assets/sub-brands/k-rails-keyvisual.webp",
        downloadUrl: "/brand-files/sub-brands/k-rails-keyvisual.webp"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-rails-keyvisual.webp",
    tags: [
      "keyvisual",
      "campaign"
    ],
    createdAt: "2026-02-20T14:00:00.000Z",
    updatedAt: "2026-02-20T14:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "k-talk-keyvisual",
    title: "K Talk — key visual",
    description: "Campaign key visual for K Talk.",
    resourceType: "brand",
    category: "brand-imagery",
    product: "k-talk",
    visibility: "public",
    status: "active",
    files: [
      {
        id: "ast-054",
        fileName: "k-talk-keyvisual.webp",
        contentType: "image/webp",
        sizeBytes: 28750,
        storagePath: "assets/sub-brands/k-talk-keyvisual.webp",
        downloadUrl: "/brand-files/sub-brands/k-talk-keyvisual.webp"
      }
    ],
    previewUrl: "/brand-files/sub-brands/k-talk-keyvisual.webp",
    tags: [
      "keyvisual",
      "campaign"
    ],
    createdAt: "2026-02-20T14:01:00.000Z",
    updatedAt: "2026-02-20T14:01:00.000Z",
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
