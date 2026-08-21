# Portfolio

Tony Yu's personal portfolio — a four-page site covering work, background, and contact.

Built with Vite, React, TypeScript, Tailwind CSS, React Router, and Framer Motion.

## Running locally

```bash
npm install
npm run dev
```

The dev server prints a local URL (default http://localhost:5173).

## Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Contact form

The contact form posts to [Formspree](https://formspree.io). Create a form there,
then copy `.env.example` to `.env` and set your form ID:

```
VITE_FORMSPREE_ID=your_formspree_form_id
```

Without it the form renders an inline error on submit rather than failing silently.

## Project structure

```
src/
  components/   Nav, Footer, and small presentational pieces
  pages/        One file per route (Home, Projects, About, Contact)
  lib/
    content.ts  All site copy, links, and project data — edit here, not in pages
  index.css     Tailwind entry plus the design tokens (@theme) and keyframes
```

Copy and project data live in `src/lib/content.ts` as typed constants, so text
changes don't require touching page components.

Design tokens (colors, fonts) are defined in the `@theme` block in
`src/index.css`. This project uses Tailwind v4, where tokens live in CSS rather
than a `tailwind.config.js`.

## Placeholders

These ship as placeholders and are meant to be swapped in:

- Headshot on the About page
- Two BubbleMage screenshots on the Projects page
- Resume PDF link on the About page
- `VITE_FORMSPREE_ID` for the contact form

Images render as labeled placeholder boxes until real assets replace them.

## Component slots

Five interaction points are deliberately isolated into small components so they
can be swapped for [reactbits.dev](https://reactbits.dev/) equivalents without
touching page code:

| Component | Role |
|-----------|------|
| `HeroIdentityCard` | Interactive hero identity piece |
| `RoleCycler` | Rotating role text under the hero |
| `GradientHeading` | Animated gradient name |
| `TiltCard` | Tilt/spotlight hover on project cards |
| `ScrollReveal` | Section fade-in on scroll |

Each currently holds a dependency-free fallback implementation.
