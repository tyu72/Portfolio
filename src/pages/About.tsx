import ScrollReveal from '../components/ScrollReveal';
import FoldText from '../components/FoldText/FoldText';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';
import DepthCarousel from '../components/DepthCarousel/DepthCarousel';
import { ABOUT, SKILL_GROUPS } from '../lib/content';
import { PIXEL_PURPLE } from '../lib/theme';
import santaCruz from '../images/about-carousel/santa-cruz.jpg';
import summitLookout from '../images/about-carousel/summit-lookout.jpg';
import trailheadFriends from '../images/about-carousel/trailhead-friends.jpg';
import summitRock from '../images/about-carousel/summit-rock.jpg';
import cardOpening from '../images/about-carousel/card-opening.jpg';
import graduation from '../images/about-carousel/graduation.jpg';
import christmasTree from '../images/about-carousel/christmas-tree.jpg';
import benchPress from '../images/about-carousel/bench-press.webp';
import fishing from '../images/about-carousel/fishing.webp';
import nightOut from '../images/about-carousel/night-out.webp';

/**
 * Built from src/images/about-carousel/, which scripts/build-about-carousel.mjs
 * generates. Each is pre-cropped to the card's 3:4, so the carousel's own
 * object-cover has nothing left to trim.
 */
const PHOTOS = [
  { image: santaCruz, alt: 'Tony at the UC Santa Cruz entrance sign' },
  { image: summitLookout, alt: 'Sitting on a rocky summit above a wide valley' },
  { image: trailheadFriends, alt: 'Three friends giving thumbs up at a trailhead map' },
  { image: summitRock, alt: 'Resting on a boulder at the top of a mountain trail' },
  { image: cardOpening, alt: 'Opening trading card packs with a friend' },
  { image: graduation, alt: 'In a graduation stole, sitting on the hood of a silver Corvette' },
  { image: christmasTree, alt: 'Sitting with a friend on a giant gift box beneath a lit Christmas tree' },
  { image: benchPress, alt: 'Mid-set on the bench press at the gym, with a spotter standing by' },
  { image: fishing, alt: 'Holding up a crappie caught at the lake' },
  { image: nightOut, alt: 'Walking outside at night in a hoodie' }
];

/**
 * Sized so the card lands at 280x373, a step up from the 240x320 the portrait
 * used to render at.
 *
 * DepthCarousel shrinks itself to fit its container, scaling every card by
 * `clamp(containerWidth / (cardWidth + 2 * spread + 120), 0.4, 1)`. In a column
 * this narrow that always bottoms out at the 0.4 floor, so asking for 700x933
 * puts 280x373 on screen -- and it stays there for any column up to 468px,
 * which covers the whole minmax(180px, 240px) range the grid allows. Asking
 * for 240 directly would have rendered at 115.
 *
 * Below the grid's breakpoint the column becomes the full page width and the
 * card scales up with it, which is what the fluid portrait did before.
 */
const CARD_WIDTH = 700;
const CARD_HEIGHT = 933;

export default function About() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1100px] gap-10 px-[clamp(24px,6vw,80px)] pb-[90px] pt-[clamp(70px,10vh,110px)] sm:grid-cols-[minmax(180px,240px)_1fr]">
        {/* Centred rather than top-aligned, so the deck sits lower and lines
            up against the heading and bio together instead of the heading
            alone. min-h keeps the row from collapsing as cards animate.

            Shifted left by roughly what the stack reaches to the right, so
            the deepest card stops short of the gutter instead of running under
            the bio. The space it moves into is page margin. A transform rather
            than a margin: this is a stretched grid item, so a negative margin
            widens it and drags the centre along with it. */}
        <div className="flex min-h-[420px] -translate-x-[100px] translate-y-[20px] items-center justify-center self-center">
          <DepthCarousel
            items={PHOTOS}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
            // The rest of these come from the reactbits playground, converted
            // for this card. Its preview draws a 300px card at scale 1; this
            // one draws 240px at the 0.4 scale explained above, so every
            // distance is worth playground x 0.8 / 0.4, i.e. doubled. Ratios
            // are preserved, so it reads the same, just smaller.
            radius={80} /* 40 */
            // The same purple the background pixels are painted in, so the
            // shading over the cards behind belongs to the page rather than
            // being a second, unrelated purple.
            tint={PIXEL_PURPLE}
            depth={260} /* 130 */
            // 70px of visible offset. Well past the playground's 45, on
            // purpose: the cards behind are pushed back in Z as well as
            // sideways, and that shrinking eats most of the offset. At 45 the
            // first card behind showed only 28px; this puts it at 51px.
            spread={175}
            tilt={0}
            tiltDirection="right"
            // Not scaled: perspective belongs to the container, not the cards,
            // so it only takes the 0.8 size difference.
            // Lower than the playground's 1150, which deepens the
            // foreshortening on the cards behind.
            perspective={800}
            // Three. The stack reaches further as the cards grow, and that
            // reach is what has to stay clear of the bio, so cards four and
            // five were the price of a bigger card sitting further right.
            // Both sat at the 0.15 brightness floor under an all but opaque
            // tint, so what they cost in room they were not repaying.
            visibleCards={3}
            falloff={0.26}
            blur={8} /* 4 */
            duration={200}
            // Dots only. Arrows were never wanted here, and in a column this
            // narrow they would sit on top of the card anyway.
            showControls={false}
            showIndicators
          />
        </div>
        <div>
          {/* Kept inside an h1 so the page still has a heading in the document
              outline — FoldText renders spans. */}
          <h1 className="mb-5">
            <FoldText
              text="About me"
              splitBy="char"
              hinge="top"
              trigger="mount"
              color="#f2f4fb"
              fontSize="clamp(38px, 5vw, 58px)"
              fontWeight={800}
              className="font-sans"
            />
          </h1>
          {/* On a card so the animated background reads behind the bio rather
              than through it. Translucent plus a blur, matching the hero. */}
          <SpotlightCard
            className="max-w-[640px] rounded-3xl border border-border bg-surface/85 p-[clamp(20px,3vw,32px)] backdrop-blur-md"
            spotlightColor="rgba(111, 116, 232, 0.45)"
          >
            {ABOUT.bio.map((paragraph, i) => (
              <p
                key={i}
                className={`font-sans text-[17px] leading-[1.7] text-white ${i === 0 ? 'mb-4' : ''}`}
              >
                {paragraph}
              </p>
            ))}
          </SpotlightCard>
        </div>
      </section>

      <ScrollReveal className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-[90px]">
        <h2 className="mb-6 font-sans text-[clamp(24px,2.6vw,30px)] font-extrabold text-ink">Skills &amp; tools</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <SpotlightCard
              key={group.label}
              className="h-full rounded-2xl border border-border bg-surface p-7"
              spotlightColor="rgba(111, 116, 232, 0.45)"
            >
              <div className={`mb-4 font-mono text-xs font-semibold tracking-[0.05em] ${group.accentClass}`}>
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-block rounded-full bg-pill px-3.5 py-1.5 font-sans text-[13px] font-semibold text-ink-soft transition-transform hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>

      <section className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-[130px]">
        <SpotlightCard
          className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-panel p-[clamp(32px,5vw,48px)]"
          spotlightColor="rgba(111, 116, 232, 0.45)"
        >
          <div>
            <h2 className="mb-2 font-sans text-xl font-extrabold text-panel-ink">{ABOUT.resume.heading}</h2>
            <p className="font-sans text-sm text-panel-ink/80">{ABOUT.resume.body}</p>
          </div>
          <a
            href={ABOUT.resume.cta.href}
            // The label says download, so save it rather than opening a viewer,
            // and name the saved file properly.
            download="Tony-Yu-Resume.pdf"
            className="whitespace-nowrap rounded-full bg-panel-ink px-[26px] py-[13px] font-sans text-sm font-bold text-panel no-underline transition-colors hover:bg-accent hover:text-white"
          >
            {ABOUT.resume.cta.label}
          </a>
        </SpotlightCard>
      </section>
    </div>
  );
}
