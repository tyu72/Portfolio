import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const initialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // Fall back to the OS preference the first time, rather than assuming light.
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Theme state, applied as data-theme on <html>. The palette itself lives in
 * index.css: every Tailwind colour utility resolves through a custom property,
 * so flipping this attribute re-themes the whole site.
 *
 * Deliberately a single hook called once in App and passed down, not a hook
 * each component calls — separate calls would each hold their own state and
 * drift out of sync.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  };
}
