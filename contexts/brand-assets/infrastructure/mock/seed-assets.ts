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
    id: "ast-010",
    title: "K Lab logo — primary (blue)",
    description: "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-blue.png",
      contentType: "image/png",
      sizeBytes: 167789,
      storagePath: "assets/logos/k-lab-logo-blue.png",
      downloadUrl: "/brand-files/logos/k-lab-logo-blue.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logo-blue.png",
    tags: [
      "primary",
      "logo",
      "blue"
    ],
    createdAt: "2025-11-04T09:05:00.000Z",
    updatedAt: "2025-11-04T09:05:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-011",
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-dark.png",
      contentType: "image/png",
      sizeBytes: 99305,
      storagePath: "assets/logos/k-lab-logo-dark.png",
      downloadUrl: "/brand-files/logos/k-lab-logo-dark.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logo-dark.png",
    tags: [
      "dark",
      "logo"
    ],
    createdAt: "2025-11-04T09:06:00.000Z",
    updatedAt: "2025-11-04T09:06:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-012",
    title: "K Lab logo — reversed (white)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-white.png",
      contentType: "image/png",
      sizeBytes: 89309,
      storagePath: "assets/logos/k-lab-logo-white.png",
      downloadUrl: "/brand-files/logos/k-lab-logo-white.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logo-white.png",
    tags: [
      "reversed",
      "white",
      "logo"
    ],
    createdAt: "2025-11-04T09:07:00.000Z",
    updatedAt: "2025-11-04T09:07:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-013",
    title: "K Lab logo — 2025 refresh",
    description: "The 2025 identity lockup with the dimensional chevron treatment.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-2025.png",
      contentType: "image/png",
      sizeBytes: 97387,
      storagePath: "assets/logos/k-lab-logo-2025.png",
      downloadUrl: "/brand-files/logos/k-lab-logo-2025.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logo-2025.png",
    tags: [
      "2025",
      "logo"
    ],
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-014",
    title: "K Lab logomark",
    description: "The standalone chevron mark in its rounded container — avatars, app icons, and favicons.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logomark-2025.png",
      contentType: "image/png",
      sizeBytes: 112121,
      storagePath: "assets/logos/k-lab-logomark-2025.png",
      downloadUrl: "/brand-files/logos/k-lab-logomark-2025.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logomark-2025.png",
    tags: [
      "mark",
      "icon",
      "logomark"
    ],
    createdAt: "2026-01-15T10:05:00.000Z",
    updatedAt: "2026-01-15T10:05:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-015",
    title: "K Lab logomark — dark",
    description: "Dark variant of the chevron mark for light interfaces.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logomark-dark.png",
      contentType: "image/png",
      sizeBytes: 92626,
      storagePath: "assets/logos/k-lab-logomark-dark.png",
      downloadUrl: "/brand-files/logos/k-lab-logomark-dark.png"
    },
    previewUrl: "/brand-files/logos/k-lab-logomark-dark.png",
    tags: [
      "logomark",
      "dark"
    ],
    createdAt: "2025-11-04T09:10:00.000Z",
    updatedAt: "2025-11-04T09:10:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-020",
    title: "K Lab logo — vector (PDF)",
    description: "Scalable vector master of the 2025 lockup for print and large format.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-2025.pdf",
      contentType: "application/pdf",
      sizeBytes: 377579,
      storagePath: "assets/logos/vector/k-lab-logo-2025.pdf",
      downloadUrl: "/brand-files/logos/vector/k-lab-logo-2025.pdf"
    },
    tags: [
      "vector",
      "print",
      "logo"
    ],
    createdAt: "2026-01-15T10:10:00.000Z",
    updatedAt: "2026-01-15T10:10:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-021",
    title: "K Lab logomark — vector (PDF)",
    description: "Scalable vector master of the chevron mark.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logomark-2025.pdf",
      contentType: "application/pdf",
      sizeBytes: 379252,
      storagePath: "assets/logos/vector/k-lab-logomark-2025.pdf",
      downloadUrl: "/brand-files/logos/vector/k-lab-logomark-2025.pdf"
    },
    tags: [
      "vector",
      "print",
      "logomark"
    ],
    createdAt: "2026-01-15T10:11:00.000Z",
    updatedAt: "2026-01-15T10:11:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-022",
    title: "K Lab logomark — dark, vector (PDF)",
    description: "Vector master of the dark chevron mark.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logomark-dark.pdf",
      contentType: "application/pdf",
      sizeBytes: 371413,
      storagePath: "assets/logos/vector/k-lab-logomark-dark.pdf",
      downloadUrl: "/brand-files/logos/vector/k-lab-logomark-dark.pdf"
    },
    tags: [
      "vector",
      "print",
      "logomark",
      "dark"
    ],
    createdAt: "2025-11-04T09:12:00.000Z",
    updatedAt: "2025-11-04T09:12:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-023",
    title: "K Lab logomark — white, vector (PDF)",
    description: "Vector master of the reversed chevron mark for dark surfaces.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logomark-white.pdf",
      contentType: "application/pdf",
      sizeBytes: 370397,
      storagePath: "assets/logos/vector/k-lab-logomark-white.pdf",
      downloadUrl: "/brand-files/logos/vector/k-lab-logomark-white.pdf"
    },
    tags: [
      "vector",
      "print",
      "logomark",
      "reversed"
    ],
    createdAt: "2025-11-04T09:13:00.000Z",
    updatedAt: "2025-11-04T09:13:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-030",
    title: "K Rails — product logo",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-rails.webp",
      contentType: "image/webp",
      sizeBytes: 30982,
      storagePath: "assets/sub-brands/k-rails.webp",
      downloadUrl: "/brand-files/sub-brands/k-rails.webp"
    },
    previewUrl: "/brand-files/sub-brands/k-rails.webp",
    tags: [
      "product",
      "k-rails"
    ],
    createdAt: "2026-02-10T11:00:00.000Z",
    updatedAt: "2026-02-10T11:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-031",
    title: "K Talk — product logo",
    description: "Dimensional product lockup for K Talk.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-talk.webp",
      contentType: "image/webp",
      sizeBytes: 22158,
      storagePath: "assets/sub-brands/k-talk.webp",
      downloadUrl: "/brand-files/sub-brands/k-talk.webp"
    },
    previewUrl: "/brand-files/sub-brands/k-talk.webp",
    tags: [
      "product",
      "k-talk"
    ],
    createdAt: "2026-02-10T11:01:00.000Z",
    updatedAt: "2026-02-10T11:01:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-032",
    title: "Kena — product logo",
    description: "Dimensional product lockup for Kena.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "kena.webp",
      contentType: "image/webp",
      sizeBytes: 28474,
      storagePath: "assets/sub-brands/kena.webp",
      downloadUrl: "/brand-files/sub-brands/kena.webp"
    },
    previewUrl: "/brand-files/sub-brands/kena.webp",
    tags: [
      "product",
      "kena"
    ],
    createdAt: "2026-02-10T11:02:00.000Z",
    updatedAt: "2026-02-10T11:02:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-040",
    title: "Chevron neon — deep navy",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-001.webp",
      contentType: "image/webp",
      sizeBytes: 111164,
      storagePath: "assets/backgrounds/k-lab-bg-001.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-001.webp"
    },
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
    id: "ast-041",
    title: "Blue gradient field",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-002.webp",
      contentType: "image/webp",
      sizeBytes: 28334,
      storagePath: "assets/backgrounds/k-lab-bg-002.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-002.webp"
    },
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
    id: "ast-042",
    title: "Blue gradient field — dot texture",
    description: "The blue gradient with the brand dot matrix overlay.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-002-dots.webp",
      contentType: "image/webp",
      sizeBytes: 42128,
      storagePath: "assets/backgrounds/k-lab-bg-002-dots.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-002-dots.webp"
    },
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
    id: "ast-043",
    title: "Depth gradient",
    description: "Layered blue depth field for presentation backgrounds.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-003.webp",
      contentType: "image/webp",
      sizeBytes: 100376,
      storagePath: "assets/backgrounds/k-lab-bg-003.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-003.webp"
    },
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
    id: "ast-044",
    title: "Depth gradient — dot texture",
    description: "Depth field with the brand dot matrix overlay.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-003-dots.webp",
      contentType: "image/webp",
      sizeBytes: 110128,
      storagePath: "assets/backgrounds/k-lab-bg-003-dots.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-003-dots.webp"
    },
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
    id: "ast-045",
    title: "Horizon gradient",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-004.webp",
      contentType: "image/webp",
      sizeBytes: 133570,
      storagePath: "assets/backgrounds/k-lab-bg-004.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-004.webp"
    },
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
    id: "ast-046",
    title: "Horizon gradient — dot texture",
    description: "Horizon gradient with the brand dot matrix overlay.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-004-dots.webp",
      contentType: "image/webp",
      sizeBytes: 143014,
      storagePath: "assets/backgrounds/k-lab-bg-004-dots.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-004-dots.webp"
    },
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
    id: "ast-047",
    title: "Circuit field",
    description: "Technical circuit texture for data and infrastructure stories.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-005.webp",
      contentType: "image/webp",
      sizeBytes: 159398,
      storagePath: "assets/backgrounds/k-lab-bg-005.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-005.webp"
    },
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
    id: "ast-048",
    title: "Signal field",
    description: "Abstract signal texture for section breaks and covers.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-006.webp",
      contentType: "image/webp",
      sizeBytes: 126606,
      storagePath: "assets/backgrounds/k-lab-bg-006.webp",
      downloadUrl: "/brand-files/backgrounds/k-lab-bg-006.webp"
    },
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
    id: "ast-050",
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-screen-01.webp",
      contentType: "image/webp",
      sizeBytes: 89430,
      storagePath: "assets/screens/k-lab-screen-01.webp",
      downloadUrl: "/brand-files/screens/k-lab-screen-01.webp"
    },
    previewUrl: "/brand-files/screens/k-lab-screen-01.webp",
    tags: [
      "render",
      "product",
      "marketing"
    ],
    createdAt: "2026-02-18T09:30:00.000Z",
    updatedAt: "2026-02-18T09:30:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-051",
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-screen-02.webp",
      contentType: "image/webp",
      sizeBytes: 47666,
      storagePath: "assets/screens/k-lab-screen-02.webp",
      downloadUrl: "/brand-files/screens/k-lab-screen-02.webp"
    },
    previewUrl: "/brand-files/screens/k-lab-screen-02.webp",
    tags: [
      "render",
      "product",
      "marketing"
    ],
    createdAt: "2026-02-18T09:31:00.000Z",
    updatedAt: "2026-02-18T09:31:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-052",
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-screen-03.webp",
      contentType: "image/webp",
      sizeBytes: 163600,
      storagePath: "assets/screens/k-lab-screen-03.webp",
      downloadUrl: "/brand-files/screens/k-lab-screen-03.webp"
    },
    previewUrl: "/brand-files/screens/k-lab-screen-03.webp",
    tags: [
      "render",
      "product",
      "marketing"
    ],
    createdAt: "2026-02-18T09:32:00.000Z",
    updatedAt: "2026-02-18T09:32:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-053",
    title: "K Rails — key visual",
    description: "Campaign key visual for K Rails.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-rails-keyvisual.webp",
      contentType: "image/webp",
      sizeBytes: 30038,
      storagePath: "assets/sub-brands/k-rails-keyvisual.webp",
      downloadUrl: "/brand-files/sub-brands/k-rails-keyvisual.webp"
    },
    previewUrl: "/brand-files/sub-brands/k-rails-keyvisual.webp",
    tags: [
      "keyvisual",
      "k-rails",
      "campaign"
    ],
    createdAt: "2026-02-20T14:00:00.000Z",
    updatedAt: "2026-02-20T14:00:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-054",
    title: "K Talk — key visual",
    description: "Campaign key visual for K Talk.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-talk-keyvisual.webp",
      contentType: "image/webp",
      sizeBytes: 28750,
      storagePath: "assets/sub-brands/k-talk-keyvisual.webp",
      downloadUrl: "/brand-files/sub-brands/k-talk-keyvisual.webp"
    },
    previewUrl: "/brand-files/sub-brands/k-talk-keyvisual.webp",
    tags: [
      "keyvisual",
      "k-talk",
      "campaign"
    ],
    createdAt: "2026-02-20T14:01:00.000Z",
    updatedAt: "2026-02-20T14:01:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-055",
    title: "Kena — key visual",
    description: "Campaign key visual for Kena.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "kena-keyvisual.webp",
      contentType: "image/webp",
      sizeBytes: 28862,
      storagePath: "assets/sub-brands/kena-keyvisual.webp",
      downloadUrl: "/brand-files/sub-brands/kena-keyvisual.webp"
    },
    previewUrl: "/brand-files/sub-brands/kena-keyvisual.webp",
    tags: [
      "keyvisual",
      "kena",
      "campaign"
    ],
    createdAt: "2026-02-20T14:02:00.000Z",
    updatedAt: "2026-02-20T14:02:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-060",
    title: "Sora — variable font",
    description: "The K Lab brand typeface as a variable font covering weights 300 to 700.",
    category: "fonts",
    visibility: "public",
    status: "active",
    file: {
      fileName: "sora-variable.ttf",
      contentType: "font/ttf",
      sizeBytes: 110224,
      storagePath: "assets/fonts/sora-variable.ttf",
      downloadUrl: "/brand-files/fonts/sora-variable.ttf"
    },
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
    category: "fonts",
    visibility: "public",
    status: "active",
    file: {
      fileName: "sora-font-kit.css",
      contentType: "text/css",
      sizeBytes: 581,
      storagePath: "assets/fonts/sora-font-kit.css",
      downloadUrl: "/brand-files/fonts/sora-font-kit.css"
    },
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
    category: "fonts",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-typography-tokens.css",
      contentType: "text/css",
      sizeBytes: 526,
      storagePath: "assets/fonts/k-lab-typography-tokens.css",
      downloadUrl: "/brand-files/fonts/k-lab-typography-tokens.css"
    },
    tags: [
      "typography",
      "tokens",
      "css"
    ],
    createdAt: "2025-11-08T15:12:00.000Z",
    updatedAt: "2025-11-08T15:12:00.000Z",
    createdBy: "usr-001"
  },
  {
    id: "ast-001",
    title: "K Lab Brand Guidelines (WIP)",
    description: "The complete brand guidelines. Placeholder export — the working document is an Illustrator file pending a PDF export from the design team.",
    category: "brand-guidelines",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-brand-guidelines-wip.pdf",
      contentType: "application/pdf",
      sizeBytes: 1783,
      storagePath: "assets/docs/k-lab-brand-guidelines-wip.pdf",
      downloadUrl: "/brand-files/docs/k-lab-brand-guidelines-wip.pdf"
    },
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
    category: "pitch-decks",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-platform-pitch-2026.pdf",
      contentType: "application/pdf",
      sizeBytes: 1128,
      storagePath: "assets/pitch-decks/k-lab-platform-pitch-2026.pdf",
      downloadUrl: "/api/sales-files/ast-100"
    },
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
    category: "pitch-decks",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-rails-invoice-pitch.pdf",
      contentType: "application/pdf",
      sizeBytes: 1031,
      storagePath: "assets/pitch-decks/k-rails-invoice-pitch.pdf",
      downloadUrl: "/api/sales-files/ast-101"
    },
    tags: [
      "deck",
      "k-rails",
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
    category: "sales-materials",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-product-one-pagers.pdf",
      contentType: "application/pdf",
      sizeBytes: 1047,
      storagePath: "assets/sales-materials/k-lab-product-one-pagers.pdf",
      downloadUrl: "/api/sales-files/ast-110"
    },
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
    category: "sales-materials",
    visibility: "public",
    status: "active",
    file: {
      fileName: "case-study-regional-bank.pdf",
      contentType: "application/pdf",
      sizeBytes: 1034,
      storagePath: "assets/sales-materials/case-study-regional-bank.pdf",
      downloadUrl: "/api/sales-files/ast-111"
    },
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
    category: "sales-materials",
    visibility: "public",
    status: "archived",
    file: {
      fileName: "legacy-pricing-sheet-2025.pdf",
      contentType: "application/pdf",
      sizeBytes: 853,
      storagePath: "assets/sales-materials/legacy-pricing-sheet-2025.pdf",
      downloadUrl: "/api/sales-files/ast-112"
    },
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
