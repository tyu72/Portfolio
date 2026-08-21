import { useState, type FormEvent } from 'react';
import { CONTACT, SOCIAL_LINKS } from '../lib/content';

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
    return (
      <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] py-[clamp(70px,10vh,110px)]">
        <div className="rounded-[20px] bg-ink p-8 text-center">
          <div className="mb-3 text-3xl">✓</div>
          <p className="mb-1.5 font-sans text-[17px] font-bold text-white">{CONTACT.successHeading}</p>
          <p className="font-sans text-sm text-white/80">{CONTACT.successBody}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[760px] px-[clamp(24px,6vw,80px)] pb-[100px] pt-[clamp(70px,10vh,110px)]">
      <h1 className="mb-4 font-sans text-[clamp(34px,5vw,52px)] font-extrabold tracking-[-0.02em] text-ink">
        {CONTACT.heading}
      </h1>
      <p className="mb-12 font-sans text-[17px] leading-[1.55] text-ink-soft">{CONTACT.body}</p>

      <div className="mb-12 flex flex-wrap gap-4">
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-[1.5px] border-border-soft bg-surface px-[18px] py-4 font-sans text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <textarea
          placeholder="What's up?"
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
