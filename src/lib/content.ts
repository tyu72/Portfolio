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
  { label: 'GitHub ↗', href: 'https://github.com/tyu72', external: true },
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
  | { type: 'iframe'; src: string; fallbackHref: string; note: string }
  | { type: 'media'; video?: { src: string; poster: string }; images: { src: string; alt: string }[] };

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
      video: { src: '/bubblemage-preview.mp4', poster: '/bubblemage-screenshot.jpg' },
      images: [{ src: '/bubblemage-screenshot.jpg', alt: 'BubbleMage gameplay screenshot' }],
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
