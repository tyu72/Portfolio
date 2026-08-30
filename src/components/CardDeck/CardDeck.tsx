import { useEffect, useRef, useState, type ReactNode } from 'react';

export type CardDeckProps = {
  /** One entry per card, in stack order. */
  labels: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  /** Rendered per card; `isActive` gates anything expensive, like media. */
  renderCard: (index: number, isActive: boolean) => ReactNode;
  /** Horizontal offset per card behind the front one, in px. */
  cardDistance?: number;
  /** Vertical offset per card behind the front one, in px. */
  verticalDistance?: number;
  /** Shear applied to the cards behind, in degrees. */
  skewAmount?: number;
};

/** A stacked deck advanced by the reader, not a timer. */
export default function CardDeck({
  labels,
  activeIndex,
  onChange,
  renderCard,
  cardDistance = 46,
  verticalDistance = 34,
  skewAmount = 6
}: CardDeckProps) {
  const total = labels.length;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Tighter offsets on narrow screens, or the gutter eats the card.
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640
  );
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const stepX = compact ? cardDistance / 2 : cardDistance;
  const stepY = compact ? verticalDistance / 2 : verticalDistance;


  // Capped: the gutter is maxDepth steps wide and comes out of the card.
  const maxDepth = Math.min(total - 1, compact ? 3 : 4);

  const go = (next: number) => onChange((next + total) % total);

  // Roving focus: after arrowing to a tab, move focus with it.
  const focusedByKeyboard = useRef(false);
  useEffect(() => {
    if (!focusedByKeyboard.current) return;
    focusedByKeyboard.current = false;
    tabRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    focusedByKeyboard.current = true;
    go(activeIndex + (e.key === 'ArrowRight' ? 1 : -1));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Projects" onKeyDown={onTabKeyDown} className="flex flex-wrap gap-2">
          {labels.map((label, i) => (
            <button
              key={label}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              aria-selected={i === activeIndex}
              // Only the selected tab is tabbable; arrow keys move between them.
              tabIndex={i === activeIndex ? 0 : -1}
              onClick={() => onChange(i)}
              className={`rounded-full border px-4 py-2 font-sans text-sm font-bold transition-colors ${
                i === activeIndex
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-surface text-ink-soft hover:border-accent hover:text-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-ink-softer">
            {activeIndex + 1} / {total}
          </span>
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => go(activeIndex - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => go(activeIndex + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            →
          </button>
        </div>
      </div>

      {/* One shared grid cell, so cards overlap; padding leaves room to peek. */}
      <div className="[perspective:1400px]" style={{ paddingRight: stepX * maxDepth, paddingTop: stepY * maxDepth }}>
        {/* minmax(0,1fr): a fixed-width child would otherwise widen the column. */}
        <div className="grid w-full grid-cols-[minmax(0,1fr)] [transform-style:preserve-3d]">
          {labels.map((label, i) => {
            // Distance back in the stack: 0 is the front card.
            const depth = (i - activeIndex + total) % total;
            const isActive = depth === 0;
            const shown = Math.min(depth, maxDepth);
            const beyondStack = depth > maxDepth;

            return (
              <div
                key={label}
                role="tabpanel"
                aria-hidden={!isActive}
                aria-label={label}
                onClick={isActive || beyondStack ? undefined : () => onChange(i)}
                style={{
                  gridArea: '1 / 1',
                  transform: `translate3d(${shown * stepX}px, ${-shown * stepY}px, ${-shown * stepX * 1.5}px) skewY(${isActive ? 0 : skewAmount}deg)`,
                  zIndex: total - depth,
                  opacity: beyondStack ? 0 : isActive ? 1 : 0.55,
                  transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease'
                }}
                className={isActive ? '' : beyondStack ? 'pointer-events-none' : 'cursor-pointer'}
              >
                {/* Decoration: clicks promote them, and they are out of the tab order. */}
                <div
                  className={isActive ? '' : 'pointer-events-none select-none'}
                  inert={!isActive || undefined}
                >
                  {renderCard(i, isActive)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
