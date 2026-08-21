/**
 * Packs each K Lab logomark PNG into one .ico with 16 / 32 / 48 / 64 / 256 px
 * layers (PNG-compressed, Windows Vista+). One file is the download; the OS
 * and browser pick the size they need.
 *
 *   node scripts/build-logomark-ico.mjs
 */
import sharp from "sharp";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "brand-files", "logos", "k-lab");
const chromeIcoDir = join(root, "public", "ico");
const SIZES = [16, 32, 48, 64, 256];
/** Library basename → app chrome name (k-lab-components public/ico convention). */
const MARKS = [
  { name: "klab_logomark_blue", chrome: "favicon-blue.ico" },
  { name: "klab_logomark_dark", chrome: "favicon-grey.ico" },
  { name: "klab_logomark_light", chrome: "favicon-white.ico" },
];

function encodeIco(pngs) {
  const count = pngs.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const entries = pngs.map((png) => {
    const entry = { png, offset, bytes: png.length };
    offset += png.length;
    return entry;
  });

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);

  entries.forEach((entry, index) => {
    const size = SIZES[index];
    const at = 6 + index * 16;
    buf.writeUInt8(size >= 256 ? 0 : size, at);
    buf.writeUInt8(size >= 256 ? 0 : size, at + 1);
    buf.writeUInt8(0, at + 2);
    buf.writeUInt8(0, at + 3);
    buf.writeUInt16LE(1, at + 4);
    buf.writeUInt16LE(32, at + 6);
    buf.writeUInt32LE(entry.bytes, at + 8);
    buf.writeUInt32LE(entry.offset, at + 12);
    entry.png.copy(buf, entry.offset);
  });
  return buf;
}

mkdirSync(chromeIcoDir, { recursive: true });

for (const { name, chrome } of MARKS) {
  const src = join(dir, `${name}.png`);
  const pngs = [];
  for (const size of SIZES) {
    pngs.push(
      await sharp(src)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer(),
    );
  }
  const ico = encodeIco(pngs);
  const dest = join(dir, `${name}.ico`);
  writeFileSync(dest, ico);
  copyFileSync(dest, join(chromeIcoDir, chrome));
  console.log(
    `${name}.ico  ${SIZES.join("/")}  ${(ico.length / 1024).toFixed(1)} KB  →  ico/${chrome}`,
  );
}
