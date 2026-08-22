import ScrollReveal from '../components/ScrollReveal';
import FoldText from '../components/FoldText/FoldText';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';
import { ABOUT, SKILL_GROUPS } from '../lib/content';
import headshot from '../images/about-headshot.jpg';

export default function About() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1100px] gap-10 px-[clamp(24px,6vw,80px)] pb-[90px] pt-[clamp(70px,10vh,110px)] sm:grid-cols-[minmax(180px,240px)_1fr]">
        <img
          src={headshot}
          alt="Tony Yu"
          width={840}
          height={1120}
          className="aspect-[3/4] w-full self-start rounded-[20px] object-cover"
        />
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
