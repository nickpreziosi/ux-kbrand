/**
 * Generates the web-ready files served by the portal (public/brand-files/)
 * from the organized originals in brand-source/.
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Raster masters are 8–33 MB PNGs at up to 16000px wide — far too heavy to
 * ship. This downscales them to sane delivery sizes: transparent logos stay
 * PNG (alpha + crisp edges), photographic backgrounds and screens become WebP.
 * Vector PDFs and the Sora typeface are copied through untouched.
 *
 * brand-source/raster-masters/ and brand-source/guidelines-wip/ are gitignored
 * (≈880 MB), so this only runs where those originals are present; the
 * generated output in public/brand-files/ IS committed.
 */
import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "brand-source");
const masters = join(source, "raster-masters");
const out = join(root, "public", "brand-files");

if (!existsSync(masters)) {
  console.error(
    "brand-source/raster-masters/ not found — the originals are gitignored.\n" +
      "Ask the design team for the brand asset package before running this.",
  );
  process.exit(1);
}

for (const dir of ["logos", "logos/vector", "sub-brands", "backgrounds", "screens", "fonts", "docs"]) {
  mkdirSync(join(out, dir), { recursive: true });
}

const report = [];

/** Transparent lockups: keep alpha, keep PNG, cap the absurd master width. */
async function buildLogo(name, width = 1600) {
  const src = join(masters, "logos", `${name}.png`);
  if (!existsSync(src)) return;
  const dest = join(out, "logos", `${name}.png`);
  await sharp(src)
    .trim()
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(dest);
  report.push(["logo", `${name}.png`, statSync(src).size, statSync(dest).size]);
}

/** Photographic art: WebP is dramatically smaller with no visible loss here. */
async function buildWebp(group, name, width, quality = 82) {
  const src = join(masters, group, `${name}.png`);
  if (!existsSync(src)) return;
  const dest = join(out, group, `${name}.webp`);
  await sharp(src)
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  report.push([group, `${name}.webp`, statSync(src).size, statSync(dest).size]);
}

const LOGOS = [
  "k-lab-logo-blue",
  "k-lab-logo-dark",
  "k-lab-logo-white",
  "k-lab-logo-2025",
  "k-lab-logomark-2025",
];

await Promise.all([
  ...LOGOS.map((name) => buildLogo(name, name.includes("logomark") ? 900 : 1600)),
  ...readdirSync(join(masters, "backgrounds"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => buildWebp("backgrounds", f.replace(/\.png$/, ""), 2560)),
  ...readdirSync(join(masters, "screens"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => buildWebp("screens", f.replace(/\.png$/, ""), 1920)),
  ...readdirSync(join(masters, "sub-brands"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => buildWebp("sub-brands", f.replace(/\.png$/, ""), 1600)),
]);

// Vector downloads + the brand typeface pass through as-is.
for (const file of readdirSync(join(source, "vector")).filter((f) => f.endsWith(".pdf"))) {
  const dest = join(out, "logos", "vector", file);
  copyFileSync(join(source, "vector", file), dest);
  report.push(["vector", file, statSync(dest).size, statSync(dest).size]);
}
copyFileSync(join(source, "fonts", "sora-variable.ttf"), join(out, "fonts", "sora-variable.ttf"));
report.push(["font", "sora-variable.ttf", 110224, statSync(join(out, "fonts", "sora-variable.ttf")).size]);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let masterTotal = 0;
let webTotal = 0;
console.log("group        file                                 master →  web");
for (const [group, file, from, to] of report.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))) {
  masterTotal += from;
  webTotal += to;
  console.log(`${group.padEnd(12)} ${file.padEnd(36)} ${kb(from).padStart(8)} → ${kb(to).padStart(8)}`);
}
console.log(
  `\n${report.length} files · ${(masterTotal / 1048576).toFixed(0)} MB of masters → ${(webTotal / 1048576).toFixed(1)} MB served`,
);
