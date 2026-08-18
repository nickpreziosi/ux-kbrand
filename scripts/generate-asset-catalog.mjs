/**
 * Regenerates the seed catalog from the files actually present in
 * public/brand-files/ and private-assets/:
 *
 *   node scripts/generate-asset-catalog.mjs
 *
 * File sizes are read from disk, so the catalog can never drift from what the
 * portal serves. Run this after adding or replacing a brand file. Titles and
 * descriptions live in CATALOG below — they are asset data (authored by admins
 * in production), not UI copy, so they are not translated.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public", "brand-files");
const privateDir = join(root, "private-assets");

const CONTENT_TYPES = {
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  ai: "application/postscript",
  css: "text/css",
  ttf: "font/ttf",
  ico: "image/x-icon",
};

/**
 * Assets that are the same artwork in different formats. The key is the
 * `group` referenced by catalog entries below; title/description are the copy
 * the grouped card shows, so each member keeps its own format-specific title
 * for the admin table. Adding a format to a group is one CATALOG entry — the
 * card picks it up with no UI change.
 */
const GROUPS = {
  "k-lab-logo-blue": {
    title: "K Lab logo — primary (blue)",
    description:
      "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
  },
  "k-lab-logo-dark": {
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
  },
  "k-lab-logo-white": {
    title: "K Lab logo — reversed (white)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
  },
  "k-lab-logomark": {
    title: "K Lab logomark",
    description:
      "The standalone mark in its rounded container — avatars, app icons, and favicons.",
  },
  "k-lab-logomark-white": {
    title: "K Lab logomark — white",
    description: "Reversed logomark for dark surfaces.",
  },
  "k-rails-logo": {
    title: "K Rails — product logo",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
  },
  "k-talk-logo": {
    title: "K Talk — product logo",
    description: "Dimensional product lockup for K Talk.",
  },
  "k-rails-logo-dark": {
    title: "K Rails — logo, dark",
    description:
      "Flat K Rails lockup — the chevron mark and wordmark in charcoal for light surfaces.",
  },
  "k-talk-logo-dark": {
    title: "K Talk — logo, dark",
    description:
      "Flat K Talk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
  },
  "k-lab-bg-001": {
    title: "Chevron neon — deep navy",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
  },
  "k-lab-bg-002": {
    title: "Blue gradient field",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
  },
  "k-lab-bg-002-dots": {
    title: "Blue gradient field — dot texture",
    description: "The blue gradient with the brand dot matrix overlay.",
  },
  "k-lab-bg-003": {
    title: "Depth gradient",
    description: "Layered blue depth field for presentation backgrounds.",
  },
  "k-lab-bg-003-dots": {
    title: "Depth gradient — dot texture",
    description: "Depth field with the brand dot matrix overlay.",
  },
  "k-lab-bg-004": {
    title: "Horizon gradient",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
  },
  "k-lab-bg-004-dots": {
    title: "Horizon gradient — dot texture",
    description: "Horizon gradient with the brand dot matrix overlay.",
  },
  "k-lab-bg-005": {
    title: "Circuit field",
    description: "Technical circuit texture for data and infrastructure stories.",
  },
  "k-lab-bg-006": {
    title: "Signal field",
    description: "Abstract signal texture for section breaks and covers.",
  },
  "k-lab-screen-01": {
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
  },
  "k-lab-screen-02": {
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
  },
  "k-lab-screen-03": {
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
  },
  "k-rails-keyvisual": {
    title: "K Rails — key visual",
    description: "Campaign key visual for K Rails.",
  },
  "k-talk-keyvisual": {
    title: "K Talk — key visual",
    description: "Campaign key visual for K Talk.",
  },
};

/**
 * path       — relative to public/brand-files, or to private-assets when
 *              location is "private"
 * group      — key into GROUPS; every entry sharing one collapses into a
 *              single card whose chips are the formats
 * location   — "private" keeps the bytes outside the web root, streamed via
 *              /api/sales-files/[id]. Independent of visibility: it says where
 *              the file lives, not who may see it.
 * visibility — role gating ("public" | "employee"). Brand assets default to
 *              "public"; sales categories are always "employee" and cannot be
 *              opted out of here (mirrors resolveVisibilityForCategory in
 *              contexts/brand-assets/domain/models/asset-category.model.ts —
 *              tests/contexts/brand-assets/sales-privacy.test.ts holds the two
 *              in sync).
 * category   — controlled category from the domain model
 * tags       — `primary`/`dark`/`reversed`/`mark` pick previews for clearspace;
 *              `brand-book` marks the complete guidelines document
 */
const CATALOG = [
  // ── Logos: K Lab primary (blue) — PNG / SVG / AI ─────────────────────────
  {
    id: "ast-010",
    group: "k-lab-logo-blue",
    path: "logos/k-lab-logo-blue.png",
    category: "logos",
    title: "K Lab logo — primary (blue), PNG",
    description:
      "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
    tags: ["primary", "logo", "blue", "png"],
    created: "2025-11-04T09:05:00.000Z",
  },
  {
    id: "ast-010-svg",
    group: "k-lab-logo-blue",
    path: "logos/vector/k-lab-logo-blue.svg",
    category: "logos",
    title: "K Lab logo — primary (blue), SVG",
    description: "Scalable SVG of the primary lockup for digital use.",
    tags: ["primary", "logo", "blue", "svg"],
    created: "2026-08-13T14:00:00.000Z",
  },
  {
    id: "ast-010-ai",
    group: "k-lab-logo-blue",
    path: "logos/vector/k-lab-logo-blue.ai",
    category: "logos",
    title: "K Lab logo — primary (blue), AI",
    description: "Illustrator master of the primary lockup for design workflows.",
    tags: ["primary", "logo", "blue", "ai"],
    created: "2026-08-13T14:00:01.000Z",
  },
  {
    id: "ast-010-ico",
    group: "k-lab-logo-blue",
    path: "logos/favicons/k-lab-logo-blue.ico",
    category: "logos",
    title: "K Lab logo — primary (blue), ICO",
    description: "Favicon-ready ICO of the primary mark for browser tabs and pinned sites.",
    tags: ["primary", "logo", "blue", "favicon", "ico"],
    created: "2026-08-18T09:00:00.000Z",
  },

  // ── Logos: K Lab dark — PNG / SVG / AI ───────────────────────────────────
  {
    id: "ast-011",
    group: "k-lab-logo-dark",
    path: "logos/k-lab-logo-dark.png",
    category: "logos",
    title: "K Lab logo — dark, PNG",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
    tags: ["dark", "logo", "png"],
    created: "2025-11-04T09:06:00.000Z",
  },
  {
    id: "ast-011-svg",
    group: "k-lab-logo-dark",
    path: "logos/vector/k-lab-logo-dark.svg",
    category: "logos",
    title: "K Lab logo — dark, SVG",
    description: "Scalable SVG of the dark lockup.",
    tags: ["dark", "logo", "svg"],
    created: "2026-08-13T14:00:02.000Z",
  },
  {
    id: "ast-011-ai",
    group: "k-lab-logo-dark",
    path: "logos/vector/k-lab-logo-dark.ai",
    category: "logos",
    title: "K Lab logo — dark, AI",
    description: "Illustrator master of the dark lockup.",
    tags: ["dark", "logo", "ai"],
    created: "2026-08-13T14:00:03.000Z",
  },

  // ── Logos: K Lab reversed (white) — PNG / SVG / AI ───────────────────────
  {
    id: "ast-012",
    group: "k-lab-logo-white",
    path: "logos/k-lab-logo-white.png",
    category: "logos",
    title: "K Lab logo — reversed (white), PNG",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    tags: ["reversed", "white", "logo", "png"],
    created: "2025-11-04T09:07:00.000Z",
  },
  {
    id: "ast-012-svg",
    group: "k-lab-logo-white",
    path: "logos/vector/k-lab-logo-white.svg",
    category: "logos",
    title: "K Lab logo — reversed (white), SVG",
    description: "Scalable SVG of the reversed lockup.",
    tags: ["reversed", "white", "logo", "svg"],
    created: "2026-08-13T14:00:04.000Z",
  },
  {
    id: "ast-012-ai",
    group: "k-lab-logo-white",
    path: "logos/vector/k-lab-logo-white.ai",
    category: "logos",
    title: "K Lab logo — reversed (white), AI",
    description: "Illustrator master of the reversed lockup.",
    tags: ["reversed", "white", "logo", "ai"],
    created: "2026-08-13T14:00:05.000Z",
  },

  // ── Logos: K Lab logomark — PNG / SVG / PDF / AI ─────────────────────────
  {
    id: "ast-014",
    group: "k-lab-logomark",
    path: "logos/k-lab-logomark.png",
    category: "logos",
    title: "K Lab logomark, PNG",
    description:
      "The standalone mark in its rounded container — avatars, app icons, and favicons.",
    tags: ["mark", "icon", "logomark", "png"],
    created: "2026-01-15T10:05:00.000Z",
  },
  {
    id: "ast-014-svg",
    group: "k-lab-logomark",
    path: "logos/vector/k-lab-logomark.svg",
    category: "logos",
    title: "K Lab logomark, SVG",
    description: "Scalable SVG of the logomark.",
    tags: ["mark", "icon", "logomark", "svg"],
    created: "2026-08-13T14:00:06.000Z",
  },
  {
    id: "ast-014-pdf",
    group: "k-lab-logomark",
    path: "logos/vector/k-lab-logomark.pdf",
    category: "logos",
    title: "K Lab logomark, PDF",
    description: "Vector PDF master of the logomark for print.",
    tags: ["mark", "logomark", "pdf", "vector", "print"],
    created: "2026-08-13T14:00:07.000Z",
  },
  {
    id: "ast-014-ai",
    group: "k-lab-logomark",
    path: "logos/vector/k-lab-logomark.ai",
    category: "logos",
    title: "K Lab logomark, AI",
    description: "Illustrator master of the logomark.",
    tags: ["mark", "logomark", "ai"],
    created: "2026-08-13T14:00:08.000Z",
  },
  {
    id: "ast-014-ico",
    group: "k-lab-logomark",
    path: "logos/favicons/k-lab-logomark.ico",
    category: "logos",
    title: "K Lab logomark, ICO",
    description: "Favicon-ready ICO of the grey logomark for browser tabs and pinned sites.",
    tags: ["mark", "icon", "logomark", "favicon", "ico"],
    created: "2026-08-18T09:00:02.000Z",
  },

  // ── Logos: logomark variants (extra catalog files) ───────────────────────
  {
    id: "ast-015",
    group: "k-lab-logomark-white",
    path: "logos/k-lab-logomark-white.png",
    category: "logos",
    title: "K Lab logomark — white, PNG",
    description: "Reversed logomark for dark surfaces.",
    tags: ["logomark", "reversed", "white", "png"],
    created: "2026-08-13T14:00:09.000Z",
  },
  {
    id: "ast-015-svg",
    group: "k-lab-logomark-white",
    path: "logos/vector/k-lab-logomark-white.svg",
    category: "logos",
    title: "K Lab logomark — white, SVG",
    description: "Scalable SVG of the reversed logomark.",
    tags: ["logomark", "reversed", "white", "svg"],
    created: "2026-08-13T14:00:10.000Z",
  },
  {
    id: "ast-015-pdf",
    group: "k-lab-logomark-white",
    path: "logos/vector/k-lab-logomark-white.pdf",
    category: "logos",
    title: "K Lab logomark — white, PDF",
    description: "Vector PDF of the reversed logomark.",
    tags: ["logomark", "reversed", "white", "pdf", "vector", "print"],
    created: "2025-11-04T09:13:00.000Z",
  },
  {
    id: "ast-015-ai",
    group: "k-lab-logomark-white",
    path: "logos/vector/k-lab-logomark-white.ai",
    category: "logos",
    title: "K Lab logomark — white, AI",
    description: "Illustrator master of the reversed logomark.",
    tags: ["logomark", "reversed", "white", "ai"],
    created: "2026-08-13T14:00:11.000Z",
  },
  {
    id: "ast-015-ico",
    group: "k-lab-logomark-white",
    path: "logos/favicons/k-lab-logomark-white.ico",
    category: "logos",
    title: "K Lab logomark — white, ICO",
    description: "Favicon-ready ICO of the reversed logomark for dark browser themes.",
    tags: ["logomark", "reversed", "white", "favicon", "ico"],
    created: "2026-08-18T09:00:01.000Z",
  },

  // ── Logos: product brands (add PNG/SVG/AI as extra CATALOG rows on the same group)
  {
    id: "ast-030",
    group: "k-rails-logo",
    path: "sub-brands/k-rails.webp",
    category: "logos",
    title: "K Rails — product logo, WEBP",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    tags: ["product", "k-rails", "webp"],
    created: "2026-02-10T11:00:00.000Z",
  },
  {
    id: "ast-031",
    group: "k-talk-logo",
    path: "sub-brands/k-talk.webp",
    category: "logos",
    title: "K Talk — product logo, WEBP",
    description: "Dimensional product lockup for K Talk.",
    tags: ["product", "k-talk", "webp"],
    created: "2026-02-10T11:01:00.000Z",
  },
  {
    id: "ast-033",
    group: "k-rails-logo-dark",
    path: "sub-brands/k-rails-logo-dark.png",
    category: "logos",
    title: "K Rails — logo dark, PNG",
    description:
      "Flat K Rails lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    tags: ["product", "k-rails", "dark", "png"],
    created: "2026-08-17T10:00:00.000Z",
  },
  {
    id: "ast-033-svg",
    group: "k-rails-logo-dark",
    path: "sub-brands/k-rails-logo-dark.svg",
    category: "logos",
    title: "K Rails — logo dark, SVG",
    description: "Scalable SVG of the dark K Rails lockup.",
    tags: ["product", "k-rails", "dark", "svg"],
    created: "2026-08-17T10:00:01.000Z",
  },
  {
    id: "ast-034",
    group: "k-talk-logo-dark",
    path: "sub-brands/k-talk-logo-dark.png",
    category: "logos",
    title: "K Talk — logo dark, PNG",
    description:
      "Flat K Talk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    tags: ["product", "k-talk", "dark", "png"],
    created: "2026-08-17T10:00:02.000Z",
  },
  {
    id: "ast-034-svg",
    group: "k-talk-logo-dark",
    path: "sub-brands/k-talk-logo-dark.svg",
    category: "logos",
    title: "K Talk — logo dark, SVG",
    description: "Scalable SVG of the dark K Talk lockup.",
    tags: ["product", "k-talk", "dark", "svg"],
    created: "2026-08-17T10:00:03.000Z",
  },

  // ── Brand imagery: backgrounds (add another format as a CATALOG row on the same group)
  {
    id: "ast-040",
    group: "k-lab-bg-001",
    path: "backgrounds/k-lab-bg-001.webp",
    category: "brand-imagery",
    title: "Chevron neon — deep navy, WEBP",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
    tags: ["background", "hero", "navy", "webp"],
    created: "2025-12-02T12:00:00.000Z",
  },
  {
    id: "ast-041",
    group: "k-lab-bg-002",
    path: "backgrounds/k-lab-bg-002.webp",
    category: "brand-imagery",
    title: "Blue gradient field, WEBP",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
    tags: ["background", "gradient", "webp"],
    created: "2025-12-02T12:01:00.000Z",
  },
  {
    id: "ast-042",
    group: "k-lab-bg-002-dots",
    path: "backgrounds/k-lab-bg-002-dots.webp",
    category: "brand-imagery",
    title: "Blue gradient field — dot texture, WEBP",
    description: "The blue gradient with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture", "webp"],
    created: "2025-12-02T12:02:00.000Z",
  },
  {
    id: "ast-043",
    group: "k-lab-bg-003",
    path: "backgrounds/k-lab-bg-003.webp",
    category: "brand-imagery",
    title: "Depth gradient, WEBP",
    description: "Layered blue depth field for presentation backgrounds.",
    tags: ["background", "gradient", "slides", "webp"],
    created: "2025-12-02T12:03:00.000Z",
  },
  {
    id: "ast-044",
    group: "k-lab-bg-003-dots",
    path: "backgrounds/k-lab-bg-003-dots.webp",
    category: "brand-imagery",
    title: "Depth gradient — dot texture, WEBP",
    description: "Depth field with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture", "webp"],
    created: "2025-12-02T12:04:00.000Z",
  },
  {
    id: "ast-045",
    group: "k-lab-bg-004",
    path: "backgrounds/k-lab-bg-004.webp",
    category: "brand-imagery",
    title: "Horizon gradient, WEBP",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
    tags: ["background", "hero", "webp"],
    created: "2025-12-02T12:05:00.000Z",
  },
  {
    id: "ast-046",
    group: "k-lab-bg-004-dots",
    path: "backgrounds/k-lab-bg-004-dots.webp",
    category: "brand-imagery",
    title: "Horizon gradient — dot texture, WEBP",
    description: "Horizon gradient with the brand dot matrix overlay.",
    tags: ["background", "hero", "texture", "webp"],
    created: "2025-12-02T12:06:00.000Z",
  },
  {
    id: "ast-047",
    group: "k-lab-bg-005",
    path: "backgrounds/k-lab-bg-005.webp",
    category: "brand-imagery",
    title: "Circuit field, WEBP",
    description: "Technical circuit texture for data and infrastructure stories.",
    tags: ["background", "technical", "webp"],
    created: "2025-12-02T12:07:00.000Z",
  },
  {
    id: "ast-048",
    group: "k-lab-bg-006",
    path: "backgrounds/k-lab-bg-006.webp",
    category: "brand-imagery",
    title: "Signal field, WEBP",
    description: "Abstract signal texture for section breaks and covers.",
    tags: ["background", "technical", "webp"],
    created: "2025-12-02T12:08:00.000Z",
  },

  // ── Photography: product renders (approved stand-ins until the photo library ships) ───────────────────────────────────────
  {
    id: "ast-050",
    group: "k-lab-screen-01",
    path: "screens/k-lab-screen-01.webp",
    category: "photography",
    title: "Product render 01, WEBP",
    description: "Device render for product marketing and deck covers.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:30:00.000Z",
  },
  {
    id: "ast-051",
    group: "k-lab-screen-02",
    path: "screens/k-lab-screen-02.webp",
    category: "photography",
    title: "Product render 02, WEBP",
    description: "Alternate device render with the platform interface in context.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:31:00.000Z",
  },
  {
    id: "ast-052",
    group: "k-lab-screen-03",
    path: "screens/k-lab-screen-03.webp",
    category: "photography",
    title: "Product render 03, WEBP",
    description: "Wide product render for hero sections and landing pages.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:32:00.000Z",
  },
  {
    id: "ast-053",
    group: "k-rails-keyvisual",
    path: "sub-brands/k-rails-keyvisual.webp",
    category: "brand-imagery",
    title: "K Rails — key visual, WEBP",
    description: "Campaign key visual for K Rails.",
    tags: ["keyvisual", "k-rails", "campaign", "webp"],
    created: "2026-02-20T14:00:00.000Z",
  },
  {
    id: "ast-054",
    group: "k-talk-keyvisual",
    path: "sub-brands/k-talk-keyvisual.webp",
    category: "brand-imagery",
    title: "K Talk — key visual, WEBP",
    description: "Campaign key visual for K Talk.",
    tags: ["keyvisual", "k-talk", "campaign", "webp"],
    created: "2026-02-20T14:01:00.000Z",
  },

  // ── Fonts ────────────────────────────────────────────────────────────────
  {
    id: "ast-060",
    path: "fonts/sora-variable.ttf",
    category: "fonts",
    title: "Sora — variable font",
    description:
      "The K Lab brand typeface as a variable font covering weights 300 to 700.",
    tags: ["typeface", "sora", "variable"],
    created: "2025-11-08T15:00:00.000Z",
  },
  {
    id: "ast-061",
    path: "fonts/sora-font-kit.css",
    category: "fonts",
    title: "Sora web font kit",
    description: "Ready-to-drop font-face declarations and the fallback stack for web use.",
    tags: ["typography", "sora", "webfont"],
    created: "2025-11-08T15:10:00.000Z",
  },
  {
    id: "ast-062",
    path: "fonts/k-lab-typography-tokens.css",
    category: "fonts",
    title: "Typography tokens",
    description:
      "CSS custom properties for the type scale: sizes, weights, line heights, and tracking.",
    tags: ["typography", "tokens", "css"],
    created: "2025-11-08T15:12:00.000Z",
  },

  // ── Brand guidelines ─────────────────────────────────────────────────────
  {
    id: "ast-001",
    path: "docs/k-lab-brand-guidelines-wip.pdf",
    category: "brand-guidelines",
    title: "K Lab Brand Guidelines (WIP)",
    description:
      "The complete brand guidelines. Placeholder export — the working document is an Illustrator file pending a PDF export from the design team.",
    tags: ["brand-book", "guidelines", "identity"],
    created: "2026-08-10T09:00:00.000Z",
  },

  // ── Employee-only sales resources (files live outside the web root) ───────
  {
    id: "ast-100",
    path: "k-lab-platform-pitch-2026.pdf",
    location: "private",
    category: "pitch-decks",
    title: "K Lab Platform Pitch 2026",
    description:
      "Master platform deck: suite overview, architecture story, and pricing framework. Approved 2026-07.",
    tags: ["deck", "platform", "approved"],
    created: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "ast-101",
    path: "k-rails-invoice-pitch.pdf",
    location: "private",
    category: "pitch-decks",
    title: "K Rails Invoice Portal Pitch",
    description:
      "Product deck for the invoice financing portal — municipality and enterprise variants.",
    tags: ["deck", "k-rails", "invoice"],
    created: "2026-07-05T11:30:00.000Z",
  },
  {
    id: "ast-110",
    path: "k-lab-product-one-pagers.pdf",
    location: "private",
    category: "sales-materials",
    title: "Product One-Pagers Pack",
    description: "One-page leave-behinds for KBPM, K Risk, K Leads, and K Rails — print-ready.",
    tags: ["one-pager", "leave-behind"],
    created: "2026-07-10T10:00:00.000Z",
  },
  {
    id: "ast-111",
    path: "case-study-regional-bank.pdf",
    location: "private",
    category: "sales-materials",
    title: "Case Study — Regional Bank",
    description:
      "Anonymized results story: 40% faster onboarding with KBPM. Cleared for external sharing by legal.",
    tags: ["case study", "kbpm"],
    created: "2026-07-15T13:45:00.000Z",
  },
  {
    id: "ast-112",
    path: "legacy-pricing-sheet-2025.pdf",
    location: "private",
    category: "sales-materials",
    status: "archived",
    title: "Legacy Pricing Sheet 2025",
    description:
      "Superseded by the 2026 pricing framework in the platform pitch. Kept for reference.",
    tags: ["pricing", "superseded"],
    created: "2025-11-20T09:00:00.000Z",
  },
];

/** Keep in step with SALES_CATEGORIES in the domain category model. */
const SALES_CATEGORIES = ["pitch-decks", "sales-materials"];

const PREVIEWABLE = /\.(png|webp|jpg|jpeg|svg|gif|ico)$/i;
const missing = [];
const entries = [];
const privateFiles = [];

for (const item of CATALOG) {
  const visibility = SALES_CATEGORIES.includes(item.category)
    ? "employee"
    : (item.visibility ?? "public");
  const isPrivate = item.location === "private";
  const absolute = join(isPrivate ? privateDir : publicDir, item.path);

  if (!existsSync(absolute)) {
    missing.push(item.path);
    continue;
  }

  const fileName = item.path.split("/").pop();
  const extension = fileName.split(".").pop().toLowerCase();
  const downloadUrl = isPrivate ? `/api/sales-files/${item.id}` : `/brand-files/${item.path}`;
  const categoryFolder = isPrivate ? item.category : item.path.split("/").slice(0, -1).join("/");

  const group = item.group ? GROUPS[item.group] : undefined;
  if (item.group && !group) {
    console.error(`Unknown group "${item.group}" on ${item.id} — add it to GROUPS.`);
    process.exit(1);
  }

  entries.push({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    visibility,
    status: item.status ?? "active",
    groupId: item.group,
    groupTitle: group?.title,
    groupDescription: group?.description,
    file: {
      fileName,
      contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
      sizeBytes: statSync(absolute).size,
      storagePath: `assets/${categoryFolder}/${fileName}`,
      downloadUrl,
    },
    previewUrl: !isPrivate && PREVIEWABLE.test(fileName) ? `/brand-files/${item.path}` : undefined,
    tags: item.tags,
    createdAt: item.created,
    updatedAt: item.created,
    createdBy: isPrivate ? "usr-002" : "usr-001",
  });

  if (isPrivate) privateFiles.push([item.id, fileName]);
}

if (missing.length) {
  console.error(`Missing ${missing.length} file(s) — run scripts/build-brand-assets.mjs first:`);
  missing.forEach((m) => console.error("  " + m));
  process.exit(1);
}

const serialize = (value, indent) => JSON.stringify(value, null, 2).replace(/\n/g, `\n${indent}`);

const body = entries
  .map((entry) => `  ${serialize(entry, "  ")},`)
  .join("\n")
  .replace(/"([a-zA-Z][a-zA-Z0-9]*)":/g, "$1:");

const privateMap = privateFiles
  .map(([id, file]) => `  "${id}": "${file}",`)
  .join("\n");

const output = `import type { BrandAsset } from "@/contexts/brand-assets/domain/models/brand-asset.model";

/**
 * GENERATED — do not edit by hand.
 * Run \`node scripts/generate-asset-catalog.mjs\` after adding or replacing a
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
${body}
];

/** Private-location files streamed by /api/sales-files/[id] from private-assets/. */
export const PRIVATE_SEED_FILES: Record<string, string> = {
${privateMap}
};
`;

writeFileSync(
  join(root, "contexts/brand-assets/infrastructure/mock/seed-assets.ts"),
  output,
  "utf8",
);

const byCategory = entries.reduce((acc, e) => {
  acc[e.category] = (acc[e.category] ?? 0) + 1;
  return acc;
}, {});
console.log(`Wrote ${entries.length} assets to seed-assets.ts`);
for (const [category, count] of Object.entries(byCategory).sort()) {
  console.log(`  ${category.padEnd(18)} ${count}`);
}
