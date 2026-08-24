/**
 * Writes PNG and JPG companions for mapped brand imagery (and the dimensional
 * K Rails / K Talk product logos) from a folder of designer JPEGs.
 *
 *   KLAB_IMAGERY_PACK=/path/to/jpgs node scripts/import-imagery-rasters.mjs
 *
 * Existing WebPs are left in place. App chrome keeps serving those.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "brand-files");
const pack =
  process.env.KLAB_IMAGERY_PACK ??
  "/Users/nicholaspreziosi/.cursor/projects/Users-nicholaspreziosi-repos-k-lab-products-ux-kbrand/assets";

/** Designer filename stem → catalog path under public/brand-files (no extension). */
const MAP = [
  ["KLab_bg001", "backgrounds/k-lab-bg-001"],
  ["klab-gradient", "backgrounds/k-lab-bg-002"],
  ["klab-gradient-dots", "backgrounds/k-lab-bg-002-dots"],
  ["KLab_bg003", "backgrounds/k-lab-bg-003"],
  ["KLab_bg003_dots", "backgrounds/k-lab-bg-003-dots"],
  ["KLab_bg004", "backgrounds/k-lab-bg-004"],
  ["KLab_bg004_dots", "backgrounds/k-lab-bg-004-dots"],
  ["KLab_bg005", "backgrounds/k-lab-bg-005"],
  ["KLab_bg006", "backgrounds/k-lab-bg-006"],
  ["KLab_screen01", "screens/k-lab-screen-01"],
  ["KLab_screen02", "screens/k-lab-screen-02"],
  ["KLab_screen03", "screens/k-lab-screen-03"],
  ["KLab_KRails", "logos/k-rails/k-rails"],
  ["KLab_KTalk", "logos/k-talk/k-talk"],
];

function designerStem(fileName) {
  return fileName.replace(
    /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpe?g|png)$/i,
    "",
  ).replace(/\.(jpe?g|png)$/i, "");
}

function resolveSource(stem) {
  const match = readdirSync(pack).find(
    (name) => designerStem(name).toLowerCase() === stem.toLowerCase(),
  );
  return match ? join(pack, match) : null;
}

if (!existsSync(pack)) {
  console.error(`Imagery pack not found: ${pack}`);
  process.exit(1);
}

for (const [, dest] of MAP) {
  mkdirSync(join(out, dirname(dest)), { recursive: true });
}

let written = 0;
for (const [stem, dest] of MAP) {
  const src = resolveSource(stem);
  if (!src) {
    console.error(`No source matching "${stem}" in ${pack}`);
    process.exit(1);
  }
  const jpgDest = join(out, `${dest}.jpg`);
  const pngDest = join(out, `${dest}.png`);
  const image = sharp(src).rotate();
  await image.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(jpgDest);
  await image.clone().png({ compressionLevel: 9, palette: false }).toFile(pngDest);
  written += 2;
  console.log(`${stem} → ${dest}.{jpg,png}`);
}

console.log(`Wrote ${written} files under public/brand-files/`);
