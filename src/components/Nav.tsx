import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT_CTA, BRAND } from '../lib/content';
import PillNav from './PillNav/PillNav';
import { PIXEL_PURPLE } from '../lib/theme';

export default function Nav() {
  const { pathname } = useLocation();

  // Memoised: a fresh array replayed PillNav's intro on every navigation.
  const items = useMemo(
    () => [...NAV_LINKS, CONTACT_CTA].map((link) => ({ label: link.label, href: link.href })),
    []
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 px-6 py-4 backdrop-blur-md sm:px-10 lg:px-16">
      <div className="flex items-center justify-between gap-6">
        <Link to="/" className="font-mono text-lg font-bold tracking-tight text-ink no-underline">
          {BRAND.name}
          <span className="text-accent">.</span>
          {BRAND.tld}
        </Link>

        {/* Out of flow: PillNav measures its own width to animate. */}
        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <PillNav
            items={items}
            activeHref={pathname}
            initialLoadAnimation
            // Hover reads as the label turning purple, not a circle filling.
            baseColor="var(--color-bg)"
            pillColor="var(--color-bg)"
            pillTextColor="#f2f4fb"
            hoveredPillTextColor={PIXEL_PURPLE}
          />
        </div>
      </div>
    </nav>
  );
}
