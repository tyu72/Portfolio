import ScrollReveal from '../components/ScrollReveal';
import ImageSlot from '../components/ImageSlot';
import { ABOUT, SKILL_GROUPS } from '../lib/content';

export default function About() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1100px] gap-10 px-[clamp(24px,6vw,80px)] pb-[90px] pt-[clamp(70px,10vh,110px)] sm:grid-cols-[minmax(180px,240px)_1fr]">
        <ImageSlot id={ABOUT.headshotId} placeholder={ABOUT.headshotPlaceholder} className="h-[240px] w-full" />
        <div>
          <h1 className="mb-5 font-sans text-[clamp(34px,4.5vw,50px)] font-extrabold tracking-[-0.02em] text-ink">
            About me
          </h1>
          {ABOUT.bio.map((paragraph, i) => (
            <p
              key={i}
              className={`max-w-[640px] font-sans text-[17px] leading-[1.7] text-ink-soft ${i === 0 ? 'mb-4' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <ScrollReveal className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-[90px]">
        <h2 className="mb-6 font-sans text-[clamp(24px,2.6vw,30px)] font-extrabold text-ink">Skills &amp; tools</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label} className="rounded-2xl border border-border bg-surface p-7">
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
            </div>
          ))}
        </div>
      </ScrollReveal>

      <section className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-[130px]">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-[clamp(32px,5vw,48px)]">
          <div>
            <h2 className="mb-2 font-sans text-xl font-extrabold text-white">{ABOUT.resume.heading}</h2>
            <p className="font-sans text-sm text-white/80">{ABOUT.resume.body}</p>
          </div>
          <a
            href={ABOUT.resume.cta.href}
            className="whitespace-nowrap rounded-full bg-white px-[26px] py-[13px] font-sans text-sm font-bold text-ink no-underline transition-colors hover:bg-accent hover:text-white"
          >
            {ABOUT.resume.cta.label}
          </a>
        </div>
      </section>
    </div>
  );
}
