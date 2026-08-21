import { useState } from 'react';
import FoldText from '../components/FoldText/FoldText';
import TagPill from '../components/TagPill';
import CardDeck from '../components/CardDeck/CardDeck';
import { PROJECTS, type ProjectDetail } from '../lib/content';

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
            <div className="overflow-hidden rounded-2xl border border-border-soft bg-white">
              <iframe
                src={project.demo.src}
                className="block h-[560px] w-full border-0"
                loading="lazy"
                title={`${project.title} live app`}
              />
            </div>
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

export default function Projects() {
  const [active, setActive] = useState(0);

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
