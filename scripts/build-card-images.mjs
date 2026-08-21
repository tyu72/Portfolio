// Generates the lanyard card's front and back faces, plus a web-sized About
// headshot, from the source images in src/images/.
//
// Face dimensions come from card.glb's texture atlas (1678x1677) and the UV
// rects the Lanyard component composites into: the front face is the left half
// at 0.755 height, the back the right half at 0.757. Matching those exactly
// means the images fill each face with no cropping.
//
// Run: node scripts/build-card-images.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Source filenames contain spaces, so URLs must be decoded rather than sliced.
const p = (url) => fileURLToPath(url);

const SRC = new URL('../src/images/', import.meta.url);
const OUT = new URL('../src/components/Lanyard/', import.meta.url);

const ATLAS_W = 1678;
const ATLAS_H = 1677;
const FACE_W = Math.round(0.5 * ATLAS_W); // 839
const FRONT_H = Math.round(0.755 * ATLAS_H); // 1266
const BACK_H = Math.round(0.757 * ATLAS_H); // 1269

const INK = '#1a1d29';
const BORDER = 38; // white frame around the photo, in face pixels

// ---------- front: photo in a white frame ----------
// lanyard-photo.jpg is the decoded copy of "lanyard image.HEIC" — sharp cannot
// read HEIC, so that conversion is done once with Windows' imaging stack:
//   Add-Type -AssemblyName PresentationCore, WindowsBase
//   [System.Windows.Media.Imaging.BitmapFrame]::Create($uri,'None','OnLoad')
const photo = await sharp(p(new URL('lanyard-photo.jpg', SRC)))
  .resize({
    width: FACE_W - BORDER * 2,
    height: FRONT_H - BORDER * 2,
    fit: 'cover',
    position: 'top' // keep the face in frame on a portrait photo
  })
  .toBuffer();

await sharp({
  create: { width: FACE_W, height: FRONT_H, channels: 4, background: '#ffffff' }
})
  .composite([{ input: photo, left: BORDER, top: BORDER }])
  // JPEG, not PNG: this face is a photograph and needs no transparency —
  // as a PNG it weighed 2 MB, which dominated the whole bundle.
  .jpeg({ quality: 88 })
  .toFile(p(new URL('card-front.jpg', OUT)));

console.log(`card-front.jpg  ${FACE_W}x${FRONT_H}`);

// ---------- back: tech logos on white ----------
const LOGOS = ['github', 'unity', 'cplusplus', 'react', 'python', 'supabase'];
const COLS = 2;
const ROWS = 3;
const CELL_W = FACE_W / COLS;
const CELL_H = (BACK_H - 150) / ROWS; // leave room for the caption
const ICON = 150;

const tiles = await Promise.all(
  LOGOS.map(async (name, i) => {
    const raw = readFileSync(new URL(`logos/${name}.svg`, import.meta.url)).toString();
    // simple-icons ship monochrome paths with no fill; tint them to the ink colour.
    const tinted = raw.replace('<svg ', `<svg fill="${INK}" `);
    const buf = await sharp(Buffer.from(tinted)).resize(ICON, ICON, { fit: 'contain' }).png().toBuffer();
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
      input: buf,
      left: Math.round(col * CELL_W + (CELL_W - ICON) / 2),
      top: Math.round(110 + row * CELL_H + (CELL_H - ICON) / 2)
    };
  })
);

const caption = Buffer.from(
  `<svg width="${FACE_W}" height="${BACK_H}" xmlns="http://www.w3.org/2000/svg">
     <text x="${FACE_W / 2}" y="72" text-anchor="middle"
           font-family="Verdana, DejaVu Sans, sans-serif" font-size="46" font-weight="bold"
           letter-spacing="4" fill="${INK}">TONY YU</text>
     <text x="${FACE_W / 2}" y="${BACK_H - 54}" text-anchor="middle"
           font-family="Verdana, DejaVu Sans, sans-serif" font-size="30"
           letter-spacing="3" fill="#5B8CFF">yutony.dev</text>
   </svg>`
);

await sharp({
  create: { width: FACE_W, height: BACK_H, channels: 4, background: '#ffffff' }
})
  .composite([...tiles, { input: caption, left: 0, top: 0 }])
  .png()
  .toFile(p(new URL('card-back.png', OUT)));

console.log(`card-back.png   ${FACE_W}x${BACK_H}  (${LOGOS.join(', ')})`);

// ---------- lanyard strap ----------
// One tile of the repeating strap print. The tile is 2:1, and the component
// repeats it along the strap at a fixed world length so the print keeps its
// proportions whether the strap hangs at rest or is pulled taut.
const STRAP_W = 512;
const STRAP_H = 256;

// Light strap on a dark page. A near-black strap measured 1.35:1 against the
// background and was effectively invisible; inverting it reads at 11.6:1.
const STRAP_BG = '#e7e9f2';
const STRAP_FG = '#15161c';

await sharp(
  Buffer.from(
    `<svg width="${STRAP_W}" height="${STRAP_H}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${STRAP_W}" height="${STRAP_H}" fill="${STRAP_BG}"/>
       <text x="${STRAP_W / 2}" y="${STRAP_H / 2}" text-anchor="middle" dominant-baseline="central"
             font-family="Verdana, DejaVu Sans, sans-serif" font-size="110" font-weight="bold"
             letter-spacing="10" fill="${STRAP_FG}">TY</text>
     </svg>`
  )
)
  .png()
  .toFile(p(new URL('strap-ty.png', OUT)));

console.log(`strap-ty.png    ${STRAP_W}x${STRAP_H}`);

// ---------- about page headshot ----------
const aboutOut = p(new URL('about-headshot.jpg', SRC));
const meta = await sharp(p(new URL('about me image.jpg', SRC))).metadata();
await sharp(p(new URL('about me image.jpg', SRC)))
  .rotate() // honour EXIF orientation
  // 3:4 portrait, matching the vertical frame the About page renders it in.
  .resize({ width: 840, height: 1120, fit: 'cover', position: 'attention' })
  .jpeg({ quality: 86 })
  .toFile(aboutOut);

console.log(`about-headshot.jpg 840x1120 (source ${meta.width}x${meta.height})`);
