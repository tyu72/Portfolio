// Reports how dark the original atlas is around the edges of the rectangles the
// Lanyard component composites into, to locate the source of the dark outline
// showing on the card's edges.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('atlas.png', import.meta.url));
const { width: W, height: H } = await sharp(src).metadata();
console.log(`atlas ${W}x${H}`);

const strip = async (name, left, top, width, height) => {
  const { data, info } = await sharp(src)
    .extract({ left, top, width, height })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let min = 255;
  let sum = 0;
  let darkCount = 0;
  for (const v of data) {
    if (v < min) min = v;
    sum += v;
    if (v < 100) darkCount++;
  }
  const pct = ((darkCount / data.length) * 100).toFixed(1);
  console.log(
    `${name.padEnd(34)} x=${left} y=${top} ${width}x${height}  ` +
      `min=${min} mean=${Math.round(sum / info.width / info.height)} dark<100=${pct}%`
  );
};

const halfW = Math.floor(W / 2);
const vTrue = Math.round(0.7572 * H); // real UV max from the mesh
const vUsed = Math.round(0.755 * H); // what the component fills to

// The band the component leaves unfilled on the front face
await strip('front: unfilled band below 0.755', 0, vUsed, halfW, vTrue - vUsed);
// Just outside the true UV extent (should never be sampled)
await strip('below true UV max', 0, vTrue, halfW, 40);

// Inner edges of the front face
await strip('front: top edge', 0, 0, halfW, 6);
await strip('front: left edge', 0, 0, 6, vTrue);
await strip('front: right edge (u=0.5 seam)', halfW - 6, 0, 6, vTrue);
await strip('back: left edge (u=0.5 seam)', halfW, 0, 6, vTrue);
await strip('back: right edge (u=1)', W - 6, 0, 6, vTrue);
await strip('back: top edge', halfW, 0, halfW, 6);
