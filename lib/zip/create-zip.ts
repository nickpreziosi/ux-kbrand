import { deflateRawSync } from "node:zlib";

/**
 * Minimal ZIP writer for bundling a handful of brand files into one download.
 * Deliberately dependency-free: the archive is a fixed, well-specified format
 * and the alternative is a build-time dependency for one route.
 *
 * Scope — everything a brand bundle needs and nothing else: no directories, no
 * ZIP64 (entries stay well under 4 GB and 65,535 files), no encryption, no
 * data descriptors. Timestamps are fixed so the same inputs always produce
 * byte-identical output, which keeps the route cacheable and the tests exact.
 */

export interface ZipEntry {
  /** Name inside the archive; must be unique across the bundle. */
  name: string;
  data: Uint8Array;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Two files in one zip can share a basename (PNG + PNG from different
 * artworks, or a duplicate format on one asset). Keep both, distinctly named.
 */
export function uniqueZipEntryName(taken: Set<string>, fileName: string): string {
  if (!taken.has(fileName)) {
    taken.add(fileName);
    return fileName;
  }
  const dot = fileName.lastIndexOf(".");
  const stem = dot > 0 ? fileName.slice(0, dot) : fileName;
  const extension = dot > 0 ? fileName.slice(dot) : "";
  for (let n = 2; ; n += 1) {
    const candidate = `${stem}-${n}${extension}`;
    if (!taken.has(candidate)) {
      taken.add(candidate);
      return candidate;
    }
  }
}

/** MS-DOS date for 1980-01-01 — the epoch of the format, and stable. */
const DOS_DATE = 0x0021;
const DOS_TIME = 0x0000;
/** General purpose bit 11: file names are UTF-8. */
const FLAG_UTF8 = 0x0800;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;

interface PreparedEntry {
  nameBytes: Uint8Array;
  body: Uint8Array;
  method: number;
  crc: number;
  uncompressedSize: number;
  offset: number;
}

export function createZip(entries: ZipEntry[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const prepared: PreparedEntry[] = [];
  const chunks: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const deflated = new Uint8Array(deflateRawSync(entry.data));
    // Incompressible files (PNG, PDF) inflate under deflate — store those.
    const useDeflate = deflated.length < entry.data.length;
    const body = useDeflate ? deflated : entry.data;

    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // local file header signature
    view.setUint16(4, 20, true); // version needed
    view.setUint16(6, FLAG_UTF8, true);
    view.setUint16(8, useDeflate ? METHOD_DEFLATE : METHOD_STORE, true);
    view.setUint16(10, DOS_TIME, true);
    view.setUint16(12, DOS_DATE, true);
    view.setUint32(14, crc32(entry.data), true);
    view.setUint32(18, body.length, true);
    view.setUint32(22, entry.data.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true); // extra field length
    header.set(nameBytes, 30);

    chunks.push(header, body);
    prepared.push({
      nameBytes,
      body,
      method: useDeflate ? METHOD_DEFLATE : METHOD_STORE,
      crc: crc32(entry.data),
      uncompressedSize: entry.data.length,
      offset,
    });
    offset += header.length + body.length;
  }

  const centralStart = offset;
  for (const entry of prepared) {
    const record = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(record.buffer);
    view.setUint32(0, 0x02014b50, true); // central directory signature
    view.setUint16(4, 20, true); // version made by
    view.setUint16(6, 20, true); // version needed
    view.setUint16(8, FLAG_UTF8, true);
    view.setUint16(10, entry.method, true);
    view.setUint16(12, DOS_TIME, true);
    view.setUint16(14, DOS_DATE, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.body.length, true);
    view.setUint32(24, entry.uncompressedSize, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true); // extra field length
    view.setUint16(32, 0, true); // comment length
    view.setUint16(34, 0, true); // disk number start
    view.setUint16(36, 0, true); // internal attributes
    view.setUint32(38, 0, true); // external attributes
    view.setUint32(42, entry.offset, true);
    record.set(entry.nameBytes, 46);

    chunks.push(record);
    offset += record.length;
  }

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); // end of central directory signature
  endView.setUint16(4, 0, true); // this disk
  endView.setUint16(6, 0, true); // disk with central directory
  endView.setUint16(8, prepared.length, true);
  endView.setUint16(10, prepared.length, true);
  endView.setUint32(12, offset - centralStart, true);
  endView.setUint32(16, centralStart, true);
  endView.setUint16(20, 0, true); // comment length
  chunks.push(end);

  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const archive = new Uint8Array(total);
  let cursor = 0;
  for (const chunk of chunks) {
    archive.set(chunk, cursor);
    cursor += chunk.length;
  }
  return archive;
}
