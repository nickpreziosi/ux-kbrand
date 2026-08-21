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
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  ai: "application/postscript",
  css: "text/css",
  ttf: "font/ttf",
  ico: "image/x-icon",
};

/**
 * Shared title/description for a multi-file artwork. Catalog rows that share
 * a `group` key collapse into one BrandAsset whose `files` are those rows.
 * The asset id is the group key.
 */
const GROUPS = {
  klab_full_logo_blue: {
    title: "K Lab logo — primary (blue)",
    description:
      "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
  },
  klab_full_logo_dark: {
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
  },
  klab_full_logo_light: {
    title: "K Lab logo — reversed (light)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
  },
  klab_full_logo_flat_black: {
    title: "K Lab logo — flat black",
    description: "Single-color black lockup for one-color print and monochrome layouts.",
  },
  klab_full_logo_flat_white: {
    title: "K Lab logo — flat white",
    description: "Single-color white lockup for one-color reverse print and dark fields.",
  },
  klab_logomark_blue: {
    title: "K Lab logomark — blue",
    description:
      "The standalone mark in its rounded container — avatars, app icons, and favicons.",
  },
  klab_logomark_dark: {
    title: "K Lab logomark — dark",
    description: "Dark logomark for light surfaces where the blue mark would compete.",
  },
  klab_logomark_light: {
    title: "K Lab logomark — light",
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
  klab_sub_brands_krails_dark: {
    title: "K Rails — logo, dark",
    description:
      "Flat K Rails lockup — the chevron mark and wordmark in charcoal for light surfaces.",
  },
  klab_sub_brands_krails_light: {
    title: "K Rails — logo, light",
    description: "Flat K Rails lockup reversed for dark surfaces.",
  },
  klab_sub_brands_ktalk_dark: {
    title: "K Talk — logo, dark",
    description:
      "Flat K Talk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
  },
  klab_sub_brands_ktalk_light: {
    title: "K Talk — logo, light",
    description: "Flat K Talk lockup reversed for dark surfaces.",
  },
  klab_sub_brands_krisk_dark: {
    title: "K Risk — logo, dark",
    description:
      "Flat K Risk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
  },
  klab_sub_brands_krisk_light: {
    title: "K Risk — logo, light",
    description: "Flat K Risk lockup reversed for dark surfaces.",
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
function logoFormatRows({
  id,
  group,
  productDir,
  basename,
  title,
  description,
  tags,
  created,
}) {
  const formats = [
    { ext: "png", label: "PNG" },
    { ext: "svg", label: "SVG" },
    { ext: "pdf", label: "PDF" },
    { ext: "ai", label: "AI" },
  ];
  return formats.map((fmt, index) => ({
    id: index === 0 ? id : `${id}-${fmt.ext}`,
    group,
    path: `logos/${productDir}/${basename}.${fmt.ext}`,
    category: "logos",
    title: `${title}, ${fmt.label}`,
    description: index === 0 ? description : `${fmt.label} of ${title}.`,
    tags: [...tags, fmt.ext],
    created: new Date(Date.parse(created) + index * 1000).toISOString(),
  }));
}

function pngJpgRows({
  id,
  group,
  dir,
  basename,
  category,
  title,
  description,
  tags,
  created,
}) {
  return [
    {
      ext: "png",
      label: "PNG",
      offset: 1000,
    },
    {
      ext: "jpg",
      label: "JPG",
      offset: 2000,
    },
  ].map((fmt) => ({
    id: `${id}-${fmt.ext}`,
    group,
    path: `${dir}/${basename}.${fmt.ext}`,
    category,
    title: `${title}, ${fmt.label}`,
    description,
    tags: [...tags.filter((tag) => tag !== "webp"), fmt.ext],
    created: new Date(Date.parse(created) + fmt.offset).toISOString(),
  }));
}

const CATALOG = [
  ...logoFormatRows({
    id: "ast-010",
    group: "klab_full_logo_blue",
    productDir: "k-lab",
    basename: "klab_full_logo_blue",
    title: "K Lab logo — primary (blue)",
    description:
      "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
    tags: ["primary", "logo", "blue"],
    created: "2025-11-04T09:05:00.000Z",
  }),

  ...logoFormatRows({
    id: "ast-011",
    group: "klab_full_logo_dark",
    productDir: "k-lab",
    basename: "klab_full_logo_dark",
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
    tags: ["dark", "logo"],
    created: "2025-11-04T09:06:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-012",
    group: "klab_full_logo_light",
    productDir: "k-lab",
    basename: "klab_full_logo_light",
    title: "K Lab logo — reversed (light)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    tags: ["reversed", "light", "logo"],
    created: "2025-11-04T09:07:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-013",
    group: "klab_full_logo_flat_black",
    productDir: "k-lab",
    basename: "klab_full_logo_flat_black",
    title: "K Lab logo — flat black",
    description: "Single-color black lockup for one-color print and monochrome layouts.",
    tags: ["flat", "black", "logo"],
    created: "2026-08-21T12:00:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-016",
    group: "klab_full_logo_flat_white",
    productDir: "k-lab",
    basename: "klab_full_logo_flat_white",
    title: "K Lab logo — flat white",
    description: "Single-color white lockup for one-color reverse print and dark fields.",
    tags: ["flat", "white", "logo"],
    created: "2026-08-21T12:01:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-014",
    group: "klab_logomark_blue",
    productDir: "k-lab",
    basename: "klab_logomark_blue",
    title: "K Lab logomark — blue",
    description:
      "The standalone mark in its rounded container — avatars, app icons, and favicons.",
    tags: ["mark", "icon", "logomark", "blue"],
    created: "2026-01-15T10:05:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-018",
    group: "klab_logomark_dark",
    productDir: "k-lab",
    basename: "klab_logomark_dark",
    title: "K Lab logomark — dark",
    description: "Dark logomark for light surfaces where the blue mark would compete.",
    tags: ["logomark", "dark"],
    created: "2026-08-21T12:02:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-015",
    group: "klab_logomark_light",
    productDir: "k-lab",
    basename: "klab_logomark_light",
    title: "K Lab logomark — light",
    description: "Reversed logomark for dark surfaces.",
    tags: ["logomark", "reversed", "light"],
    created: "2026-08-13T14:00:09.000Z",
  }),
  {
    id: "ast-030",
    group: "k-rails-logo",
    path: "logos/k-rails/k-rails.webp",
    category: "logos",
    title: "K Rails — product logo, WEBP",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    tags: ["product", "k-rails", "webp"],
    created: "2026-02-10T11:00:00.000Z",
  },
  ...pngJpgRows({
    id: "ast-030",
    group: "k-rails-logo",
    dir: "logos/k-rails",
    basename: "k-rails",
    category: "logos",
    title: "K Rails — product logo",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    tags: ["product", "k-rails"],
    created: "2026-02-10T11:00:00.000Z",
  }),
  {
    id: "ast-031",
    group: "k-talk-logo",
    path: "logos/k-talk/k-talk.webp",
    category: "logos",
    title: "K Talk — product logo, WEBP",
    description: "Dimensional product lockup for K Talk.",
    tags: ["product", "k-talk", "webp"],
    created: "2026-02-10T11:01:00.000Z",
  },
  ...pngJpgRows({
    id: "ast-031",
    group: "k-talk-logo",
    dir: "logos/k-talk",
    basename: "k-talk",
    category: "logos",
    title: "K Talk — product logo",
    description: "Dimensional product lockup for K Talk.",
    tags: ["product", "k-talk"],
    created: "2026-02-10T11:01:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-033",
    group: "klab_sub_brands_krails_dark",
    productDir: "k-rails",
    basename: "klab_sub_brands_krails_dark",
    title: "K Rails — logo, dark",
    description:
      "Flat K Rails lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    tags: ["product", "k-rails", "dark"],
    created: "2026-08-17T10:00:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-035",
    group: "klab_sub_brands_krails_light",
    productDir: "k-rails",
    basename: "klab_sub_brands_krails_light",
    title: "K Rails — logo, light",
    description: "Flat K Rails lockup reversed for dark surfaces.",
    tags: ["product", "k-rails", "light"],
    created: "2026-08-21T12:03:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-034",
    group: "klab_sub_brands_ktalk_dark",
    productDir: "k-talk",
    basename: "klab_sub_brands_ktalk_dark",
    title: "K Talk — logo, dark",
    description:
      "Flat K Talk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    tags: ["product", "k-talk", "dark"],
    created: "2026-08-17T10:00:02.000Z",
  }),
  ...logoFormatRows({
    id: "ast-036",
    group: "klab_sub_brands_ktalk_light",
    productDir: "k-talk",
    basename: "klab_sub_brands_ktalk_light",
    title: "K Talk — logo, light",
    description: "Flat K Talk lockup reversed for dark surfaces.",
    tags: ["product", "k-talk", "light"],
    created: "2026-08-21T12:04:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-037",
    group: "klab_sub_brands_krisk_dark",
    productDir: "k-risk",
    basename: "klab_sub_brands_krisk_dark",
    title: "K Risk — logo, dark",
    description:
      "Flat K Risk lockup — the chevron mark and wordmark in charcoal for light surfaces.",
    tags: ["product", "k-risk", "dark"],
    created: "2026-08-21T12:05:00.000Z",
  }),
  ...logoFormatRows({
    id: "ast-038",
    group: "klab_sub_brands_krisk_light",
    productDir: "k-risk",
    basename: "klab_sub_brands_krisk_light",
    title: "K Risk — logo, light",
    description: "Flat K Risk lockup reversed for dark surfaces.",
    tags: ["product", "k-risk", "light"],
    created: "2026-08-21T12:06:00.000Z",
  }),

  // ── Brand imagery: backgrounds (webp + png + jpg on the same group)
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
  ...pngJpgRows({
    id: "ast-040",
    group: "k-lab-bg-001",
    dir: "backgrounds",
    basename: "k-lab-bg-001",
    category: "brand-imagery",
    title: "Chevron neon — deep navy",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
    tags: ["background", "hero", "navy"],
    created: "2025-12-02T12:00:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-041",
    group: "k-lab-bg-002",
    dir: "backgrounds",
    basename: "k-lab-bg-002",
    category: "brand-imagery",
    title: "Blue gradient field",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
    tags: ["background", "gradient"],
    created: "2025-12-02T12:01:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-042",
    group: "k-lab-bg-002-dots",
    dir: "backgrounds",
    basename: "k-lab-bg-002-dots",
    category: "brand-imagery",
    title: "Blue gradient field — dot texture",
    description: "The blue gradient with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture"],
    created: "2025-12-02T12:02:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-043",
    group: "k-lab-bg-003",
    dir: "backgrounds",
    basename: "k-lab-bg-003",
    category: "brand-imagery",
    title: "Depth gradient",
    description: "Layered blue depth field for presentation backgrounds.",
    tags: ["background", "gradient", "slides"],
    created: "2025-12-02T12:03:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-044",
    group: "k-lab-bg-003-dots",
    dir: "backgrounds",
    basename: "k-lab-bg-003-dots",
    category: "brand-imagery",
    title: "Depth gradient — dot texture",
    description: "Depth field with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture"],
    created: "2025-12-02T12:04:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-045",
    group: "k-lab-bg-004",
    dir: "backgrounds",
    basename: "k-lab-bg-004",
    category: "brand-imagery",
    title: "Horizon gradient",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
    tags: ["background", "hero"],
    created: "2025-12-02T12:05:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-046",
    group: "k-lab-bg-004-dots",
    dir: "backgrounds",
    basename: "k-lab-bg-004-dots",
    category: "brand-imagery",
    title: "Horizon gradient — dot texture",
    description: "Horizon gradient with the brand dot matrix overlay.",
    tags: ["background", "hero", "texture"],
    created: "2025-12-02T12:06:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-047",
    group: "k-lab-bg-005",
    dir: "backgrounds",
    basename: "k-lab-bg-005",
    category: "brand-imagery",
    title: "Circuit field",
    description: "Technical circuit texture for data and infrastructure stories.",
    tags: ["background", "technical"],
    created: "2025-12-02T12:07:00.000Z",
  }),
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
  ...pngJpgRows({
    id: "ast-048",
    group: "k-lab-bg-006",
    dir: "backgrounds",
    basename: "k-lab-bg-006",
    category: "brand-imagery",
    title: "Signal field",
    description: "Abstract signal texture for section breaks and covers.",
    tags: ["background", "technical"],
    created: "2025-12-02T12:08:00.000Z",
  }),

  // ── Brand imagery: product renders ───────────────────────────────────────
  {
    id: "ast-050",
    group: "k-lab-screen-01",
    path: "screens/k-lab-screen-01.webp",
    category: "brand-imagery",
    title: "Product render 01, WEBP",
    description: "Device render for product marketing and deck covers.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:30:00.000Z",
  },
  ...pngJpgRows({
    id: "ast-050",
    group: "k-lab-screen-01",
    dir: "screens",
    basename: "k-lab-screen-01",
    category: "brand-imagery",
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:30:00.000Z",
  }),
  {
    id: "ast-051",
    group: "k-lab-screen-02",
    path: "screens/k-lab-screen-02.webp",
    category: "brand-imagery",
    title: "Product render 02, WEBP",
    description: "Alternate device render with the platform interface in context.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:31:00.000Z",
  },
  ...pngJpgRows({
    id: "ast-051",
    group: "k-lab-screen-02",
    dir: "screens",
    basename: "k-lab-screen-02",
    category: "brand-imagery",
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:31:00.000Z",
  }),
  {
    id: "ast-052",
    group: "k-lab-screen-03",
    path: "screens/k-lab-screen-03.webp",
    category: "brand-imagery",
    title: "Product render 03, WEBP",
    description: "Wide product render for hero sections and landing pages.",
    tags: ["render", "product", "marketing", "webp"],
    created: "2026-02-18T09:32:00.000Z",
  },
  ...pngJpgRows({
    id: "ast-052",
    group: "k-lab-screen-03",
    dir: "screens",
    basename: "k-lab-screen-03",
    category: "brand-imagery",
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:32:00.000Z",
  }),

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
const FORMAT_TAGS = new Set([
  "png", "svg", "webp", "jpg", "jpeg", "gif", "ico", "pdf", "ai", "eps", "ttf", "otf", "css",
]);
const PRODUCT_TAGS = new Set(["k-talk", "k-rails", "k-risk", "product"]);

const PREVIEWABLE = /\.(png|webp|jpg|jpeg|svg|gif|ico)$/i;
const PREVIEW_EXT_ORDER = [".svg", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".ico"];
const missing = [];
const fileRows = [];
const privateFiles = [];

function productFromTags(tags) {
  if (tags.includes("k-talk")) return "k-talk";
  if (tags.includes("k-rails")) return "k-rails";
  if (tags.includes("k-risk")) return "k-risk";
  return "k-lab";
}

function resourceTypeForCategory(category) {
  return SALES_CATEGORIES.includes(category) ? "sales" : "brand";
}

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

  if (item.group && !GROUPS[item.group]) {
    console.error(`Unknown group "${item.group}" on ${item.id} — add it to GROUPS.`);
    process.exit(1);
  }

  const fileName = item.path.split("/").pop();
  const extension = fileName.split(".").pop().toLowerCase();
  const downloadUrl = isPrivate ? `/api/sales-files/${item.id}` : `/brand-files/${item.path}`;
  const categoryFolder = isPrivate ? item.category : item.path.split("/").slice(0, -1).join("/");

  fileRows.push({
    item,
    visibility,
    isPrivate,
    fileName,
    file: {
      id: item.id,
      fileName,
      contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
      sizeBytes: statSync(absolute).size,
      storagePath: `assets/${categoryFolder}/${fileName}`,
      downloadUrl,
    },
    previewUrl: !isPrivate && PREVIEWABLE.test(fileName) ? `/brand-files/${item.path}` : undefined,
  });

  if (isPrivate) privateFiles.push([item.id, fileName]);
}

const grouped = new Map();
for (const row of fileRows) {
  const key = row.item.group ?? row.item.id;
  const existing = grouped.get(key);
  if (existing) existing.push(row);
  else grouped.set(key, [row]);
}

const entries = [];
for (const [id, rows] of grouped) {
  const [primary] = rows;
  const meta = primary.item.group ? GROUPS[primary.item.group] : undefined;
  const allTags = [...new Set(rows.flatMap((row) => row.item.tags))];
  const tags = allTags.filter(
    (tag) => !FORMAT_TAGS.has(tag.toLowerCase()) && !PRODUCT_TAGS.has(tag),
  );
  const previewUrl = PREVIEW_EXT_ORDER.reduce((found, ext) => {
    if (found) return found;
    return rows.find((row) => row.previewUrl?.toLowerCase().endsWith(ext))
      ?.previewUrl;
  }, undefined);
  const createdAt = rows.reduce(
    (earliest, row) => (row.item.created < earliest ? row.item.created : earliest),
    primary.item.created,
  );
  const updatedAt = rows.reduce(
    (latest, row) => (row.item.created > latest ? row.item.created : latest),
    primary.item.created,
  );

  entries.push({
    id,
    title: meta?.title ?? primary.item.title,
    description: meta?.description ?? primary.item.description,
    resourceType: resourceTypeForCategory(primary.item.category),
    category: primary.item.category,
    product: productFromTags(allTags),
    visibility: primary.visibility,
    status: primary.item.status ?? "active",
    files: rows.map((row) => row.file),
    previewUrl,
    tags,
    createdAt,
    updatedAt,
    createdBy: primary.isPrivate ? "usr-002" : "usr-001",
  });
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
