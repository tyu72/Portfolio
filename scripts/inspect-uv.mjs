// Dumps the UV bounds of every mesh primitive in card.glb.
//
// The Lanyard component composites custom art into hardcoded atlas rectangles
// (front = left half at 0.755 height). If the card mesh's real UVs extend past
// those rectangles, the original texture shows around the edges as a dark
// outline — this reports the true extents so the rectangles can be corrected.
import { readFileSync } from 'node:fs';
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

const readAccessor = (idx) => {
  const acc = json.accessors[idx];
  const bv = json.bufferViews[acc.bufferView];
  const base = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const comps = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[acc.type];
  const out = [];
  for (let i = 0; i < acc.count; i++) {
    const row = [];
    for (let c = 0; c < comps; c++) row.push(bin.readFloatLE(base + (i * comps + c) * 4));
    out.push(row);
  }
  return out;
};

for (const mesh of json.meshes) {
  for (const [pi, prim] of mesh.primitives.entries()) {
    if (prim.attributes.TEXCOORD_0 === undefined) {
      console.log(`${mesh.name}[${pi}]: no UVs`);
      continue;
    }
    const uv = readAccessor(prim.attributes.TEXCOORD_0);
    let uMin = 1, uMax = 0, vMin = 1, vMax = 0;
    for (const [u, v] of uv) {
      if (u < uMin) uMin = u;
      if (u > uMax) uMax = u;
      if (v < vMin) vMin = v;
      if (v > vMax) vMax = v;
    }
    const mat = json.materials[prim.material]?.name ?? '-';
    console.log(
      `${mesh.name}[${pi}] material=${mat} verts=${uv.length}  ` +
        `u:[${uMin.toFixed(4)}, ${uMax.toFixed(4)}]  v:[${vMin.toFixed(4)}, ${vMax.toFixed(4)}]`
    );
  }
}
