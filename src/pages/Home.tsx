import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import RoleCycler from '../components/RoleCycler';
import GradientHeading from '../components/GradientHeading';
import Lanyard from '../components/Lanyard/Lanyard';
import cardFront from '../components/Lanyard/card-front.jpg';
import cardBack from '../components/Lanyard/card-back.png';
import strapTy from '../components/Lanyard/strap-ty.png';
import TagPill from '../components/TagPill';
import { HERO, FEATURED_PROJECTS, ABOUT_BANNER } from '../lib/content';

export default function Home() {
  return (
    <div className="relative">
      {/* Draggable lanyard. Sits above page content (z-30) so the card covers
          text as it swings, but below the sticky nav (z-50).

          The canvas spans the full page width and 900px down so the card is
          never clipped by its own container — the rope is the only thing that
          limits how far it swings. Lanyard disables pointer events on the
          canvas except when the pointer is over the card, so everything
          underneath stays clickable.

          anchorRightPx hangs the rig 333px from the right edge: the midpoint
          of the Home (372px) and Projects (293px) nav links, measured on the
          rendered page. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden h-[900px] lg:block">
        <div className="pointer-events-none h-full w-full">
          {/* cardHeightPx pins the card's rendered height, so resizing the
              canvas no longer changes how big it looks — the camera distance is
              solved for instead. */}
          {/* ropeSegmentLength keeps the card clear of the "View all" link.
              The card's bottom rests at world y = 1.425 - 3 * length, and at
              255px per 2.25 units the canvas shows 113.3px per unit from a top
              edge of y=3.971. At 0.77 the card bottom lands ~550px down the
              canvas, about 24px above the link at 574px. */}
          <Lanyard
            gravity={[0, -40, 0]}
            cardHeightPx={255}
            anchorRightPx={333}
            ropeSegmentLength={0.77}
            lanyardImage={strapTy}
            strapTileLength={0.8}
            frontImage={cardFront}
            backImage={cardBack}
          />
        </div>
      </div>

      <section className="relative mx-auto grid max-w-[1140px] gap-10 overflow-hidden px-[clamp(24px,6vw,80px)] pb-[clamp(70px,10vh,130px)] pt-[clamp(90px,15vh,170px)] lg:grid-cols-[1fr_360px]">
        <div
          aria-hidden
          className="animate-float-blob pointer-events-none absolute -right-10 -top-16 z-0 h-[340px] w-[340px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, oklch(85% 0.08 260 / .5), transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <RoleCycler />
          <GradientHeading className="mt-5 text-[clamp(42px,7.5vw,88px)]">{HERO.name}</GradientHeading>
          <p className="mb-10 max-w-[600px] font-sans text-[clamp(18px,2.1vw,23px)] leading-[1.55] text-ink-soft">
            {HERO.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={HERO.primaryCta.href}
              className="rounded-full bg-accent px-[30px] py-[15px] font-sans text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
            >
              {HERO.primaryCta.label}
            </Link>
            <Link
              to={HERO.secondaryCta.href}
              className="rounded-full border-[1.5px] border-border-soft px-[30px] py-[15px] font-sans text-sm font-bold text-ink no-underline transition-colors hover:border-accent hover:text-accent"
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <ScrollReveal className="mx-auto max-w-[1140px] px-[clamp(24px,6vw,80px)] pb-[130px]">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-sans text-[clamp(26px,3vw,34px)] font-extrabold text-ink">Featured projects</h2>
          <Link to="/projects" className="font-sans text-sm font-bold text-accent no-underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          {FEATURED_PROJECTS.map((project) => (
            <TiltCard
              key={project.slug}
              href={project.href}
              className="rounded-[20px] border border-border bg-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className={`mb-3.5 font-mono text-xs font-semibold tracking-[0.05em] ${project.status.accentClass}`}>
                {project.status.label}
              </div>
              <h3 className="mb-2.5 font-sans text-[23px] font-extrabold text-ink">{project.title}</h3>
              <p className="mb-[18px] font-sans text-[15px] leading-[1.55] text-ink-soft">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-[1140px] px-[clamp(24px,6vw,80px)] pb-[140px]">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-ink p-10 sm:p-14">
          <div>
            <h2 className="mb-3 font-sans text-[clamp(24px,2.6vw,30px)] font-extrabold text-white">
              {ABOUT_BANNER.heading}
            </h2>
            <p className="max-w-[480px] font-sans text-base text-white/80">{ABOUT_BANNER.body}</p>
          </div>
          <Link
            to={ABOUT_BANNER.cta.href}
            className="whitespace-nowrap rounded-full bg-white px-[30px] py-[15px] font-sans text-sm font-bold text-ink no-underline transition-colors hover:bg-accent hover:text-white"
          >
            {ABOUT_BANNER.cta.label}
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
