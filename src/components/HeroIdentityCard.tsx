export default function HeroIdentityCard() {
  return (
    <div className="group relative mx-auto w-full max-w-[220px] select-none [perspective:900px]">
      <div className="mx-auto h-10 w-3 rounded-b-full bg-border-soft" />
      <div className="mt-2 rounded-2xl border border-border bg-surface p-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out [transform:rotateZ(-2deg)] group-hover:[transform:rotateZ(2deg)]">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-surface-alt" />
        <div className="font-sans text-base font-extrabold text-ink">TONY YU</div>
        <div className="mt-1 font-mono text-xs font-semibold text-accent">PM · CS</div>
        <div className="my-3 h-px w-full bg-border" />
        <div className="font-mono text-[11px] tracking-[0.05em] text-ink-softer">PORTFOLIO ID</div>
      </div>
    </div>
  );
}
