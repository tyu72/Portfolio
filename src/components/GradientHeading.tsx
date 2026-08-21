import type { ReactNode } from 'react';

type GradientHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function GradientHeading({ children, className = '' }: GradientHeadingProps) {
  return (
    <h1
      className={`animate-gradient-shift bg-[linear-gradient(90deg,oklch(18%_0.015_260),#5B8CFF,oklch(18%_0.015_260))] bg-[length:200%_auto] bg-clip-text font-sans font-extrabold leading-[1.02] tracking-[-0.03em] text-transparent ${className}`}
    >
      {children}
    </h1>
  );
}
