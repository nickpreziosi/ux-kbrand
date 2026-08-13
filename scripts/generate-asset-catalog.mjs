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
  pdf: "application/pdf",
  css: "text/css",
  ttf: "font/ttf",
};

/**
 * path       — relative to public/brand-files, or to private-assets when
 *              location is "private"
 * location   — "private" keeps the bytes outside the web root, streamed via
 *              /api/sales-files/[id]. Independent of visibility: it says where
 *              the file lives, not who may see it.
 * visibility — role gating ("public" | "employee"). Every asset defaults to
 *              "public" for now; admins re-gate at runtime from Manage assets.
 * category   — controlled category from the domain model
 * tags       — `primary`/`dark`/`reversed`/`mark` drive the logo variant cards;
 *              `brand-book` marks the complete guidelines document
 */
const CATALOG = [
  // ── Logos: K Lab master brand ────────────────────────────────────────────
  {
    id: "ast-010",
    path: "logos/k-lab-logo-blue.png",
    category: "logos",
    title: "K Lab logo — primary (blue)",
    description:
      "The default lockup. Use on light surfaces wherever the brand has room to breathe.",
    tags: ["primary", "logo", "blue"],
    created: "2025-11-04T09:05:00.000Z",
  },
  {
    id: "ast-011",
    path: "logos/k-lab-logo-dark.png",
    category: "logos",
    title: "K Lab logo — dark",
    description: "Dark lockup for light backgrounds where the blue would compete with artwork.",
    tags: ["dark", "logo"],
    created: "2025-11-04T09:06:00.000Z",
  },
  {
    id: "ast-012",
    path: "logos/k-lab-logo-white.png",
    category: "logos",
    title: "K Lab logo — reversed (white)",
    description: "Reversed lockup for dark surfaces, photography, and video overlays.",
    tags: ["reversed", "white", "logo"],
    created: "2025-11-04T09:07:00.000Z",
  },
  {
    id: "ast-013",
    path: "logos/k-lab-logo-2025.png",
    category: "logos",
    title: "K Lab logo — 2025 refresh",
    description: "The 2025 identity lockup with the dimensional chevron treatment.",
    tags: ["2025", "logo"],
    created: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "ast-014",
    path: "logos/k-lab-logomark-2025.png",
    category: "logos",
    title: "K Lab logomark",
    description:
      "The standalone chevron mark in its rounded container — avatars, app icons, and favicons.",
    tags: ["mark", "icon", "logomark"],
    created: "2026-01-15T10:05:00.000Z",
  },
  {
    id: "ast-015",
    path: "logos/k-lab-logomark-dark.png",
    category: "logos",
    title: "K Lab logomark — dark",
    description: "Dark variant of the chevron mark for light interfaces.",
    tags: ["logomark", "dark"],
    created: "2025-11-04T09:10:00.000Z",
  },

  // ── Logos: vector masters ────────────────────────────────────────────────
  {
    id: "ast-020",
    path: "logos/vector/k-lab-logo-2025.pdf",
    category: "logos",
    title: "K Lab logo — vector (PDF)",
    description: "Scalable vector master of the 2025 lockup for print and large format.",
    tags: ["vector", "print", "logo"],
    created: "2026-01-15T10:10:00.000Z",
  },
  {
    id: "ast-021",
    path: "logos/vector/k-lab-logomark-2025.pdf",
    category: "logos",
    title: "K Lab logomark — vector (PDF)",
    description: "Scalable vector master of the chevron mark.",
    tags: ["vector", "print", "logomark"],
    created: "2026-01-15T10:11:00.000Z",
  },
  {
    id: "ast-022",
    path: "logos/vector/k-lab-logomark-dark.pdf",
    category: "logos",
    title: "K Lab logomark — dark, vector (PDF)",
    description: "Vector master of the dark chevron mark.",
    tags: ["vector", "print", "logomark", "dark"],
    created: "2025-11-04T09:12:00.000Z",
  },
  {
    id: "ast-023",
    path: "logos/vector/k-lab-logomark-white.pdf",
    category: "logos",
    title: "K Lab logomark — white, vector (PDF)",
    description: "Vector master of the reversed chevron mark for dark surfaces.",
    tags: ["vector", "print", "logomark", "reversed"],
    created: "2025-11-04T09:13:00.000Z",
  },

  // ── Logos: product brands ────────────────────────────────────────────────
  {
    id: "ast-030",
    path: "sub-brands/k-rails.webp",
    category: "logos",
    title: "K Rails — product logo",
    description: "Dimensional product lockup for K Rails, the invoice financing platform.",
    tags: ["product", "k-rails"],
    created: "2026-02-10T11:00:00.000Z",
  },
  {
    id: "ast-031",
    path: "sub-brands/k-talk.webp",
    category: "logos",
    title: "K Talk — product logo",
    description: "Dimensional product lockup for K Talk.",
    tags: ["product", "k-talk"],
    created: "2026-02-10T11:01:00.000Z",
  },
  {
    id: "ast-032",
    path: "sub-brands/kena.webp",
    category: "logos",
    title: "Kena — product logo",
    description: "Dimensional product lockup for Kena.",
    tags: ["product", "kena"],
    created: "2026-02-10T11:02:00.000Z",
  },

  // ── Brand imagery: backgrounds ───────────────────────────────────────────
  {
    id: "ast-040",
    path: "backgrounds/k-lab-bg-001.webp",
    category: "brand-imagery",
    title: "Chevron neon — deep navy",
    description: "Hero background: the chevron rendered in electric blue on deep navy.",
    tags: ["background", "hero", "navy"],
    created: "2025-12-02T12:00:00.000Z",
  },
  {
    id: "ast-041",
    path: "backgrounds/k-lab-bg-002.webp",
    category: "brand-imagery",
    title: "Blue gradient field",
    description: "Smooth blue gradient for section dividers, covers, and social cards.",
    tags: ["background", "gradient"],
    created: "2025-12-02T12:01:00.000Z",
  },
  {
    id: "ast-042",
    path: "backgrounds/k-lab-bg-002-dots.webp",
    category: "brand-imagery",
    title: "Blue gradient field — dot texture",
    description: "The blue gradient with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture"],
    created: "2025-12-02T12:02:00.000Z",
  },
  {
    id: "ast-043",
    path: "backgrounds/k-lab-bg-003.webp",
    category: "brand-imagery",
    title: "Depth gradient",
    description: "Layered blue depth field for presentation backgrounds.",
    tags: ["background", "gradient", "slides"],
    created: "2025-12-02T12:03:00.000Z",
  },
  {
    id: "ast-044",
    path: "backgrounds/k-lab-bg-003-dots.webp",
    category: "brand-imagery",
    title: "Depth gradient — dot texture",
    description: "Depth field with the brand dot matrix overlay.",
    tags: ["background", "gradient", "texture"],
    created: "2025-12-02T12:04:00.000Z",
  },
  {
    id: "ast-045",
    path: "backgrounds/k-lab-bg-004.webp",
    category: "brand-imagery",
    title: "Horizon gradient",
    description: "Wide horizon gradient suited to full-bleed hero sections.",
    tags: ["background", "hero"],
    created: "2025-12-02T12:05:00.000Z",
  },
  {
    id: "ast-046",
    path: "backgrounds/k-lab-bg-004-dots.webp",
    category: "brand-imagery",
    title: "Horizon gradient — dot texture",
    description: "Horizon gradient with the brand dot matrix overlay.",
    tags: ["background", "hero", "texture"],
    created: "2025-12-02T12:06:00.000Z",
  },
  {
    id: "ast-047",
    path: "backgrounds/k-lab-bg-005.webp",
    category: "brand-imagery",
    title: "Circuit field",
    description: "Technical circuit texture for data and infrastructure stories.",
    tags: ["background", "technical"],
    created: "2025-12-02T12:07:00.000Z",
  },
  {
    id: "ast-048",
    path: "backgrounds/k-lab-bg-006.webp",
    category: "brand-imagery",
    title: "Signal field",
    description: "Abstract signal texture for section breaks and covers.",
    tags: ["background", "technical"],
    created: "2025-12-02T12:08:00.000Z",
  },

  // ── Brand imagery: product renders ───────────────────────────────────────
  {
    id: "ast-050",
    path: "screens/k-lab-screen-01.webp",
    category: "brand-imagery",
    title: "Product render 01",
    description: "Device render for product marketing and deck covers.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:30:00.000Z",
  },
  {
    id: "ast-051",
    path: "screens/k-lab-screen-02.webp",
    category: "brand-imagery",
    title: "Product render 02",
    description: "Alternate device render with the platform interface in context.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:31:00.000Z",
  },
  {
    id: "ast-052",
    path: "screens/k-lab-screen-03.webp",
    category: "brand-imagery",
    title: "Product render 03",
    description: "Wide product render for hero sections and landing pages.",
    tags: ["render", "product", "marketing"],
    created: "2026-02-18T09:32:00.000Z",
  },
  {
    id: "ast-053",
    path: "sub-brands/k-rails-keyvisual.webp",
    category: "brand-imagery",
    title: "K Rails — key visual",
    description: "Campaign key visual for K Rails.",
    tags: ["keyvisual", "k-rails", "campaign"],
    created: "2026-02-20T14:00:00.000Z",
  },
  {
    id: "ast-054",
    path: "sub-brands/k-talk-keyvisual.webp",
    category: "brand-imagery",
    title: "K Talk — key visual",
    description: "Campaign key visual for K Talk.",
    tags: ["keyvisual", "k-talk", "campaign"],
    created: "2026-02-20T14:01:00.000Z",
  },
  {
    id: "ast-055",
    path: "sub-brands/kena-keyvisual.webp",
    category: "brand-imagery",
    title: "Kena — key visual",
    description: "Campaign key visual for Kena.",
    tags: ["keyvisual", "kena", "campaign"],
    created: "2026-02-20T14:02:00.000Z",
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

const PREVIEWABLE = /\.(png|webp|jpg|jpeg|svg|gif)$/i;
const missing = [];
const entries = [];
const privateFiles = [];

for (const item of CATALOG) {
  const visibility = item.visibility ?? "public";
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

  entries.push({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    visibility,
    status: item.status ?? "active",
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
