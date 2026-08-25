import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT_CTA, BRAND } from '../lib/content';
import PillNav from './PillNav/PillNav';
import { PIXEL_PURPLE } from '../lib/theme';

export default function Nav() {
  const { pathname } = useLocation();

  // Contact was a separate CTA button; as a pill it belongs with the rest.
  // Memoised because PillNav keys its layout effect on this array. Rebuilding
  // it on every render meant each navigation looked like new items and replayed
  // the intro animation, sliding the pills out from under the cursor.
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

        {/* Absolutely centred from md up, rather than sitting in a grid or flex
            track. PillNav's load animation grows the pill row from width 0 to
            width auto, and inside an auto-sized track "auto" measures back to
            the 0 it was just set to — so the pills would stay collapsed and
            invisible. Out of flow, nothing constrains that measurement.
            Below md it stays in the row, where it renders its hamburger. */}
        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <PillNav
            items={items}
            activeHref={pathname}
            initialLoadAnimation
            // Track and pills both read the page background token, so the nav
            // sits flat against the header. Base also drives the circle that
            // fills a pill on hover — black on black, so that read as nothing
            // and the hover state is carried by the label turning purple
            // instead, matching the background pixels.
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
