/**
 * Generates the documents the portal needs but that we don't have real files
 * for yet:
 *
 *   node scripts/generate-placeholder-docs.mjs
 *
 *   public/brand-files/docs/  — brand guidelines stand-in. The real document is
 *                               a 486 MB work-in-progress Illustrator file
 *                               (brand-source/guidelines-wip/); replace this
 *                               with the design team's PDF export when it lands.
 *   public/brand-files/fonts/ — Sora font-face kit and typography tokens, both
 *                               written to match the design system.
 *   private-assets/           — employee-only sales documents. Placeholders: no
 *                               real sales collateral has been supplied.
 *
 * Everything else in public/brand-files is real brand material, produced by
 * scripts/build-brand-assets.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(root, "public", "brand-files", "docs");
const fontsDir = join(root, "public", "brand-files", "fonts");
const privateDir = join(root, "private-assets");
[docsDir, fontsDir, privateDir].forEach((dir) => mkdirSync(dir, { recursive: true }));

/** Minimal single-page PDF with a title and body lines. */
function buildPdf(title, lines) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  let content = `BT /F1 24 Tf 72 720 Td (${esc(title)}) Tj ET\n`;
  lines.forEach((line, i) => {
    content += `BT /F1 12 Tf 72 ${680 - i * 20} Td (${esc(line)}) Tj ET\n`;
  });
  content += `BT /F1 9 Tf 72 60 Td (K Lab - Brand and Sales Resource Portal - prototype placeholder) Tj ET\n`;

  const objects = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`,
    `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
  ];

  let pdf = `%PDF-1.4\n`;
  const offsets = [0];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

writeFileSync(
  join(docsDir, "k-lab-brand-guidelines-wip.pdf"),
  buildPdf("K Lab Brand Guidelines (WIP)", [
    "PLACEHOLDER - awaiting the PDF export of the working document.",
    "",
    "The complete guidelines exist as an Illustrator file:",
    "  brand-source/guidelines-wip/K Lab - Brand Guidelines wip 10Aug.ai",
    "It is 486 MB and cannot be served or version-controlled as-is.",
    "",
    "Meanwhile the portal surfaces the key standards directly:",
    "  Logo      - lockups, clearspace, minimum sizes, do and don't",
    "  Colors    - brand identity palette and product design tokens",
    "  Typography- Sora, the type scale, and downloadable tokens",
    "  Imagery   - approved backgrounds, renders, and usage rules",
    "",
    "Replace this file with the real export and rerun:",
    "  node scripts/generate-asset-catalog.mjs",
  ]),
);

writeFileSync(
  join(fontsDir, "sora-font-kit.css"),
  `/* K Lab brand typeface - Sora font-face kit
 * Pair with sora-variable.ttf from this same category, or load from Google Fonts.
 * Weights: 300 (Light) 400 (Regular) 500 (Medium) 600 (SemiBold) 700 (Bold)
 */
@font-face {
  font-family: "Sora";
  src: url("./sora-variable.ttf") format("truetype-variations");
  font-weight: 300 700;
  font-display: swap;
}

:root {
  --font-sora: "Sora", "Segoe UI", system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--font-sora);
  font-optical-sizing: auto;
}

/* Usage: headings 600-700, body 400, captions and labels 500. */
`,
);

writeFileSync(
  join(fontsDir, "k-lab-typography-tokens.css"),
  `/* K Lab typography tokens - pair with sora-font-kit.css */
:root {
  --type-display: 700 3rem/1.1 var(--font-sora);
  --type-h1: 700 2.25rem/1.2 var(--font-sora);
  --type-h2: 600 1.75rem/1.25 var(--font-sora);
  --type-h3: 600 1.375rem/1.3 var(--font-sora);
  --type-body-lg: 400 1.125rem/1.6 var(--font-sora);
  --type-body: 400 1rem/1.6 var(--font-sora);
  --type-caption: 500 0.8125rem/1.4 var(--font-sora);
  --type-overline: 600 0.6875rem/1.3 var(--font-sora);
  --tracking-tight: -0.02em;
  --tracking-wide: 0.08em;
}
`,
);

const SALES_DOCS = [
  [
    "k-lab-platform-pitch-2026.pdf",
    "K Lab Platform Pitch 2026",
    [
      "The operating system for B2B finance.",
      "Suite: KBPM - K Risk - K Leads - K Rails, one SSO, one design system.",
      "Architecture: shell-canonical subdomains, auth bridge, Firebase identity.",
      "Pricing framework: platform fee + per-product modules (2026).",
      "INTERNAL - employee access only.",
    ],
  ],
  [
    "k-rails-invoice-pitch.pdf",
    "K Rails Invoice Portal",
    [
      "Invoice financing for municipalities and enterprise buyers.",
      "OCR-first capture, approval workflows, financial-mode gateways.",
      "Variants: municipality (KIM) and enterprise white-label.",
      "INTERNAL - employee access only.",
    ],
  ],
  [
    "k-lab-product-one-pagers.pdf",
    "Product One-Pagers Pack",
    [
      "KBPM - onboarding and lending operations.",
      "K Risk - portfolio risk and data entry.",
      "K Leads - pipeline and lead routing.",
      "K Rails - invoice financing rails.",
      "Print-ready. INTERNAL - employee access only.",
    ],
  ],
  [
    "case-study-regional-bank.pdf",
    "Case Study - Regional Bank",
    [
      "40% faster customer onboarding with KBPM in 6 months.",
      "120k customers migrated, zero downtime cutover.",
      "Quote: 'The first platform our ops and risk teams both like.'",
      "Cleared for external sharing by legal (2026-07).",
    ],
  ],
  [
    "legacy-pricing-sheet-2025.pdf",
    "Legacy Pricing Sheet 2025",
    [
      "SUPERSEDED - kept for reference only.",
      "See the 2026 pricing framework in the platform pitch deck.",
    ],
  ],
];

for (const [file, title, lines] of SALES_DOCS) {
  writeFileSync(join(privateDir, file), buildPdf(title, lines));
}

console.log(
  `Wrote guidelines placeholder, 2 font files, and ${SALES_DOCS.length} employee-only documents.`,
);
