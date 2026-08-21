import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
};

const RESET_TRANSFORM = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';

export default function TiltCard({ children, className = '', href }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(RESET_TRANSFORM);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale(1.02)`
    );
  };

  const content = (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform(RESET_TRANSFORM)}
      style={{ transform, transition: 'transform 150ms ease-out' }}
      className={className}
    >
      {children}
    </div>
  );

  if (href) {
    // Route internal links through the router. A plain anchor triggers a full
    // page reload, which on this site means replaying the lanyard's drop-in and
    // rebuilding the background shader on every card click.
    if (href.startsWith('/')) {
      return (
        <Link to={href} className="block h-full w-full no-underline">
          {content}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener" className="block h-full w-full no-underline">
        {content}
      </a>
    );
  }
  return content;
}
