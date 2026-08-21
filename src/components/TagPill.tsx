type TagPillProps = {
  label: string;
};

export default function TagPill({ label }: TagPillProps) {
  return (
    <span className="rounded-full bg-pill px-2.5 py-1 font-mono text-[11px] text-ink-soft">{label}</span>
  );
}
