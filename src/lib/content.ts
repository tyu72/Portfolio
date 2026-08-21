export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export const CONTACT_CTA: NavLink = { label: 'Contact', href: '/contact' };

export const BRAND = { name: 'yutony', tld: 'dev' };

export type SocialLink = { label: string; href: string; external: boolean };

export const SOCIAL_LINKS: SocialLink[] = [
  { label: '✉ yutony115@gmail.com', href: 'mailto:yutony115@gmail.com', external: false },
  { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/yutony03/', external: true },
];

export const FOOTER = {
  copyright: '© 2026 Tony Yu',
  links: [
    { label: 'GitHub', href: 'https://github.com/tyu72' },
    { label: 'Email', href: 'mailto:yutony115@gmail.com' },
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
  | {
      type: 'iframe';
      src: string;
      fallbackHref: string;
      note: string;
      /**
       * The embed's own fixed canvas size, when it has one. Both games render
       * to a fixed Phaser canvas, so the embed is rendered at that size and
       * scaled to fit the card — otherwise the game is simply cropped.
       */
      naturalWidth?: number;
      naturalHeight?: number;
      /**
       * The embedded page's own body margin, in its pixels. The frame is made
       * this much bigger and then shifted back by the same amount, so the
       * margin is cropped off and the canvas fills the box exactly — otherwise
       * the page overflows its frame, scrollbars appear, and the game's own
       * centring pushes it off to one side.
       */
      embedInset?: number;
      /**
       * Fraction of the frame's width the game's canvas actually occupies.
       * Some pages render their canvas narrower than the frame, leaving dead
       * space down one side; scaling by this fraction pushes that space past
       * the edge, where it is clipped. 1 means the canvas fills the frame.
       * Measured from the rendered page — it cannot be read across origins.
       */
      embedContentFraction?: number;
    }
  | { type: 'media'; video?: { src: string; poster?: string }; images: { src: string; alt: string }[] };

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
    // Served from public/ rather than imported: the clip is ~54 MB, and the
    // page only fetches it if someone presses play.
    demo: {
      type: 'media',
      video: { src: '/bubblemage-preview.mp4' },
      images: [{ src: '/bubblemage-screenshot.jpg', alt: 'BubbleMage gameplay screenshot' }],
    },
  },
  {
    slug: 'space-drift',
    status: { label: 'PLAYABLE · BROWSER GAME', accentClass: 'text-live', dot: true },
    title: 'Space Drift',
    description:
      'An arcade dodger built in Phaser: steer a ship through falling asteroids and grab fuel to trigger nitro, which makes you briefly immune — and stacks if you collect more while it is already running. Every 15 seconds the asteroids get faster and more numerous, so a run is a question of how long you can keep up. The sprites and backgrounds are hand-drawn.',
    tags: ['Phaser', 'JavaScript', 'Game design', 'Solo project'],
    links: [
      { label: 'Play full screen ↗', href: 'https://tyu72.github.io/Space-Drift/' },
      { label: 'View code ↗', href: 'https://github.com/tyu72/Space-Drift' },
    ],
    demo: {
      type: 'iframe',
      src: 'https://tyu72.github.io/Space-Drift/',
      fallbackHref: 'https://tyu72.github.io/Space-Drift/',
      note: 'PLAY IT HERE — press play, then click the game to use the keyboard',
      naturalWidth: 800,
      naturalHeight: 600,
      // This page resets body margin to 0, so nothing needs cropping.
      embedInset: 0,
    },
  },
  {
    slug: 'typing-tutor-turbo',
    status: { label: 'PLAYABLE · BROWSER GAME', accentClass: 'text-live', dot: true },
    title: 'Typing Tutor Turbo',
    description:
      'A typing game built in Phaser with Michael Xi. Words stack up and you pick one with the arrow keys, then clear it letter by letter — but hollow letters are shielded and take several hits, shields regenerate while you work, and a letter you type can count toward other words on screen. Built to make drilling accuracy feel like an arcade run rather than a lesson.',
    tags: ['Phaser', 'JavaScript', 'Game design', 'Two-person team'],
    links: [
      { label: 'Play full screen ↗', href: 'https://xismichael.github.io/typingTutorTurbo/' },
      { label: 'View code ↗', href: 'https://github.com/xismichael/typingTutorTurbo' },
    ],
    demo: {
      type: 'iframe',
      src: 'https://xismichael.github.io/typingTutorTurbo/',
      fallbackHref: 'https://xismichael.github.io/typingTutorTurbo/',
      note: 'PLAY IT HERE — press play, then click the game to use the keyboard',
      naturalWidth: 1500,
      naturalHeight: 1000,
      // This page sets no margin reset, so it inherits the browser default 8px.
      embedInset: 8,
    },
  },
];

export const ABOUT = {
  bio: [
    "I'm a computer science and game design major who likes taking things from a blank file to something people can actually use. That's meant building web apps, writing gameplay systems in Unity, and lately spending more time thinking about why people click what they click than how the code works underneath.",
    "Right now I'm aiming toward product management — I like being close enough to the code to know what's actually hard to build, and close enough to the user to know what's actually worth building.",
  ],
  // Served straight from public/, so the URL stays clean and stable rather
  // than being content-hashed by the bundler.
  resume: {
    heading: 'Resume',
    body: 'The full rundown, one PDF.',
    cta: { label: 'Download resume ↓', href: '/Tony-Yu-Resume.pdf' }
  },
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
