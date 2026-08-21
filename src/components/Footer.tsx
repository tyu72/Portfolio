import { FOOTER } from '../lib/content';

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-bg/90 px-6 py-11 backdrop-blur-md font-sans text-sm text-ink-softer sm:px-10 lg:px-16">
      <span>{FOOTER.copyright}</span>
      <div className="flex gap-6">
        {FOOTER.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener' : undefined}
            className="text-ink-softer no-underline transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
