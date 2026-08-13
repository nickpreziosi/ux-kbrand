/**
 * @jest-environment node
 */
import { inflateRawSync } from "node:zlib";
import { createZip, crc32, type ZipEntry } from "@/lib/zip/create-zip";

const LOCAL_HEADER = 0x04034b50;
const CENTRAL_HEADER = 0x02014b50;
const END_OF_CENTRAL = 0x06054b50;

/**
 * Minimal reader — walks the central directory the way a real unzip does, so
 * the test fails if offsets, sizes, or CRCs disagree with the archive body.
 */
function readZip(archive: Uint8Array): Array<{
  name: string;
  data: Buffer;
  method: number;
}> {
  const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
  const endOffset = archive.length - 22;
  expect(view.getUint32(endOffset, true)).toBe(END_OF_CENTRAL);

  const count = view.getUint16(endOffset + 10, true);
  let cursor = view.getUint32(endOffset + 16, true);
  const files = [];

  for (let i = 0; i < count; i += 1) {
    expect(view.getUint32(cursor, true)).toBe(CENTRAL_HEADER);
    const method = view.getUint16(cursor + 10, true);
    const crc = view.getUint32(cursor + 16, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const name = Buffer.from(archive.slice(cursor + 46, cursor + 46 + nameLength)).toString(
      "utf8",
    );
    cursor += 46 + nameLength;

    expect(view.getUint32(localOffset, true)).toBe(LOCAL_HEADER);
    const localNameLength = view.getUint16(localOffset + 26, true);
    const localExtraLength = view.getUint16(localOffset + 28, true);
    const bodyStart = localOffset + 30 + localNameLength + localExtraLength;
    const body = Buffer.from(archive.slice(bodyStart, bodyStart + compressedSize));
    const data = method === 8 ? inflateRawSync(body) : body;

    expect(data.length).toBe(uncompressedSize);
    expect(crc32(new Uint8Array(data))).toBe(crc);
    files.push({ name, data, method });
  }

  return files;
}

describe("crc32", () => {
  it("matches the reference checksums", () => {
    expect(crc32(new TextEncoder().encode("hello world"))).toBe(0x0d4a1185);
    expect(crc32(new Uint8Array())).toBe(0);
  });
});

describe("createZip", () => {
  const entries: ZipEntry[] = [
    { name: "k-lab-logo-blue.png", data: new TextEncoder().encode("png-bytes") },
    {
      name: "k-lab-logo-blue.svg",
      // Repetitive text so deflate actually wins and the branch is exercised.
      data: new TextEncoder().encode("<svg></svg>".repeat(60)),
    },
  ];

  it("round-trips every entry with its name and bytes intact", () => {
    const files = readZip(createZip(entries));

    expect(files.map((file) => file.name)).toEqual([
      "k-lab-logo-blue.png",
      "k-lab-logo-blue.svg",
    ]);
    expect(files[0].data.toString()).toBe("png-bytes");
    expect(files[1].data.toString()).toBe("<svg></svg>".repeat(60));
  });

  it("deflates what compresses and stores what does not", () => {
    const files = readZip(createZip(entries));

    expect(files[1].method).toBe(8);
    expect(files[0].method).toBe(0);
  });

  it("keeps incompressible entries no larger than their input", () => {
    // xorshift32 — high enough entropy that deflate would grow the payload.
    const random = new Uint8Array(2048);
    let state = 0x2545f491;
    for (let i = 0; i < random.length; i += 1) {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      random[i] = state & 0xff;
    }

    const archive = createZip([{ name: "noise.bin", data: random }]);
    const [file] = readZip(archive);

    expect(file.method).toBe(0);
    expect(Buffer.from(file.data).equals(Buffer.from(random))).toBe(true);
  });

  it("writes UTF-8 names and an empty archive when given no entries", () => {
    const named = readZip(createZip([{ name: "logotipo-café.svg", data: new Uint8Array([1]) }]));
    expect(named[0].name).toBe("logotipo-café.svg");

    const empty = createZip([]);
    expect(empty).toHaveLength(22);
    expect(readZip(empty)).toEqual([]);
  });

  it("is deterministic for identical input", () => {
    expect(Buffer.from(createZip(entries)).equals(Buffer.from(createZip(entries)))).toBe(
      true,
    );
  });
});
