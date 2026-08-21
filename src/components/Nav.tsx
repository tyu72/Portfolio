import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { NAV_LINKS, CONTACT_CTA, BRAND } from '../lib/content';
import type { Theme } from '../lib/theme';

type NavProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

export default function Nav({ theme, onToggleTheme }: NavProps) {
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
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
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
