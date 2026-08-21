type ImageSlotProps = {
  id: string;
  placeholder: string;
  className?: string;
};

export default function ImageSlot({ id, placeholder, className = '' }: ImageSlotProps) {
  return (
    <div
      data-slot-id={id}
      className={`flex items-center justify-center rounded-2xl border border-dashed border-border-soft bg-surface-alt font-mono text-xs text-ink-softer ${className}`}
    >
      {placeholder}
    </div>
  );
}
