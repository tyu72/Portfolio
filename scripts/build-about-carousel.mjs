// Builds the About page carousel images from the originals in
// src/imported about images and gifs/.
//
// The originals are phone captures: three GIFs of 26-32MB each and stills up
// to 48 megapixels, ~75MB in total, all destined for a card that renders at
// 240x320. Two things fix that. Everything is cropped to the card's 3:4 here
// rather than by the browser, so no pixel is shipped only to be cropped away;
// and the GIFs become animated WebP, which the carousel treats identically
// since it renders plain <img> tags.
//
// Two of the sources arrived as HEIC and are read here from .jpg copies
// sitting beside them. sharp cannot open those particular files: they are
// tiled, and the 48 tile references trip libheif's 16-reference security
// limit. Windows' own imaging stack reads them, so the copies were made with:
//
//   Add-Type -AssemblyName PresentationCore
//   $s = [IO.File]::OpenRead($heic)
//   $dec = [Windows.Media.Imaging.BitmapDecoder]::Create($s,'PreservePixelFormat','OnLoad')
//   $enc = New-Object Windows.Media.Imaging.JpegBitmapEncoder
//   $enc.QualityLevel = 95
//   $enc.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($dec.Frames[0]))
//   $out = [IO.File]::Open($jpg,'Create'); $enc.Save($out); $out.Close(); $s.Close()
//
// Run with: node scripts/build-about-carousel.mjs

import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const p = url => fileURLToPath(url);

const IMPORTED = new URL('../src/imported about images and gifs/', import.meta.url);
const SRC = new URL('../src/images/', import.meta.url);
const OUT = new URL('../src/images/about-carousel/', import.meta.url);

// Twice the 240x320 the card renders at, so the images stay sharp on a
// high-density display without paying for more than that.
const W = 480;
const H = 640;

mkdirSync(p(OUT), { recursive: true });

/**
 * Order is the order the carousel shows them; the Santa Cruz photo leads
 * because it is the one the page showed before this was a carousel.
 *
 * `zoom` narrows the frame to that fraction of its width before the 3:4 crop,
 * for photos where the subject sits to one side and a straight centred crop
 * would keep someone else in shot. `focusX` and `focusY` then aim that window:
 * 1 is flush right, 0 flush left, and the same top to bottom. Together they
 * work like a camera -- zoom sets how much is in frame, focus sets where it
 * points.
 *
 * `fps` re-times an animated source and hands it to ffmpeg instead of sharp,
 * which has no way to drop frames. Phone captures run at 50fps, which nothing
 * at this size needs: the gym clip is 340 frames, and sharp emitted 9.6MB for
 * it where 15fps lands at 2.1MB and looks no different in a 280px card.
 */
const ITEMS = [
  { src: new URL('about me image.jpg', SRC), name: 'santa-cruz.jpg' },
  { src: new URL('IMG_0036.JPG', IMPORTED), name: 'summit-lookout.jpg' },
  { src: new URL('IMG_1351.JPG', IMPORTED), name: 'trailhead-friends.jpg' },
  { src: new URL('IMG_7945.jpeg', IMPORTED), name: 'summit-rock.jpg' },
  { src: new URL('IMG_3159.jpeg', IMPORTED), name: 'card-opening.jpg', zoom: 0.72, focusX: 0.78, focusY: 0.2 },
  // Both already 3:4, so the resize below crops nothing off them.
  { src: new URL('IMG_0677.jpg', IMPORTED), name: 'graduation.jpg' },
  { src: new URL('IMG_0799.jpg', IMPORTED), name: 'christmas-tree.jpg' },
  { src: new URL('315.gif', IMPORTED), name: 'bench-press.webp', animated: true, fps: 15 },
  { src: new URL('IMG_5043.gif', IMPORTED), name: 'fishing.webp', animated: true },
  { src: new URL('337BAEB3-DD92-4266-BE7B-DE9C3BE15D44.gif', IMPORTED), name: 'night-out.webp', animated: true }
];

let before = 0;
let after = 0;

for (const { src, name, animated = false, zoom, focusX = 1, focusY = 0.5, fps } of ITEMS) {
  // `animated` reads every frame rather than just the first. sharp tracks the
  // frame height itself from there, so the resize below applies per frame
  // instead of squashing the whole strip.
  const input = sharp(p(src), { animated, limitInputPixels: false });
  const meta = await input.metadata();
  const frames = meta.pages ?? 1;

  // Phone cameras record which way up they were held in an EXIF flag rather
  // than rotating the pixels. sharp honours that flag only when asked, so
  // without this a photo shot in one orientation comes out on its side. It is
  // a no-op for anything already upright.
  let pipeline = input.rotate();

  if (zoom) {
    // extract() runs on the rotated pixels, so measure them the same way
    // rather than trusting the stored width and height.
    const { info } = await sharp(p(src), { limitInputPixels: false })
      .rotate()
      .toBuffer({ resolveWithObject: true });
    const width = Math.round(info.width * zoom);
    const height = Math.min(info.height, Math.round((width * H) / W));
    pipeline = pipeline.extract({
      left: Math.round((info.width - width) * focusX),
      top: Math.round((info.height - height) * focusY),
      width,
      height
    });
  }

  const out = p(new URL(name, OUT));
  let written;

  if (fps) {
    // Crop to the card's 3:4 here too, so ffmpeg is not scaling away pixels it
    // just spent time encoding. Whichever side is proportionally long is the
    // one that gives.
    const sw = meta.width;
    const sh = meta.pageHeight ?? meta.height;
    const cw = sw / sh < W / H ? sw : Math.round((sh * W) / H);
    const ch = sw / sh < W / H ? Math.round((sw * H) / W) : sh;
    execFileSync('ffmpeg', [
      '-y', '-v', 'error',
      '-i', p(src),
      '-vf', `fps=${fps},crop=${cw}:${ch},scale=${W}:${H}`,
      '-c:v', 'libwebp_anim', '-q:v', '60', '-loop', '0', '-an',
      out
    ]);
    written = { size: statSync(out).size };
  } else {
    const resized = pipeline.resize(W, H, { fit: 'cover', position: 'centre' });
    written = await (animated
      ? resized.webp({ quality: 70, effort: 4 })
      : resized.jpeg({ quality: 82, mozjpeg: true })
    ).toFile(out);
  }

  const srcSize = statSync(p(src)).size;
  before += srcSize;
  after += written.size;

  console.log(
    `${name.padEnd(24)} ${(srcSize / 1048576).toFixed(2).padStart(6)}MB -> ` +
      `${(written.size / 1048576).toFixed(2).padStart(6)}MB` +
      (frames > 1 ? `  (${frames} frames)` : '')
  );
}

console.log(
  `\ntotal ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`
);
