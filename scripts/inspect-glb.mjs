// Reads card.glb and reports the embedded base-colour texture's dimensions,
// so the card-face images can be generated at the exact atlas aspect ratio.
import { readFileSync } from 'node:fs';

const buf = readFileSync(new URL('../src/components/Lanyard/card.glb', import.meta.url));

// glTF-Binary: 12-byte header, then chunks of [length u32][type u32][data]
let offset = 12;
let json = null;
const chunks = [];
while (offset < buf.length) {
  const len = buf.readUInt32LE(offset);
  const type = buf.readUInt32LE(offset + 4);
  const data = buf.subarray(offset + 8, offset + 8 + len);
  if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8'));
  else chunks.push(data);
  offset += 8 + len;
}

const bin = chunks[0];
console.log('images:', (json.images || []).length);

for (const [i, img] of (json.images || []).entries()) {
  const bv = json.bufferViews[img.bufferView];
  const start = bv.byteOffset || 0;
  const bytes = bin.subarray(start, start + bv.byteLength);
  let dims = 'unknown';
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    // PNG: IHDR width/height are big-endian u32 at bytes 16 and 20
    dims = `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)} (png)`;
  } else if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    // JPEG: walk segments to the SOFn frame header
    let p = 2;
    while (p < bytes.length) {
      if (bytes[p] !== 0xff) { p++; continue; }
      const marker = bytes[p + 1];
      const size = bytes.readUInt16BE(p + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        dims = `${bytes.readUInt16BE(p + 7)}x${bytes.readUInt16BE(p + 5)} (jpeg)`;
        break;
      }
      p += 2 + size;
    }
  }
  console.log(`  [${i}] name=${img.name ?? '-'} mime=${img.mimeType ?? '-'} ${dims}`);
}

for (const [i, m] of (json.materials || []).entries()) {
  console.log(`material[${i}] ${m.name}`, JSON.stringify(m.pbrMetallicRoughness?.baseColorTexture ?? null));
}
