/**
 * Imports the 2026 K Lab logo pack: copies AI/PDF masters as-is, exports
 * tight SVG/PNG via Adobe Illustrator (artboard fitted to visibleBounds),
 * writes the library tree under public/brand-files/logos/{product}/, and
 * replaces app-chrome SVGs in public/logos/.
 *
 *   node scripts/import-klab-logos.mjs
 *   KLAB_LOGO_PACK=/path/to/pack KLAB_LOGO_ONLY=k-leads node scripts/import-klab-logos.mjs
 *
 * Requires Adobe Illustrator. Override the pack folder with KLAB_LOGO_PACK.
 * KLAB_LOGO_ONLY limits the run to matching artwork ids or product slugs.
 */
import sharp from "sharp";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir =
  process.env.KLAB_LOGO_PACK ??
  "/Users/nicholaspreziosi/Downloads/KLab 2026 all assets brand portal/KLab_logos";
const publicLogos = join(root, "public", "brand-files", "logos");
const brandSource = join(root, "brand-source", "vector", "logos");
const chromeDir = join(root, "public", "logos");
const jsxPath = join(root, "scripts", ".import-klab-logos.jsx");

const ARTWORKS = [
  { source: "klab_01_logomark_blue", id: "klab_logomark_blue", product: "k-lab" },
  { source: "klab_01_logomark_dark", id: "klab_logomark_dark", product: "k-lab" },
  { source: "klab_01_logomark_light", id: "klab_logomark_light", product: "k-lab" },
  { source: "klab_03_full logo_blue", id: "klab_full_logo_blue", product: "k-lab" },
  { source: "klab_03_full logo_dark", id: "klab_full_logo_dark", product: "k-lab" },
  { source: "klab_03_full logo_light", id: "klab_full_logo_light", product: "k-lab" },
  {
    source: "klab_03_full logo_flat black",
    id: "klab_full_logo_flat_black",
    product: "k-lab",
  },
  {
    source: "klab_03_full logo_flat white",
    id: "klab_full_logo_flat_white",
    product: "k-lab",
  },
  {
    source: "klab_24_sub brands_KRails dark",
    id: "klab_sub_brands_krails_dark",
    product: "k-rails",
  },
  {
    source: "klab_24_sub brands_KRails light",
    id: "klab_sub_brands_krails_light",
    product: "k-rails",
  },
  {
    source: "klab_24_sub brands_KRisk dark",
    id: "klab_sub_brands_krisk_dark",
    product: "k-risk",
  },
  {
    source: "klab_24_sub brands_KRisk light",
    id: "klab_sub_brands_krisk_light",
    product: "k-risk",
  },
  {
    source: "klab_24_sub brands_KTalk dark",
    id: "klab_sub_brands_ktalk_dark",
    product: "k-talk",
  },
  {
    source: "klab_24_sub brands_KTalk light",
    id: "klab_sub_brands_ktalk_light",
    product: "k-talk",
  },
  {
    source: "klab_24_sub brands_KLeads dark",
    id: "klab_sub_brands_kleads_dark",
    product: "k-leads",
  },
  {
    source: "klab_24_sub brands_KLeads light",
    id: "klab_sub_brands_kleads_light",
    product: "k-leads",
  },
];

const PRODUCTS = ["k-lab", "k-rails", "k-talk", "k-risk", "k-leads"];
const onlyFilter = (process.env.KLAB_LOGO_ONLY ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const artworks = onlyFilter.length
  ? ARTWORKS.filter(
      (art) => onlyFilter.includes(art.id) || onlyFilter.includes(art.product),
    )
  : ARTWORKS;

const CHROME = {
  "klab-logo-full-blue.svg": "k-lab/klab_full_logo_blue.svg",
  "klab-logo-full-dark.svg": "k-lab/klab_full_logo_dark.svg",
  "klab-logo-full-white.svg": "k-lab/klab_full_logo_light.svg",
  "klab-logo-icon.svg": "k-lab/klab_logomark_dark.svg",
  "klab-logo-icon-white.svg": "k-lab/klab_logomark_light.svg",
};

if (!existsSync(sourceDir)) {
  console.error(`Logo pack not found: ${sourceDir}`);
  process.exit(1);
}

if (onlyFilter.length && artworks.length === 0) {
  console.error(`No artworks matched KLAB_LOGO_ONLY=${onlyFilter.join(",")}`);
  process.exit(1);
}

for (const product of PRODUCTS) {
  mkdirSync(join(publicLogos, product), { recursive: true });
}
mkdirSync(brandSource, { recursive: true });
mkdirSync(chromeDir, { recursive: true });

const jobs = [];
for (const art of artworks) {
  const aiSrc = join(sourceDir, `${art.source}.ai`);
  const pdfSrc = join(sourceDir, `${art.source}.pdf`);
  if (!existsSync(aiSrc) || !existsSync(pdfSrc)) {
    console.error(`Missing source for ${art.id}:\n  ${aiSrc}\n  ${pdfSrc}`);
    process.exit(1);
  }
  const destDir = join(publicLogos, art.product);
  copyFileSync(aiSrc, join(destDir, `${art.id}.ai`));
  copyFileSync(pdfSrc, join(destDir, `${art.id}.pdf`));
  copyFileSync(aiSrc, join(brandSource, `${art.id}.ai`));
  copyFileSync(pdfSrc, join(brandSource, `${art.id}.pdf`));
  jobs.push({
    id: art.id,
    ai: aiSrc,
    svg: join(destDir, `${art.id}.svg`),
    png: join(destDir, `${art.id}.png`),
  });
}

const jsxJobs = JSON.stringify(
  jobs.map((job) => ({
    id: job.id,
    ai: job.ai,
    svg: job.svg,
    png: job.png,
  })),
);

writeFileSync(
  jsxPath,
  `app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
var jobs = ${jsxJobs};
var lines = [];
for (var i = 0; i < jobs.length; i++) {
  var job = jobs[i];
  try {
    var doc = app.open(new File(job.ai));
    doc.artboards[0].artboardRect = doc.visibleBounds;
    var svgOpts = new ExportOptionsSVG();
    svgOpts.embedRasterImages = false;
    svgOpts.compressed = false;
    svgOpts.dtd = SVGDTDVersion.SVG1_1;
    svgOpts.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
    doc.exportFile(new File(job.svg), ExportType.SVG, svgOpts);
    var pngOpts = new ExportOptionsPNG24();
    pngOpts.transparency = true;
    pngOpts.artBoardClipping = true;
    pngOpts.antiAliasing = true;
    pngOpts.horizontalScale = 400;
    pngOpts.verticalScale = 400;
    doc.exportFile(new File(job.png), ExportType.PNG24, pngOpts);
    doc.close(SaveOptions.DONOTSAVECHANGES);
    lines.push(job.id + ":ok");
  } catch (err) {
    try { app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); } catch (ignored) {}
    lines.push(job.id + ":err " + err);
  }
}
lines.join("\\n");
`,
  "utf8",
);

const applescript = `
tell application "Adobe Illustrator"
  set user interaction level to never interact
  do javascript file POSIX file ${JSON.stringify(jsxPath)}
end tell
`;

console.log(`Exporting ${jobs.length} artworks via Illustrator…`);
const illustratorOut = execFileSync("osascript", ["-e", applescript], {
  encoding: "utf8",
  timeout: 180000,
});
console.log(illustratorOut.trim());
if (illustratorOut.includes(":err")) {
  console.error("Illustrator reported export errors.");
  process.exit(1);
}

for (const job of jobs) {
  if (!existsSync(job.svg) || !existsSync(job.png)) {
    console.error(`Export missing for ${job.id}`);
    process.exit(1);
  }
  const isMark = job.id.includes("logomark");
  const maxWidth = isMark ? 900 : 1600;
  const tmp = `${job.png}.tmp`;
  try {
    await sharp(job.png)
      .trim()
      .resize({ width: maxWidth, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: false })
      .toFile(tmp);
    copyFileSync(tmp, job.png);
    unlinkSync(tmp);
  } catch (error) {
    if (existsSync(tmp)) unlinkSync(tmp);
    await sharp(job.png)
      .resize({ width: maxWidth, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: false })
      .toFile(tmp);
    copyFileSync(tmp, job.png);
    unlinkSync(tmp);
    console.warn(`trim skipped for ${job.id}: ${error.message}`);
  }
}

if (!onlyFilter.length) {
  for (const [chromeName, relative] of Object.entries(CHROME)) {
    copyFileSync(join(publicLogos, relative), join(chromeDir, chromeName));
  }

  const subBrands = join(root, "public", "brand-files", "sub-brands");
  for (const [file, dest] of [
    ["k-rails.webp", join(publicLogos, "k-rails", "k-rails.webp")],
    ["k-talk.webp", join(publicLogos, "k-talk", "k-talk.webp")],
  ]) {
    const from = join(subBrands, file);
    if (existsSync(from)) copyFileSync(from, dest);
  }

  const stale = [
    join(subBrands, "k-rails.webp"),
    join(subBrands, "k-talk.webp"),
    join(subBrands, "k-rails-logo-dark.png"),
    join(subBrands, "k-rails-logo-dark.svg"),
    join(subBrands, "k-talk-logo-dark.png"),
    join(subBrands, "k-talk-logo-dark.svg"),
  ];
  for (const file of stale) {
    if (existsSync(file)) unlinkSync(file);
  }

  for (const name of readdirSync(publicLogos)) {
    const path = join(publicLogos, name);
    if (PRODUCTS.includes(name)) continue;
    rmSync(path, { recursive: true, force: true });
  }
}

if (existsSync(jsxPath)) unlinkSync(jsxPath);

const written = artworks.flatMap((art) =>
  ["png", "svg", "pdf", "ai"].map((ext) => `${art.product}/${art.id}.${ext}`),
);
console.log(`Wrote ${written.length} library files under public/brand-files/logos/`);
for (const art of artworks) {
  const svg = readFileSync(join(publicLogos, art.product, `${art.id}.svg`), "utf8");
  if (!svg.includes("<path") && !svg.includes("<polygon")) {
    console.warn(`SVG for ${art.id} may not contain vector paths`);
  }
}
