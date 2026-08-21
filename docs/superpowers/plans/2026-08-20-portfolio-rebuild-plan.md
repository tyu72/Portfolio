# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `.dc.html` design handoff at `C:\Users\yuton\Downloads\design_handoff_portfolio\` as a real, deployable Vite + React + TypeScript portfolio site.

**Architecture:** A four-route React app (Home, Projects, About, Contact) sharing a Nav/Footer shell, styled with Tailwind utility classes that reproduce the mockup's oklch palette and fluid `clamp()` spacing exactly. All copy and structured data live in one typed module (`lib/content.ts`). Five interaction points that were hand-rolled or sketched in the mockup (hero identity card, rotating role text, gradient heading, tilt cards, scroll-reveal) ship now as small, isolated fallback components so Tony can swap any of them for a reactbits.dev pick later without touching page code.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, React Router, Framer Motion, Formspree (contact form), Vercel (deploy target — not part of this plan).

**Spec:** [docs/superpowers/specs/2026-08-20-portfolio-rebuild-design.md](../specs/2026-08-20-portfolio-rebuild-design.md)

## Global Constraints

- Stack is exactly Vite + React + TypeScript + Tailwind CSS + React Router + Framer Motion.
- Fonts: `Manrope` (weights 400–800) and `JetBrains Mono` (weights 400–700), loaded from Google Fonts.
- Palette (verbatim from spec, defined once in `tailwind.config.js`): background `oklch(98% 0.006 260)`, surface `oklch(99% 0.004 260)`, near-black ink `oklch(18% 0.015 260)`, accent `#5B8CFF`, live-status `#22C55E`, game-status `oklch(50% 0.15 40)`.
- No redesign of spacing, type scale, or color. The `.dc.html` files are reference-only — read them, never edit or run them.
- Five reactbits.dev slots exist for Tony to fill in later: hero identity card, rotating role text, gradient heading, tilt/spotlight cards, scroll-reveal. Every slot ships in this plan with a working, dependency-free fallback (no Three.js, no reactbits import) — implementation is never blocked on his picks.
- No automated test suite (spec is explicit: YAGNI for a static content site). Every task's automated gate is `npm run build` (the scaffolded script runs `tsc -b && vite build`, so it also acts as the type-check). Manual verification happens via the dev server, described per task, and comprehensively in the final task.
- Contact form posts to Formspree via a `VITE_FORMSPREE_ID` env var that Tony supplies later. Until it's set, the form must show a clear inline error rather than fail silently or crash.
- Headshot, BubbleMage screenshots, and the resume link are placeholders for Tony to swap in later — never a broken `<img>`.

---

## File Structure

```
tailwind.config.js, postcss.config.js     -- Tailwind setup (Task 2)
.env.example                               -- Formspree env var template (Task 14)
index.html                                 -- page title (Task 10)
src/
  main.tsx                                 -- router + app mount (Task 10)
  App.tsx                                  -- route table + shared Nav/Footer layout (Task 10)
  index.css                                -- Tailwind directives, font import, keyframes (Task 2)
  lib/
    content.ts                             -- typed copy/data, single source of truth (Task 3)
  components/
    ImageSlot.tsx                          -- placeholder box for unshipped images (Task 4)
    ScrollReveal.tsx                       -- slot 5 fallback: intersection fade-in (Task 5)
    TiltCard.tsx                           -- slot 4 fallback: CSS mousemove tilt (Task 6)
    RoleCycler.tsx                         -- slot 2 fallback: cross-fading role text (Task 7)
    GradientHeading.tsx                    -- slot 3 fallback: animated gradient text (Task 7)
    HeroIdentityCard.tsx                   -- slot 1 fallback: static ID card (Task 7)
    Nav.tsx                                -- sticky site nav (Task 8)
    Footer.tsx                             -- site footer (Task 9)
  pages/
    Home.tsx                               -- Task 11
    Projects.tsx                           -- Task 12
    About.tsx                              -- Task 13
    Contact.tsx                            -- Task 14
```

(`package.json`, `tsconfig*.json`, `vite.config.ts`, `public/` are scaffolded by `create-vite` in Task 1, not hand-written.)

---

### Task 1: Scaffold the Vite + React + TypeScript project

**Files:**
- Create: everything under repo root produced by `create-vite`'s `react-ts` template (`package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/`, `public/`, `.gitignore`)

**Interfaces:**
- Produces: an `npm run build` script (`tsc -b && vite build`) and `npm run dev` script that every later task relies on as its verification command.

The repo root already has `.git` and `docs/` in it, so `create-vite` must scaffold into a throwaway subfolder first, then its contents get merged up — this avoids the "directory not empty" prompt and avoids clobbering `docs/`.

- [ ] **Step 1: Scaffold into a temp folder**

```bash
cd "C:\Users\yuton\Portfolio"
npm create vite@latest .tmp-scaffold -- --template react-ts
```

- [ ] **Step 2: Merge the scaffold into the repo root and remove the temp folder**

```bash
cp -r .tmp-scaffold/. .
rm -rf .tmp-scaffold
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

- [ ] **Step 4: Verify the scaffold builds**

Run: `npm run build`
Expected: exits 0, produces a `dist/` folder, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React + TypeScript project"
```

---

### Task 2: Tailwind setup and design tokens

**Files:**
- Modify: `package.json` (add devDependencies)
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`

**Interfaces:**
- Produces: Tailwind color tokens (`bg`, `surface`, `surface-alt`, `ink`, `ink-soft`, `ink-softer`, `border`, `border-soft`, `pill`, `accent`, `accent-deep`, `live`, `game`), font families (`font-sans` → Manrope, `font-mono` → JetBrains Mono), and utility classes `animate-gradient-shift`, `animate-float-blob`, `animate-pulse-dot` that later tasks use directly.

- [ ] **Step 1: Install Tailwind and peer deps, plus router/animation libs**

```bash
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom framer-motion
npx tailwindcss init -p
```

- [ ] **Step 2: Write `tailwind.config.js`**

```js
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(98% 0.006 260)',
        surface: 'oklch(99% 0.004 260)',
        'surface-alt': 'oklch(96% 0.006 260)',
        ink: 'oklch(18% 0.015 260)',
        'ink-soft': 'oklch(40% 0.02 260)',
        'ink-softer': 'oklch(50% 0.015 260)',
        border: 'oklch(91% 0.01 260)',
        'border-soft': 'oklch(85% 0.01 260)',
        pill: 'oklch(94% 0.01 260)',
        accent: '#5B8CFF',
        'accent-deep': 'oklch(55% 0.18 260)',
        live: '#22C55E',
        game: 'oklch(50% 0.15 40)',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Write `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    margin: 0;
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes floatBlob {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-16px, -24px) rotate(8deg);
  }
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@layer utilities {
  .animate-gradient-shift {
    animation: gradientShift 8s ease infinite;
  }
  .animate-float-blob {
    animation: floatBlob 9s ease-in-out infinite;
  }
  .animate-pulse-dot {
    animation: pulseDot 1.8s ease infinite;
  }
}
```

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tailwind.config.js postcss.config.js src/index.css
git commit -m "Add Tailwind design tokens and global styles"
```

---

### Task 3: Content data module

**Files:**
- Create: `src/lib/content.ts`

**Interfaces:**
- Produces (all consumed by pages/components in later tasks): `NavLink`, `NAV_LINKS`, `CONTACT_CTA`, `BRAND`, `SocialLink`, `SOCIAL_LINKS`, `FOOTER`, `HERO_ROLES`, `HERO`, `Tag`, `StatusBadge`, `FeaturedProject`, `FEATURED_PROJECTS`, `ABOUT_BANNER`, `ProjectDemo`, `ProjectDetail`, `PROJECTS`, `ABOUT`, `SkillGroup`, `SKILL_GROUPS`, `CONTACT`.

- [ ] **Step 1: Write `src/lib/content.ts`**

```ts
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export const CONTACT_CTA: NavLink = { label: 'Contact', href: '/contact' };

export const BRAND = { name: 'yourname', tld: '.dev' };

export type SocialLink = { label: string; href: string; external: boolean };

export const SOCIAL_LINKS: SocialLink[] = [
  { label: '✉ your@email.com', href: 'mailto:your@email.com', external: false },
  { label: 'GitHub ↗', href: 'https://github.com/tyu72', external: true },
  { label: 'LinkedIn ↗', href: '#', external: true },
];

export const FOOTER = {
  copyright: '© 2026 Your Name — built with way too much coffee.',
  links: [
    { label: 'GitHub', href: 'https://github.com/tyu72' },
    { label: 'Email', href: 'mailto:your@email.com' },
  ],
};

export const HERO_ROLES = ['PRODUCT MANAGER', 'GAME DESIGNER', 'BUILDER', 'PROBLEM SOLVER'];

export const HERO = {
  name: 'Tony Yu',
  tagline:
    'CS + game design student who likes building things end to end — now figuring out how to turn "I made this" into "people actually want this."',
  primaryCta: { label: 'See my work →', href: '/projects' },
  secondaryCta: { label: 'Get in touch', href: '/contact' },
};

export type Tag = string;

export type StatusBadge = { label: string; accentClass: string; dot?: boolean };

export type FeaturedProject = {
  slug: string;
  status: StatusBadge;
  title: string;
  description: string;
  tags: Tag[];
  href: string;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'strengthai',
    status: { label: 'WEB APP · LIVE', accentClass: 'text-accent' },
    title: 'StrengthAI',
    description:
      'A strength-training log that reads your own data and tells you when a lift has stalled — and why.',
    tags: ['React', 'Supabase', 'Claude API'],
    href: '/projects',
  },
  {
    slug: 'bubblemage',
    status: { label: 'GAME · STEAM', accentClass: 'text-game' },
    title: 'BubbleMage',
    description: 'A slime alchemy game built in Unity with a five-person team, headed to Steam.',
    tags: ['Unity', 'C#', 'Team project'],
    href: '/projects',
  },
];

export const ABOUT_BANNER = {
  heading: 'Want the longer story?',
  body: 'Background, skills, and a resume — all on one page.',
  cta: { label: 'About me →', href: '/about' },
};

export type ProjectDemo =
  | { type: 'iframe'; src: string; fallbackHref: string; note: string }
  | { type: 'images'; slots: { id: string; placeholder: string }[]; note: string };

export type ProjectDetail = {
  slug: string;
  status: StatusBadge;
  title: string;
  description: string;
  tags: Tag[];
  links: { label: string; href: string }[];
  demo: ProjectDemo;
};

export const PROJECTS: ProjectDetail[] = [
  {
    slug: 'strengthai',
    status: { label: 'LIVE · WEB APP', accentClass: 'text-live', dot: true },
    title: 'StrengthAI',
    description:
      "A strength-training log that reads your own data and tells you when a lift has stalled, and why. No exercise database, no dropdowns — you describe a lift in your own words and it becomes a trend line. It watches reps-in-reserve at matched weight and reps to flag real plateaus instead of noise, and a coach chat answers questions using only numbers you've actually logged, never fabricated ones.",
    tags: ['React', 'Vite', 'Supabase', 'Claude API', 'PWA'],
    links: [
      { label: 'Try it live ↗', href: 'https://strength-ai.vercel.app' },
      { label: 'View code ↗', href: 'https://github.com/tyu72/StrengthAI' },
    ],
    demo: {
      type: 'iframe',
      src: 'https://strength-ai.vercel.app',
      fallbackHref: 'https://strength-ai.vercel.app',
      note: 'LIVE DEMO — free to sign up and try',
    },
  },
  {
    slug: 'bubblemage',
    status: { label: 'GAME · STEAM', accentClass: 'text-game' },
    title: 'BubbleMage',
    description:
      'A slime alchemy game built in Unity with a five-person team, on its way to Steam. My focus was gameplay systems and C# tooling, working alongside teammates on art, audio, and level design.',
    tags: ['Unity', 'C#', 'Game design', 'Team project'],
    links: [{ label: 'View on Steam ↗', href: 'https://store.steampowered.com/app/4703500/Bubble_Mage/' }],
    demo: {
      type: 'images',
      slots: [
        { id: 'bubblemage-shot-1', placeholder: 'BubbleMage screenshot' },
        { id: 'bubblemage-shot-2', placeholder: 'BubbleMage screenshot' },
      ],
      note: 'Downloadable Steam title — no browser build, so no embedded demo here.',
    },
  },
];

export const ABOUT = {
  headshotId: 'about-headshot',
  headshotPlaceholder: 'Your photo',
  bio: [
    "I'm a computer science and game design major who likes taking things from a blank file to something people can actually use. That's meant building web apps, writing gameplay systems in Unity, and lately spending more time thinking about why people click what they click than how the code works underneath.",
    "Right now I'm aiming toward product management — I like being close enough to the code to know what's actually hard to build, and close enough to the user to know what's actually worth building.",
  ],
  resume: { heading: 'Resume', body: 'The full rundown, one PDF.', cta: { label: 'Download resume ↓', href: '#' } },
};

export type SkillGroup = { label: string; accentClass: string; items: string[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'BUILD',
    accentClass: 'text-accent',
    items: ['React', 'JavaScript', 'Python', 'Supabase', 'Unity', 'C#'],
  },
  {
    label: 'SHAPE',
    accentClass: 'text-game',
    items: ['Product thinking', 'User research', 'Prototyping', 'Game design', 'Team collaboration'],
  },
];

export const CONTACT = {
  heading: "Let's talk",
  body: 'Got a project, a role, or just want to talk shop? Drop a note below or reach me directly.',
  successHeading: 'Message sent — nice.',
  successBody: "I'll get back to you soon.",
  errorBody: 'Something went wrong sending that — try again, or email me directly.',
};
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0. (This file has no consumers yet, so `tsc` only checks it's syntactically and structurally valid TypeScript.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "Add typed content data module"
```

---

### Task 4: ImageSlot component

**Files:**
- Create: `src/components/ImageSlot.tsx`

**Interfaces:**
- Produces: `ImageSlot` component with props `{ id: string; placeholder: string; className?: string }`, used by Projects (Task 12) and About (Task 13) pages in place of real `<img>` tags.

- [ ] **Step 1: Write `src/components/ImageSlot.tsx`**

```tsx
type ImageSlotProps = {
  id: string;
  placeholder: string;
  className?: string;
};

export default function ImageSlot({ id, placeholder, className = '' }: ImageSlotProps) {
  return (
    <div
      data-slot-id={id}
      className={`flex items-center justify-center rounded-2xl border border-dashed border-border-soft bg-surface-alt font-mono text-xs text-ink-softer ${className}`}
    >
      {placeholder}
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ImageSlot.tsx
git commit -m "Add ImageSlot placeholder component"
```

---

### Task 5: ScrollReveal component (slot 5 fallback)

**Files:**
- Create: `src/components/ScrollReveal.tsx`

**Interfaces:**
- Produces: `ScrollReveal` component with props `{ children: React.ReactNode; className?: string; threshold?: number }`. Wraps a section; fades and translates it in once it scrolls into view. Used by Home, Projects, About pages (Tasks 11–13). This is the fallback for reactbits slot 5 — later swappable for a picked component without changing callers, since callers only depend on this prop shape.

- [ ] **Step 1: Write `src/components/ScrollReveal.tsx`**

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
};

export default function ScrollReveal({ children, className = '', threshold = 0.15 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollReveal.tsx
git commit -m "Add ScrollReveal fallback component"
```

---

### Task 6: TiltCard component (slot 4 fallback)

**Files:**
- Create: `src/components/TiltCard.tsx`

**Interfaces:**
- Produces: `TiltCard` component with props `{ children: React.ReactNode; className?: string; href?: string }`. Renders a `div` (or an `<a>` wrapping a `div` when `href` is given) that tilts toward the cursor on `mousemove` and resets on `mouseleave`. Used by Home (Task 11) for featured-project cards. Fallback for reactbits slot 4.

- [ ] **Step 1: Write `src/components/TiltCard.tsx`**

```tsx
import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
};

const RESET_TRANSFORM = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';

export default function TiltCard({ children, className = '', href }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(RESET_TRANSFORM);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale(1.02)`
    );
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform(RESET_TRANSFORM)}
      style={{ transform, transition: 'transform 150ms ease-out' }}
      className={className}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block h-full w-full no-underline">
        {content}
      </a>
    );
  }
  return content;
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/TiltCard.tsx
git commit -m "Add TiltCard fallback component"
```

---

### Task 7: Hero slot components — RoleCycler, GradientHeading, HeroIdentityCard (slots 1–3 fallback)

**Files:**
- Create: `src/components/RoleCycler.tsx`, `src/components/GradientHeading.tsx`, `src/components/HeroIdentityCard.tsx`

**Interfaces:**
- Consumes: `HERO_ROLES` from `src/lib/content.ts` (Task 3).
- Produces: `RoleCycler` (no props — reads `HERO_ROLES` directly), `GradientHeading` with props `{ children: React.ReactNode; className?: string }`, `HeroIdentityCard` (no props). All three are used only by Home's hero section (Task 11) and are each an independent fallback for reactbits slots 2, 3, and 1 respectively.

- [ ] **Step 1: Write `src/components/RoleCycler.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { HERO_ROLES } from '../lib/content';

const INTERVAL_MS = 3200;
const FADE_MS = 300;

export default function RoleCycler() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % HERO_ROLES.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-[18px] font-mono text-sm font-semibold tracking-[0.06em] text-accent transition-opacity"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      {HERO_ROLES[index]}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/GradientHeading.tsx`**

```tsx
import type { ReactNode } from 'react';

type GradientHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function GradientHeading({ children, className = '' }: GradientHeadingProps) {
  return (
    <h1
      className={`animate-gradient-shift bg-[linear-gradient(90deg,oklch(18%_0.015_260),#5B8CFF,oklch(18%_0.015_260))] bg-[length:200%_auto] bg-clip-text font-sans font-extrabold leading-[1.02] tracking-[-0.03em] text-transparent ${className}`}
    >
      {children}
    </h1>
  );
}
```

- [ ] **Step 3: Write `src/components/HeroIdentityCard.tsx`**

```tsx
export default function HeroIdentityCard() {
  return (
    <div className="group relative mx-auto w-full max-w-[220px] select-none [perspective:900px]">
      <div className="mx-auto h-10 w-3 rounded-b-full bg-border-soft" />
      <div className="mt-2 rounded-2xl border border-border bg-surface p-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out [transform:rotateZ(-2deg)] group-hover:[transform:rotateZ(2deg)]">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-surface-alt" />
        <div className="font-sans text-base font-extrabold text-ink">TONY YU</div>
        <div className="mt-1 font-mono text-xs font-semibold text-accent">PM · CS</div>
        <div className="my-3 h-px w-full bg-border" />
        <div className="font-mono text-[11px] tracking-[0.05em] text-ink-softer">PORTFOLIO ID</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/RoleCycler.tsx src/components/GradientHeading.tsx src/components/HeroIdentityCard.tsx
git commit -m "Add hero slot fallback components"
```

---

### Task 8: Nav component

**Files:**
- Create: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `CONTACT_CTA`, `BRAND` from `src/lib/content.ts` (Task 3); `Link`, `NavLink` from `react-router-dom`.
- Produces: `Nav` component (no props), used in `App.tsx` (Task 10).

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```tsx
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { NAV_LINKS, CONTACT_CTA, BRAND } from '../lib/content';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-6 border-b border-border bg-bg/90 px-6 py-5 backdrop-blur-md sm:px-10 lg:px-16">
      <Link to="/" className="font-mono text-lg font-bold tracking-tight text-ink no-underline">
        {BRAND.name}
        <span className="text-accent">.</span>
        {BRAND.tld}
      </Link>
      <div className="flex items-center gap-5 sm:gap-8">
        {NAV_LINKS.map((link) => (
          <RouterNavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `font-sans text-sm font-semibold no-underline transition-colors ${
                isActive ? 'text-accent' : 'text-ink-soft hover:text-accent'
              }`
            }
          >
            {link.label}
          </RouterNavLink>
        ))}
        <Link
          to={CONTACT_CTA.href}
          className="rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-bold text-white no-underline transition-colors hover:bg-accent-deep"
        >
          {CONTACT_CTA.label}
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "Add Nav component"
```

---

### Task 9: Footer component

**Files:**
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `FOOTER` from `src/lib/content.ts` (Task 3).
- Produces: `Footer` component (no props), used in `App.tsx` (Task 10).

- [ ] **Step 1: Write `src/components/Footer.tsx`**

```tsx
import { FOOTER } from '../lib/content';

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-bg px-6 py-11 font-sans text-sm text-ink-softer sm:px-10 lg:px-16">
      <span>{FOOTER.copyright}</span>
      <div className="flex gap-6">
        {FOOTER.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener' : undefined}
            className="text-ink-softer no-underline transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "Add Footer component"
```

---

### Task 10: App shell, routing, and entry point

**Files:**
- Modify: `index.html`, `src/main.tsx`
- Create: `src/App.tsx`
- Delete: `src/App.css`, default scaffold assets no longer used (`src/assets/react.svg` if present) — leave `public/` alone

**Interfaces:**
- Consumes: `Nav` (Task 8), `Footer` (Task 9), plus placeholder page components created in this task's Step 2 (real page bodies land in Tasks 11–14).
- Produces: routes `/`, `/projects`, `/about`, `/contact` mounted inside a shared `<Nav />` / `<Footer />` shell, so Tasks 11–14 only need to fill in each page's body.

- [ ] **Step 1: Update `index.html` title**

Edit the `<title>` tag to:

```html
<title>Tony Yu — Portfolio</title>
```

- [ ] **Step 2: Create placeholder page files (overwritten in Tasks 11–14)**

```bash
mkdir -p src/pages
```

Write minimal placeholders so `App.tsx` compiles before the real pages exist:

`src/pages/Home.tsx`:
```tsx
export default function Home() {
  return <div className="px-6 py-20">Home</div>;
}
```

`src/pages/Projects.tsx`:
```tsx
export default function Projects() {
  return <div className="px-6 py-20">Projects</div>;
}
```

`src/pages/About.tsx`:
```tsx
export default function About() {
  return <div className="px-6 py-20">About</div>;
}
```

`src/pages/Contact.tsx`:
```tsx
export default function Contact() {
  return <div className="px-6 py-20">Contact</div>;
}
```

- [ ] **Step 3: Write `src/App.tsx`**

```tsx
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 5: Remove unused scaffold files**

```bash
rm -f src/App.css
rm -f src/assets/react.svg
```

- [ ] **Step 6: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 7: Manual check**

Run `npm run dev`, open the printed local URL, and confirm: Nav and Footer render on every route, and navigating between `/`, `/projects`, `/about`, `/contact` swaps only the page body. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add app shell, routing, and entry point"
```

---

### Task 11: Home page

**Files:**
- Modify: `src/pages/Home.tsx` (replace placeholder from Task 10)

**Interfaces:**
- Consumes: `ScrollReveal` (Task 5), `TiltCard` (Task 6), `RoleCycler`, `GradientHeading`, `HeroIdentityCard` (Task 7), `HERO`, `FEATURED_PROJECTS`, `ABOUT_BANNER` from `content.ts` (Task 3), `Link` from `react-router-dom`.

- [ ] **Step 1: Write `src/pages/Home.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open `/`. Confirm: the role text above the name cycles every ~3 seconds, the name has an animated gradient, the identity card sits to the right of the hero copy, the two featured project cards tilt toward the cursor on hover, and both lower sections fade up when scrolled into view. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "Build Home page"
```

---

### Task 12: Projects page

**Files:**
- Modify: `src/pages/Projects.tsx` (replace placeholder from Task 10)

**Interfaces:**
- Consumes: `ScrollReveal` (Task 5), `ImageSlot` (Task 4), `PROJECTS` from `content.ts` (Task 3).

- [ ] **Step 1: Write `src/pages/Projects.tsx`**

```tsx
import ScrollReveal from '../components/ScrollReveal';
import ImageSlot from '../components/ImageSlot';
import { PROJECTS } from '../lib/content';

export default function Projects() {
  return (
    <div>
      <section className="mx-auto max-w-[1100px] px-[clamp(24px,6vw,80px)] pb-10 pt-[clamp(70px,10vh,110px)]">
        <h1 className="mb-4 font-sans text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.02em] text-ink">
          Projects
        </h1>
        <p className="max-w-[560px] font-sans text-[17px] leading-[1.55] text-ink-soft">
          Two things I've shipped — one you can log into right now, one you can wishlist.
        </p>
      </section>

      {PROJECTS.map((project) => (
        <ScrollReveal key={project.slug} className="mx-auto mb-[90px] max-w-[1100px] px-[clamp(24px,6vw,80px)] py-10">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="p-[clamp(32px,5vw,48px)]">
              <div className="mb-4 flex items-center gap-2.5">
                {project.status.dot && (
                  <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
                )}
                <span className={`font-mono text-xs font-semibold tracking-[0.05em] ${project.status.accentClass}`}>
                  {project.status.label}
                </span>
              </div>
              <h2 className="mb-3.5 font-sans text-[clamp(26px,3vw,34px)] font-extrabold text-ink">{project.title}</h2>
              <p className="mb-5 max-w-[680px] font-sans text-base leading-[1.65] text-ink-soft">
                {project.description}
              </p>
              <div className="mb-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-pill px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                    {tag}
                  </span>
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

            {project.demo.type === 'iframe' ? (
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
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.demo.slots.map((slot) => (
                    <ImageSlot key={slot.id} id={slot.id} placeholder={slot.placeholder} className="h-[200px] w-full" />
                  ))}
                </div>
                <p className="mt-4 font-sans text-[13px] text-ink-softer">{project.demo.note}</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open `/projects`. Confirm: StrengthAI shows a pulsing green live-dot and an embedded iframe with a fallback link beneath it; BubbleMage shows two labeled placeholder boxes instead of screenshots and a Steam link. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "Build Projects page"
```

---

### Task 13: About page

**Files:**
- Modify: `src/pages/About.tsx` (replace placeholder from Task 10)

**Interfaces:**
- Consumes: `ScrollReveal` (Task 5), `ImageSlot` (Task 4), `ABOUT`, `SKILL_GROUPS` from `content.ts` (Task 3).

- [ ] **Step 1: Write `src/pages/About.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open `/about`. Confirm: headshot placeholder box on the left of the intro, two bio paragraphs, two skill-group cards whose pills lift and turn blue on hover, and a dark resume banner at the bottom. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.tsx
git commit -m "Build About page"
```

---

### Task 14: Contact page — form, Formspree wiring, env template

**Files:**
- Modify: `src/pages/Contact.tsx` (replace placeholder from Task 10)
- Create: `.env.example`

**Interfaces:**
- Consumes: `CONTACT`, `SOCIAL_LINKS` from `content.ts` (Task 3); reads `import.meta.env.VITE_FORMSPREE_ID`.
- Produces: nothing consumed elsewhere — this is the last page.

- [ ] **Step 1: Write `.env.example`**

```
VITE_FORMSPREE_ID=your_formspree_form_id
```

- [ ] **Step 2: Write `src/pages/Contact.tsx`**

```tsx
import { useState, type FormEvent } from 'react';
import { CONTACT, SOCIAL_LINKS } from '../lib/content';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] py-[clamp(70px,10vh,110px)]">
        <div className="rounded-[20px] bg-ink p-8 text-center">
          <div className="mb-3 text-3xl">✓</div>
          <p className="mb-1.5 font-sans text-[17px] font-bold text-white">{CONTACT.successHeading}</p>
          <p className="font-sans text-sm text-white/80">{CONTACT.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] pb-[100px] pt-[clamp(70px,10vh,110px)]">
      <h1 className="mb-4 font-sans text-[clamp(34px,5vw,52px)] font-extrabold tracking-[-0.02em] text-ink">
        {CONTACT.heading}
      </h1>
      <p className="mb-12 font-sans text-[17px] leading-[1.55] text-ink-soft">{CONTACT.body}</p>

      <div className="mb-12 flex flex-wrap gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener' : undefined}
            className="rounded-full bg-pill px-5 py-2.5 font-sans text-sm font-bold text-ink-soft no-underline transition-colors hover:bg-accent hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <textarea
          placeholder="What's up?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="resize-y rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        {status === 'error' && (
          <p role="alert" className="font-sans text-sm font-semibold text-red-600">
            {CONTACT.errorBody}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="self-start rounded-full bg-accent px-[30px] py-4 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message →'}
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Manual check**

Run `npm run dev`, open `/contact`. Confirm: social pills render, filling and submitting the form with no `VITE_FORMSPREE_ID` set shows the inline error message (expected — Tony hasn't created the Formspree account yet). Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add .env.example src/pages/Contact.tsx
git commit -m "Build Contact page with Formspree wiring"
```

---

### Task 15: Full manual verification pass

**Files:** none (verification only — fix inline and commit separately if anything is found)

This task has no automated gate beyond the `npm run build` already passing after Task 14. Use the `run` skill to launch the dev server and work through this checklist:

- [ ] **Step 1: Start the dev server and open Home (`/`)**

Confirm: role text cycles, name has animated gradient, identity card renders top-right of hero on desktop widths, blob shape drifts subtly behind the hero copy, both featured project cards tilt on hover and link to `/projects`, both lower sections fade up on scroll.

- [ ] **Step 2: Check Projects (`/projects`)**

Confirm: StrengthAI card shows the pulsing live-dot and the iframe loads (or shows the fallback link if the embed fails), BubbleMage card shows two placeholder boxes and a Steam link.

- [ ] **Step 3: Check About (`/about`)**

Confirm: headshot placeholder, two bio paragraphs, two skill-group cards with hover-lift pills, resume banner with a link (placeholder `href="#"` is expected).

- [ ] **Step 4: Check Contact (`/contact`)**

Confirm: three social pills render, submitting the empty-ID form shows the inline error (expected pre-Formspree-setup state), required-field browser validation blocks submission when name/email/message are empty.

- [ ] **Step 5: Responsive check**

Resize (or use device emulation) to mobile (~375px), tablet (~768px), and desktop (~1280px) widths on all four routes. Confirm the `clamp()`-based type and spacing scale fluidly and nothing overflows horizontally.

- [ ] **Step 6: Resolve findings**

If every check passes, stop the dev server — implementation is complete, no further commit needed. If any check fails, fix the specific file inline, re-run `npm run build`, re-check the affected route, and commit that fix separately with a message describing what was wrong (e.g., `git commit -m "Fix mobile overflow on Projects tag row"`).
