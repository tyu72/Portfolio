import { useEffect, useState } from 'react';
import { HERO_ROLES } from '../lib/content';

const INTERVAL_MS = 3200;
const FADE_MS = 300;

export default function RoleCycler() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % HERO_ROLES.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
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
