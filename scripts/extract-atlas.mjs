// Extracts the base-colour texture embedded in card.glb so the card's UV
// layout can be inspected directly.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const buf = readFileSync(fileURLToPath(new URL('../src/components/Lanyard/card.glb', import.meta.url)));

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
const img = json.images[0];
const bv = json.bufferViews[img.bufferView];
const start = bv.byteOffset || 0;
const out = fileURLToPath(new URL('atlas.png', import.meta.url));
writeFileSync(out, bin.subarray(start, start + bv.byteLength));
console.log('wrote', out, bv.byteLength, 'bytes');
