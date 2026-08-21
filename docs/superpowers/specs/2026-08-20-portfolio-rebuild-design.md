# Portfolio Rebuild — Design Spec

Date: 2026-08-20
Status: Approved

## Summary

Rebuild Tony's personal portfolio from a static `.dc.html` design handoff
(`C:\Users\yuton\Downloads\design_handoff_portfolio\`) into a real, deployable
Vite + React + TypeScript site. The handoff's content, copy, layout, and visual
language are final — this is not a redesign. The job is to re-implement it with
production-quality code, replace the hand-rolled Three.js business-card
animation with a component from [reactbits.dev](https://reactbits.dev/), and
polish the interaction details the mockup only sketched.

The `.dc.html` files are reference-only. They use a proprietary mockup format
(`<x-dc>` wrappers, inline styles, a `DCLogic` class) that is not buildable and
is never edited or run directly.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** for styling (mockup uses inline styles; port to Tailwind
  utility classes plus a small set of custom tokens for the oklch palette)
- **React Router** for the four pages (Home, Projects, About, Contact)
- **Framer Motion** for scroll-reveal, hover, and page-level animation, used
  alongside targeted reactbits components
- **Vercel** for deployment

## Visual language (carried over verbatim from the mockup)

- Fonts: `Manrope` (400–800) for body/headings, `JetBrains Mono` (400–700) for
  labels/tags/eyebrow text — both from Google Fonts
- Palette: oklch-based neutral scale (`98% 0.006 260` background down to
  `18% 0.015 260` near-black), accent blue `#5B8CFF`, plus two category accents
  (green `#22C55E` for "live" status, orange `oklch(50% 0.15 40)` for game/Steam)
- Radius: pill buttons (`999px`), `20px`–`24px` card corners
- No redesign of spacing, type scale, or color — this is a faithful rebuild

## Site structure

Four routed pages sharing `Nav` and `Footer`:

- `/` — Home: hero (name, rotating role headline, CTA buttons, 3D card), featured
  projects grid (2 cards), "want the longer story" CTA banner
- `/projects` — Projects: StrengthAI (live, embedded iframe demo) and
  BubbleMage (Steam, screenshot slots)
- `/about` — About: headshot, bio copy, skills grid (Build / Shape categories),
  resume download banner
- `/contact` — Contact: social links, form (name/email/message) with a
  success state after submit

`Nav` is sticky, blurred-glass on scroll. `Footer` is a simple two-column bar.

## Component architecture

```
src/
  components/
    Nav.tsx
    Footer.tsx
    ScrollReveal.tsx       -- fallback wrapper if a slot's reactbits pick isn't dropped in
    TiltCard.tsx           -- fallback wrapper if a slot's reactbits pick isn't dropped in
    ImageSlot.tsx           -- placeholder box with label, swappable for a real <img>
  pages/
    Home.tsx
    Projects.tsx
    About.tsx
    Contact.tsx
  lib/
    content.ts              -- typed constants for copy, links, tags (single source of truth)
  App.tsx                   -- router + layout shell
  main.tsx
```

All page copy, links, and tag lists live in `lib/content.ts` as typed data,
not hardcoded per-page — mirrors how the mockup repeats the same tag-pill
pattern across pages.

## reactbits.dev integration — five open slots

Tony picks the specific reactbits component for each slot. Each slot has a
working, non-reactbits fallback so implementation is never blocked waiting on
his picks — a slot ships with its fallback and gets swapped later.

| # | Slot | Where | Fallback if no pick made |
|---|------|-------|---------------------------|
| 1 | Interactive hero identity piece | Home hero, replaces the hand-rolled Three.js lanyard | Static SVG/CSS "ID card" with a subtle CSS-only swing/hover tilt, no Three.js/WebGL dependency |
| 2 | Rotating/scrambling role text | Home hero, above the name (`PRODUCT MANAGER` → `GAME DESIGNER` → ...) | Plain CSS cross-fade cycling through the word list |
| 3 | Animated gradient heading | "Tony Yu" name on Home | CSS `background-clip: text` gradient animation (as in the mockup) |
| 4 | Tilt/spotlight hover card | Featured project cards (Home) and project cards (Projects) | `TiltCard.tsx`: CSS-only `transform` tilt on `mousemove`, no library |
| 5 | Scroll-reveal wrapper | Section fade/translate-in on scroll (Home, Projects, About) | `ScrollReveal.tsx`: `IntersectionObserver` + Framer Motion fade/translate |

Nothing else routes through reactbits — buttons, form inputs, nav, and layout
are hand-built Tailwind components matching the mockup.

## Data flow

Mostly static content from `lib/content.ts`. The only stateful piece is the
Contact form:

- Local component state for `name`, `email`, `message`, `submitted`
- On submit: POST to a Formspree endpoint (Tony creates the Formspree account
  and supplies the form ID/endpoint as an env var, `VITE_FORMSPREE_ID`)
- Success renders the mockup's dark confirmation panel; no page reload
- No backend, no database, no auth

## Error handling

- Contact form: client-side required-field validation (mirrors the mockup's
  `required` attributes); on Formspree failure, show an inline error and leave
  the form filled in rather than losing input
- StrengthAI iframe embed: keep the mockup's "if the embed doesn't load, open
  it directly ↗" fallback link, since third-party embeds can fail silently
- Images (headshot, BubbleMage screenshots, resume): `ImageSlot` renders a
  labeled placeholder box until Tony supplies real assets — never a broken
  `<img>` icon

## Testing / verification

No automated test suite for a static content site — YAGNI. Verification is
manual, done through the `run` skill after implementation:

- Start the dev server, click through all four routes
- Check responsive behavior at mobile/tablet/desktop widths (mockup already
  uses `clamp()`/`minmax()` fluid sizing — verify it holds in the rebuild)
- Verify all five reactbits slots render their fallback correctly before any
  picks are made
- Submit the contact form against a Formspree test endpoint (or confirm the
  error path if no endpoint is configured yet)

## Explicitly out of scope

- Redesigning layout, copy, or palette
- CMS/backend for project or blog content
- Analytics, SEO metadata beyond basic `<title>`/meta tags
- Automated test suite
- Picking reactbits components on Tony's behalf
