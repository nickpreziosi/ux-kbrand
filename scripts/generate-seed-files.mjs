/**
 * Generates the seed asset files referenced by
 * contexts/brand-assets/infrastructure/mock/seed-assets.ts:
 *   - public/brand-files/*   (public downloads, served statically)
 *   - private-assets/*       (employee downloads, streamed by /api/sales-files)
 *
 * Run once after clone: `node scripts/generate-seed-files.mjs`
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public", "brand-files");
const privateDir = join(root, "private-assets");
mkdirSync(publicDir, { recursive: true });
mkdirSync(privateDir, { recursive: true });

/** Minimal valid single-page PDF with a title and body lines. */
function buildPdf(title, lines) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  let content = `BT /F1 24 Tf 72 720 Td (${esc(title)}) Tj ET\n`;
  lines.forEach((line, i) => {
    content += `BT /F1 12 Tf 72 ${680 - i * 20} Td (${esc(line)}) Tj ET\n`;
  });
  content += `BT /F1 9 Tf 72 60 Td (K Lab - Brand and Sales Resource Portal - prototype seed document) Tj ET\n`;

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
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

const ORANGE = "#F97316";

const logoPrimary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96" role="img" aria-label="K Lab">
  <rect x="8" y="8" width="80" height="80" rx="18" fill="${ORANGE}"/>
  <path d="M32 26v44M32 48l26-22M36 44l24 26" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="108" y="62" font-family="Sora, sans-serif" font-size="40" font-weight="700" fill="#0B0B0F">K Lab</text>
  <text x="110" y="80" font-family="Sora, sans-serif" font-size="13" font-weight="500" letter-spacing="6" fill="${ORANGE}">FINTECH</text>
</svg>\n`;

const logoMono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96" role="img" aria-label="K Lab monochrome">
  <rect x="8" y="8" width="80" height="80" rx="18" fill="#0B0B0F"/>
  <path d="M32 26v44M32 48l26-22M36 44l24 26" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="108" y="62" font-family="Sora, sans-serif" font-size="40" font-weight="700" fill="#0B0B0F">K Lab</text>
</svg>\n`;

const logoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="K Lab icon">
  <rect x="4" y="4" width="88" height="88" rx="20" fill="${ORANGE}"/>
  <path d="M30 24v48M30 48l28-24M34 44l26 28" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>\n`;

const soraKit = `/* K Lab brand typeface — Sora font-face kit
 * Weights: 300 (Light) 400 (Regular) 500 (Medium) 600 (SemiBold) 700 (Bold)
 * Self-host or load from Google Fonts. Fallback stack below.
 */
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap");

:root {
  --font-sora: "Sora", "Segoe UI", system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--font-sora);
  font-optical-sizing: auto;
}

/* Usage: headings 600–700, body 400, captions/labels 500. */
`;

const typographyTokens = `/* K Lab typography tokens — pair with sora-font-kit.css */
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
`;

// ── Public files ─────────────────────────────────────────────────────────
writeFileSync(join(publicDir, "k-lab-brand-guidelines-v3.pdf"), buildPdf("K Lab Brand Guidelines v3", [
  "1. Logo — construction, clearspace (1x K-height), minimum sizes",
  "2. Color — accent orange hsl(23 90% 54%), neutrals derived from base hue",
  "3. Typography — Sora 300-700, tokens in the fonts category",
  "4. Imagery — wave, orange field, and gradient mesh backgrounds",
  "5. Application — decks, one-pagers, product UI, social",
]));
writeFileSync(join(publicDir, "k-lab-voice-and-tone.pdf"), buildPdf("Voice & Tone Playbook", [
  "Principles: precise, confident, human. Fintech without the jargon.",
  "We say: 'Your money moves faster.' We avoid: 'Leverage synergies.'",
  "Product copy: verbs first, sentence case, no exclamation marks.",
  "Localization: en / es / pt / ar — meaning over literal translation.",
]));
writeFileSync(join(publicDir, "k-lab-logo-primary.svg"), logoPrimary);
writeFileSync(join(publicDir, "k-lab-logo-mono.svg"), logoMono);
writeFileSync(join(publicDir, "k-lab-icon.svg"), logoIcon);
writeFileSync(join(publicDir, "sora-font-kit.css"), soraKit);
writeFileSync(join(publicDir, "k-lab-typography-tokens.css"), typographyTokens);

// Brand imagery — reuse the real brand backgrounds shipped with brand-assets.
const imagery = [
  ["bg-wave.webp", "k-lab-bg-wave.webp"],
  ["bg-orange.webp", "k-lab-bg-orange.webp"],
  ["bg-gradient.webp", "k-lab-bg-gradient.webp"],
];
for (const [src, dest] of imagery) {
  const from = join(root, "public", "images", src);
  if (existsSync(from)) copyFileSync(from, join(publicDir, dest));
}

// ── Private (employee-only) files ────────────────────────────────────────
writeFileSync(join(privateDir, "k-lab-platform-pitch-2026.pdf"), buildPdf("K Lab Platform Pitch 2026", [
  "The operating system for B2B finance.",
  "Suite: KBPM - K Risk - K Leads - K Rails, one SSO, one design system.",
  "Architecture: shell-canonical subdomains, auth bridge, Firebase identity.",
  "Pricing framework: platform fee + per-product modules (2026).",
  "INTERNAL - employee access only.",
]));
writeFileSync(join(privateDir, "k-rails-invoice-pitch.pdf"), buildPdf("K Rails Invoice Portal", [
  "Invoice financing for municipalities and enterprise buyers.",
  "OCR-first capture, approval workflows, financial-mode gateways.",
  "Variants: municipality (KIM) and enterprise white-label.",
  "INTERNAL - employee access only.",
]));
writeFileSync(join(privateDir, "k-lab-product-one-pagers.pdf"), buildPdf("Product One-Pagers Pack", [
  "KBPM - onboarding and lending operations.",
  "K Risk - portfolio risk and data entry.",
  "K Leads - pipeline and lead routing.",
  "K Rails - invoice financing rails.",
  "Print-ready. INTERNAL - employee access only.",
]));
writeFileSync(join(privateDir, "case-study-regional-bank.pdf"), buildPdf("Case Study - Regional Bank", [
  "40% faster customer onboarding with KBPM in 6 months.",
  "120k customers migrated, zero downtime cutover.",
  "Quote: 'The first platform our ops and risk teams both like.'",
  "Cleared for external sharing by legal (2026-07).",
]));
writeFileSync(join(privateDir, "legacy-pricing-sheet-2025.pdf"), buildPdf("Legacy Pricing Sheet 2025", [
  "SUPERSEDED - kept for reference only.",
  "See the 2026 pricing framework in the platform pitch deck.",
]));

console.log("Seed files written to public/brand-files and private-assets.");
