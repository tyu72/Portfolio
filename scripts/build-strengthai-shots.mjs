// Crops the StrengthAI screenshots in src/imported strengthai/ to one size
// and encodes them lossless into src/images/strengthai/.
//
// Cropped rather than resized: the captures came off the device at 1x and
// are already soft, so resampling would only soften them further.
//
// Run: node scripts/build-strengthai-shots.mjs

import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const p = url => fileURLToPath(url);

const IMPORTED = new URL('../src/imported strengthai/', import.meta.url);
const OUT = new URL('../src/images/strengthai/', import.meta.url);

// Order is the order the card shows them.
const ITEMS = [
  { src: 'tricep extension.png', name: 'resolver-tricep.webp' },
  { src: 'shoulder press.png', name: 'resolver-shoulder-press.webp' },
  { src: 'ai coach.png', name: 'coach.webp' }
];

mkdirSync(p(OUT), { recursive: true });

// Smallest in each axis, so every crop only ever removes.
const sizes = await Promise.all(
  ITEMS.map(({ src }) => sharp(p(new URL(src, IMPORTED))).metadata())
);
const W = Math.min(...sizes.map(m => m.width));
const H = Math.min(...sizes.map(m => m.height));

console.log(`source sizes: ${sizes.map(m => `${m.width}x${m.height}`).join(', ')}`);
console.log(`cropping all to ${W}x${H}\n`);

let before = 0;
let after = 0;

for (const { src, name } of ITEMS) {
  const from = p(new URL(src, IMPORTED));
  const meta = await sharp(from).metadata();

  // Centred, so the few pixels lost come off both edges rather than the header.
  const written = await sharp(from)
    .extract({
      left: Math.round((meta.width - W) / 2),
      top: Math.round((meta.height - H) / 2),
      width: W,
      height: H
    })
    .webp({ lossless: true })
    .toFile(p(new URL(name, OUT)));

  const srcSize = statSync(from).size;
  before += srcSize;
  after += written.size;

  console.log(
    `${name.padEnd(28)} ${(srcSize / 1024).toFixed(0).padStart(4)}KB -> ` +
      `${(written.size / 1024).toFixed(0).padStart(4)}KB  (${meta.width}x${meta.height} -> ${W}x${H})`
  );
}

console.log(
  `\ntotal ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller, pixel-identical)`
);
