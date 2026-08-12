import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * Seed catalog for prototype development — one record per primary resource
 * type (see "Define Brand Portal Schemas"). Public assets are served straight
 * from /public/brand-files; employee assets only through /api/sales-files/[id]
 * which enforces the session cookie.
 *
 * Shared by the client mock repository AND the server download route, so the
 * catalog must stay framework-free.
 */
export const SEED_BRAND_ASSETS: BrandAsset[] = [
  // ── Brand guidelines (public) ──────────────────────────────────────────
  {
    id: "ast-001",
    title: "K Lab Brand Guidelines v3",
    description:
      "The complete brand book: logo usage, color system, typography, spacing, and application examples.",
    category: "brand-guidelines",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-brand-guidelines-v3.pdf",
      contentType: "application/pdf",
      sizeBytes: 1169,
      storagePath: "assets/brand-guidelines/k-lab-brand-guidelines-v3.pdf",
      downloadUrl: "/brand-files/k-lab-brand-guidelines-v3.pdf",
    },
    tags: ["guidelines", "brand book", "identity"],
    createdAt: "2026-05-04T09:00:00.000Z",
    updatedAt: "2026-07-18T14:30:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-002",
    title: "Voice & Tone Playbook",
    description:
      "How K Lab sounds: writing principles, terminology, and do/don't examples for product and marketing copy.",
    category: "brand-guidelines",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-voice-and-tone.pdf",
      contentType: "application/pdf",
      sizeBytes: 1082,
      storagePath: "assets/brand-guidelines/k-lab-voice-and-tone.pdf",
      downloadUrl: "/brand-files/k-lab-voice-and-tone.pdf",
    },
    tags: ["copywriting", "tone", "content"],
    createdAt: "2026-05-11T10:15:00.000Z",
    updatedAt: "2026-06-02T08:45:00.000Z",
    createdBy: "usr-001",
  },

  // ── Logos (public) ─────────────────────────────────────────────────────
  {
    id: "ast-010",
    title: "K Lab Logo — Primary",
    description:
      "Primary horizontal lockup on transparent background. Use on light surfaces with clearspace of 1× the K height.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-primary.svg",
      contentType: "image/svg+xml",
      sizeBytes: 556,
      storagePath: "assets/logos/k-lab-logo-primary.svg",
      downloadUrl: "/brand-files/k-lab-logo-primary.svg",
    },
    previewUrl: "/brand-files/k-lab-logo-primary.svg",
    tags: ["logo", "primary", "svg"],
    createdAt: "2026-05-04T09:05:00.000Z",
    updatedAt: "2026-05-04T09:05:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-011",
    title: "K Lab Logo — Monochrome",
    description:
      "Single-color lockup for dark surfaces, engraving, and single-ink print runs.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-logo-mono.svg",
      contentType: "image/svg+xml",
      sizeBytes: 431,
      storagePath: "assets/logos/k-lab-logo-mono.svg",
      downloadUrl: "/brand-files/k-lab-logo-mono.svg",
    },
    previewUrl: "/brand-files/k-lab-logo-mono.svg",
    tags: ["logo", "monochrome", "svg"],
    createdAt: "2026-05-04T09:06:00.000Z",
    updatedAt: "2026-05-04T09:06:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-012",
    title: "K Lab Icon Mark",
    description:
      "Standalone K mark for avatars, favicons, and app icons. Minimum size 16px.",
    category: "logos",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-icon.svg",
      contentType: "image/svg+xml",
      sizeBytes: 310,
      storagePath: "assets/logos/k-lab-icon.svg",
      downloadUrl: "/brand-files/k-lab-icon.svg",
    },
    previewUrl: "/brand-files/k-lab-icon.svg",
    tags: ["icon", "mark", "favicon"],
    createdAt: "2026-05-04T09:07:00.000Z",
    updatedAt: "2026-05-04T09:07:00.000Z",
    createdBy: "usr-001",
  },

  // ── Brand imagery (public) ─────────────────────────────────────────────
  {
    id: "ast-020",
    title: "Wave Background",
    description:
      "Signature wave gradient used across auth pages and hero sections. 2560×1440.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-wave.webp",
      contentType: "image/webp",
      sizeBytes: 8104,
      storagePath: "assets/brand-imagery/k-lab-bg-wave.webp",
      downloadUrl: "/brand-files/k-lab-bg-wave.webp",
    },
    previewUrl: "/brand-files/k-lab-bg-wave.webp",
    tags: ["background", "hero", "gradient"],
    createdAt: "2026-05-06T12:00:00.000Z",
    updatedAt: "2026-05-06T12:00:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-021",
    title: "Orange Field Background",
    description:
      "Bold accent-brand field for section dividers and social cards.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-orange.webp",
      contentType: "image/webp",
      sizeBytes: 5704,
      storagePath: "assets/brand-imagery/k-lab-bg-orange.webp",
      downloadUrl: "/brand-files/k-lab-bg-orange.webp",
    },
    previewUrl: "/brand-files/k-lab-bg-orange.webp",
    tags: ["background", "accent", "social"],
    createdAt: "2026-05-06T12:05:00.000Z",
    updatedAt: "2026-05-06T12:05:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-022",
    title: "Gradient Mesh Background",
    description:
      "Soft gradient mesh for slide backgrounds and report covers.",
    category: "brand-imagery",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-bg-gradient.webp",
      contentType: "image/webp",
      sizeBytes: 4092,
      storagePath: "assets/brand-imagery/k-lab-bg-gradient.webp",
      downloadUrl: "/brand-files/k-lab-bg-gradient.webp",
    },
    previewUrl: "/brand-files/k-lab-bg-gradient.webp",
    tags: ["background", "gradient", "slides"],
    createdAt: "2026-05-06T12:10:00.000Z",
    updatedAt: "2026-05-06T12:10:00.000Z",
    createdBy: "usr-001",
  },

  // ── Fonts (public) ─────────────────────────────────────────────────────
  {
    id: "ast-030",
    title: "Sora Font Kit",
    description:
      "Web font-face kit for Sora, the K Lab brand typeface — weights 300–700 with usage notes.",
    category: "fonts",
    visibility: "public",
    status: "active",
    file: {
      fileName: "sora-font-kit.css",
      contentType: "text/css",
      sizeBytes: 511,
      storagePath: "assets/fonts/sora-font-kit.css",
      downloadUrl: "/brand-files/sora-font-kit.css",
    },
    tags: ["typography", "sora", "webfont"],
    createdAt: "2026-05-08T15:00:00.000Z",
    updatedAt: "2026-05-08T15:00:00.000Z",
    createdBy: "usr-001",
  },
  {
    id: "ast-031",
    title: "Typography Tokens",
    description:
      "CSS custom properties for the type scale: sizes, weights, line heights, and letter spacing.",
    category: "fonts",
    visibility: "public",
    status: "active",
    file: {
      fileName: "k-lab-typography-tokens.css",
      contentType: "text/css",
      sizeBytes: 528,
      storagePath: "assets/fonts/k-lab-typography-tokens.css",
      downloadUrl: "/brand-files/k-lab-typography-tokens.css",
    },
    tags: ["typography", "tokens", "css"],
    createdAt: "2026-05-08T15:10:00.000Z",
    updatedAt: "2026-05-08T15:10:00.000Z",
    createdBy: "usr-001",
  },

  // ── Pitch decks (employee) ─────────────────────────────────────────────
  {
    id: "ast-100",
    title: "K Lab Platform Pitch 2026",
    description:
      "Master platform deck: suite overview, architecture story, and pricing framework. Approved 2026-07.",
    category: "pitch-decks",
    visibility: "employee",
    status: "active",
    file: {
      fileName: "k-lab-platform-pitch-2026.pdf",
      contentType: "application/pdf",
      sizeBytes: 1130,
      storagePath: "assets/pitch-decks/k-lab-platform-pitch-2026.pdf",
      downloadUrl: "/api/sales-files/ast-100",
    },
    tags: ["deck", "platform", "approved"],
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-22T16:00:00.000Z",
    createdBy: "usr-002",
  },
  {
    id: "ast-101",
    title: "K Rails Invoice Portal Pitch",
    description:
      "Product deck for the invoice financing portal — municipality and enterprise variants.",
    category: "pitch-decks",
    visibility: "employee",
    status: "active",
    file: {
      fileName: "k-rails-invoice-pitch.pdf",
      contentType: "application/pdf",
      sizeBytes: 1033,
      storagePath: "assets/pitch-decks/k-rails-invoice-pitch.pdf",
      downloadUrl: "/api/sales-files/ast-101",
    },
    tags: ["deck", "k-rails", "invoice"],
    createdAt: "2026-07-05T11:30:00.000Z",
    updatedAt: "2026-07-05T11:30:00.000Z",
    createdBy: "usr-002",
  },

  // ── Sales materials (employee) ─────────────────────────────────────────
  {
    id: "ast-110",
    title: "Product One-Pagers Pack",
    description:
      "One-page leave-behinds for KBPM, K Risk, K Leads, and K Rails — print-ready.",
    category: "sales-materials",
    visibility: "employee",
    status: "active",
    file: {
      fileName: "k-lab-product-one-pagers.pdf",
      contentType: "application/pdf",
      sizeBytes: 1049,
      storagePath: "assets/sales-materials/k-lab-product-one-pagers.pdf",
      downloadUrl: "/api/sales-files/ast-110",
    },
    tags: ["one-pager", "leave-behind"],
    createdAt: "2026-07-10T10:00:00.000Z",
    updatedAt: "2026-07-28T09:20:00.000Z",
    createdBy: "usr-002",
  },
  {
    id: "ast-111",
    title: "Case Study — Regional Bank",
    description:
      "Anonymized results story: 40% faster onboarding with KBPM. Cleared for external sharing by legal.",
    category: "sales-materials",
    visibility: "employee",
    status: "active",
    file: {
      fileName: "case-study-regional-bank.pdf",
      contentType: "application/pdf",
      sizeBytes: 1036,
      storagePath: "assets/sales-materials/case-study-regional-bank.pdf",
      downloadUrl: "/api/sales-files/ast-111",
    },
    tags: ["case study", "kbpm"],
    createdAt: "2026-07-15T13:45:00.000Z",
    updatedAt: "2026-07-15T13:45:00.000Z",
    createdBy: "usr-002",
  },
  {
    id: "ast-112",
    title: "Legacy Pricing Sheet 2025",
    description:
      "Superseded by the 2026 pricing framework in the platform pitch. Kept for reference.",
    category: "sales-materials",
    visibility: "employee",
    status: "archived",
    file: {
      fileName: "legacy-pricing-sheet-2025.pdf",
      contentType: "application/pdf",
      sizeBytes: 855,
      storagePath: "assets/sales-materials/legacy-pricing-sheet-2025.pdf",
      downloadUrl: "/api/sales-files/ast-112",
    },
    tags: ["pricing", "superseded"],
    createdAt: "2025-11-20T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z",
    createdBy: "usr-002",
  },
];

/** Employee-only files streamed by /api/sales-files/[id] from private-assets/. */
export const PRIVATE_SEED_FILES: Record<string, string> = {
  "ast-100": "k-lab-platform-pitch-2026.pdf",
  "ast-101": "k-rails-invoice-pitch.pdf",
  "ast-110": "k-lab-product-one-pagers.pdf",
  "ast-111": "case-study-regional-bank.pdf",
  "ast-112": "legacy-pricing-sheet-2025.pdf",
};
