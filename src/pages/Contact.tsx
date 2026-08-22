import { useState, type FormEvent } from 'react';
import { CONTACT, SOCIAL_LINKS } from '../lib/content';
import FoldText from '../components/FoldText/FoldText';
import StrokeText from '../components/StrokeText/StrokeText';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    // Padding scales with viewport height so this page fits on screen without
    // scrolling — there is little enough on it that a scrollbar is just noise.
    return (
      <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] py-[clamp(16px,3vh,56px)]">
        {/* The stroke line says it on its own — the follow-up sentence
            underneath repeated it almost word for word. */}
        <div className="flex justify-center rounded-[20px] bg-panel p-8">
          <StrokeText
            text="Talk to you soon!"
            stagger={0.09}
            strokeWidth={1.2}
            // Stroke picks up the same purple as the background pixels and
            // the card spotlights; the fill is the panel's own text colour.
            strokeColor="#6f74e8"
            fillColor="#f2f4fb"
            fontSize={54}
            letterSpacing={-1}
            trigger="mount"
            className="font-sans"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] py-[clamp(16px,3vh,56px)]">
      {/* Kept inside an h1 so the page still has a heading in its outline —
          FoldText renders spans. */}
      <h1 className="mb-4">
        <FoldText
          text={CONTACT.heading}
          splitBy="char"
          hinge="top"
          trigger="mount"
          color="#f2f4fb"
          fontSize="clamp(34px, 5vw, 52px)"
          fontWeight={800}
          className="font-sans"
        />
      </h1>
      <p className="mb-7 font-sans text-[17px] leading-[1.55] text-white">{CONTACT.body}</p>

      <div className="mb-7 flex flex-wrap gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener' : undefined}
            className="rounded-full bg-pill px-5 py-2.5 font-sans text-sm font-bold text-ink-soft no-underline transition-colors hover:bg-accent hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <input
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <input
          type="email"
          placeholder="Your email"
          aria-label="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <textarea
          placeholder="What's up?"
          aria-label="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="resize-y rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        {status === 'error' && (
          <p role="alert" className="font-sans text-sm font-semibold text-red-600">
            {CONTACT.errorBody}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="self-start rounded-full bg-accent px-[30px] py-4 font-sans text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message →'}
        </button>
      </form>
    </section>
  );
}
