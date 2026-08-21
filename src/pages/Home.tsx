import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import RoleCycler from '../components/RoleCycler';
import GradientHeading from '../components/GradientHeading';
import HeroIdentityCard from '../components/HeroIdentityCard';
import { HERO, FEATURED_PROJECTS, ABOUT_BANNER } from '../lib/content';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid max-w-[1140px] gap-10 px-[clamp(24px,6vw,80px)] pb-[clamp(70px,10vh,130px)] pt-[clamp(90px,15vh,170px)] lg:grid-cols-[1fr_220px]">
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
        <div className="relative z-10">
          <HeroIdentityCard />
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
                  <span key={tag} className="rounded-full bg-pill px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                    {tag}
                  </span>
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
