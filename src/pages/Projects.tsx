import { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FoldText from '../components/FoldText/FoldText';
import TagPill from '../components/TagPill';
import CardDeck from '../components/CardDeck/CardDeck';
import { PROJECTS, type ProjectDetail } from '../lib/content';

/** Width of the embed box's border, in px — kept out of the scale maths. */
const BOX_BORDER = 1;

/**
 * An embed that renders at its own fixed size and is scaled down to fit.
 *
 * Both games draw to a fixed Phaser canvas — 800x600 and 1500x1000 — and
 * neither scales itself, so dropping them into a narrower card would simply
 * crop the game. Rendering the iframe at its true size and applying a CSS
 * scale keeps the whole playfield visible, and the game still believes it has
 * its full canvas, so input and layout behave normally.
 */
function ScaledEmbed({
  src,
  title,
  width,
  height,
  inset = 0,
  contentFraction = 1
}: {
  src: string;
  title: string;
  width: number;
  height: number;
  inset?: number;
  contentFraction?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  // Click to start. These games begin their menu music as soon as they load, so
  // auto-mounting the frame meant audio started on its own and kept going while
  // you read the rest of the page. Stopping unmounts the frame, which is what
  // actually silences it — there is no way to mute across origins.
  const [running, setRunning] = useState(false);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;

    // Measure immediately as well as observing. ResizeObserver only delivers
    // as part of the rendering lifecycle, so relying on it alone leaves the
    // embed at scale 1 — full size — until something else forces a frame. The
    // synchronous read settles it at mount.
    //
    // clientWidth, not getBoundingClientRect: the card sits inside the deck's
    // 3D-transformed stack, so the bounding rect reports visually transformed
    // pixels — measurably smaller than the element's real layout width. Scaling
    // the frame by that shrunken figure left the game short of its box, which
    // is what showed up as a dead bar down one side. clientWidth is layout
    // pixels and ignores ancestor transforms.
    // Less the box's border: it is border-box, so its content area is 2px
    // narrower than its width. Scaling to the full width made the frame overhang
    // the right edge by those 2px while sitting flush left — one border looked
    // thicker than the other.
    const measure = () => setScale((el.clientWidth - BOX_BORDER * 2) / (width + inset * 2));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, inset, contentFraction]);

  return (
    <div ref={outer} className="w-full">
      {/* The box is narrowed to the game's own width and centred, rather than
          the game being stretched to fill the card. Whatever margin the page
          carries beside its canvas falls outside the box and is clipped. */}
      <div
        className="relative mx-auto max-w-full overflow-hidden rounded-2xl border border-border-soft bg-black"
        style={{
          // Full width when the frame fills it, so there is no fractional
          // centring for the browser to round unevenly between the two borders.
          width:
            contentFraction === 1
              ? '100%'
              : (width + inset * 2) * scale * contentFraction + BOX_BORDER * 2,
          height: (height + inset * 2) * scale + BOX_BORDER * 2
        }}
      >
        {running ? (
          <iframe
            ref={frame}
            src={src}
            title={title}
            // Sized to include the page's own margin on both sides, so its
            // content fits without the page scrolling.
            width={width + inset * 2}
            height={height + inset * 2}
            scrolling="no"
            // Keyboard focus is what makes it playable: the game only receives
            // key events once the frame itself is focused.
            allow="autoplay; fullscreen; gamepad; keyboard-map"
            className="absolute left-0 top-0 border-0"
            style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="absolute inset-0 grid place-items-center gap-2 text-center"
          >
            <span>
              <span className="block font-sans text-lg font-extrabold text-white">▶ Play {title}</span>
              <span className="mt-1 block font-mono text-xs text-white/70">
                loads the game, and it has sound
              </span>
            </span>
          </button>
        )}
      </div>

      {running && (
        <button
          type="button"
          onClick={() => setRunning(false)}
          className="mt-3 rounded-full border border-border-soft px-4 py-2 font-sans text-sm font-bold text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          ■ Stop game
        </button>
      )}
    </div>
  );
}

/**
 * `isActive` gates the demo block. Only the front card mounts its iframe or
 * video, so opening the page no longer starts a live embed and a 52MB clip for
 * every project at once — they load as each card is brought forward.
 */
function ProjectCard({ project, isActive }: { project: ProjectDetail; isActive: boolean }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="p-[clamp(32px,5vw,48px)]">
        <div className="mb-4 flex items-center gap-2.5">
          {project.status.dot && <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-live" />}
          <span className={`font-mono text-xs font-semibold tracking-[0.05em] ${project.status.accentClass}`}>
            {project.status.label}
          </span>
        </div>
        <h2 className="mb-3.5 font-sans text-[clamp(26px,3vw,34px)] font-extrabold text-ink">{project.title}</h2>
        <p className="mb-5 max-w-[680px] font-sans text-base leading-[1.65] text-ink-soft">{project.description}</p>
        <div className="mb-7 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3.5">
          {project.links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener"
              className={
                i === 0
                  ? 'rounded-full bg-accent px-[26px] py-[13px] font-sans text-sm font-bold text-white no-underline transition-colors hover:bg-accent-deep'
                  : 'rounded-full border-[1.5px] border-border-soft px-[26px] py-[13px] font-sans text-sm font-bold text-ink no-underline transition-colors hover:border-accent hover:text-accent'
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {isActive &&
        (project.demo.type === 'iframe' ? (
          <div className="border-t border-border bg-surface-alt p-[clamp(20px,3vw,28px)]">
            <div className="mb-3 font-mono text-xs text-ink-softer">{project.demo.note}</div>
            {project.demo.naturalWidth && project.demo.naturalHeight ? (
              <ScaledEmbed
                src={project.demo.src}
                title={`${project.title} playable demo`}
                width={project.demo.naturalWidth}
                height={project.demo.naturalHeight}
                inset={project.demo.embedInset}
                contentFraction={project.demo.embedContentFraction}
              />
            ) : (
              // Dark backing, not white: the embedded app is dark, and white
              // showed as a pale strip along the top edge before the app's own
              // background painted over it.
              <div className="overflow-hidden rounded-2xl border border-border-soft bg-black">
                <iframe
                  src={project.demo.src}
                  // Taller than the old fixed 560px, and tied to the viewport
                  // so a big screen gets a proportionally bigger demo.
                  className="block h-[clamp(560px,78vh,900px)] w-full border-0"
                  loading="lazy"
                  title={`${project.title} live app`}
                />
              </div>
            )}
            <div className="mt-2.5 font-sans text-[13px] text-ink-softer">
              If the embed doesn't load,{' '}
              <a href={project.demo.fallbackHref} target="_blank" rel="noopener" className="text-accent">
                open it directly ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="border-t border-border p-[clamp(20px,3vw,28px)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.demo.video && (
                <video
                  controls
                  preload="metadata"
                  poster={project.demo.video.poster}
                  className="block h-[200px] w-full rounded-2xl border border-border-soft bg-black object-cover"
                >
                  <source src={project.demo.video.src} type="video/mp4" />
                  Your browser can&apos;t play this clip.{' '}
                  <a href={project.demo.video.src} className="text-accent">
                    Download it instead ↓
                  </a>
                </video>
              )}
              {project.demo.images.map((image) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="block h-[200px] w-full rounded-2xl border border-border-soft object-cover"
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

/** Index of the project named by ?project=<slug>, or 0 when absent or unknown. */
function indexForSlug(slug: string | null) {
  const i = PROJECTS.findIndex((project) => project.slug === slug);
  return i === -1 ? 0 : i;
}

export default function Projects() {
  // The featured cards on the home page link to one specific project, so the
  // deck has to open on that card rather than always on the first one.
  const [searchParams] = useSearchParams();
  const requestedSlug = searchParams.get('project');
  // Seeded from the URL, so the right card is already front on the first paint
  // instead of flicking over from card one.
  const [active, setActive] = useState(() => indexForSlug(requestedSlug));

  // Adjusted during render rather than in an effect: the slug only changes when
  // you arrive from a different link, and reacting to it here avoids painting
  // the old card first. Comparing against the last slug we acted on is what
  // keeps this from fighting you as you flip through the deck by hand.
  const [appliedSlug, setAppliedSlug] = useState(requestedSlug);
  if (requestedSlug !== appliedSlug) {
    setAppliedSlug(requestedSlug);
    if (requestedSlug) setActive(indexForSlug(requestedSlug));
  }

  return (
    <div>
      <section className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-10 pt-[clamp(70px,10vh,110px)]">
        {/* Kept inside an h1 so the page still has a heading in its outline —
            FoldText renders spans. */}
        <h1 className="mb-4">
          <FoldText
            text="Projects"
            splitBy="char"
            hinge="top"
            trigger="mount"
            color="#f2f4fb"
            fontSize="clamp(36px, 5vw, 56px)"
            fontWeight={800}
            className="font-sans"
          />
        </h1>
        <p className="max-w-[560px] font-sans text-[17px] leading-[1.55] text-white">Cool things I've made</p>
      </section>

      <section className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-[120px]">
        <CardDeck
          labels={PROJECTS.map((project) => project.title)}
          activeIndex={active}
          onChange={setActive}
          renderCard={(index, isActive) => <ProjectCard project={PROJECTS[index]} isActive={isActive} />}
        />
      </section>
    </div>
  );
}
