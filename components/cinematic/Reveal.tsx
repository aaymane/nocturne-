'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Delay in milliseconds. Stagger nearby elements by 100–300ms for editorial pacing. */
  delay?: number;
  /** Custom intersection threshold (default 0.15). */
  threshold?: number;
  /** If true, animates only the first time. Default true. */
  once?: boolean;
  /** Extra classes for the wrapper. */
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * IntersectionObserver-based reveal. Initial state is set by `.reveal-init`
 * in globals.css; the observer flips `.in` when the element enters the
 * viewport, triggering a long, cinematic transition (opacity + Y + blur).
 *
 * Kept hand-rolled instead of using framer-motion's whileInView because:
 *  - it lives outside React render on subsequent updates, lighter on perf
 *  - the blur-to-clear transition reads better as a single CSS keyframe set
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  const cls = `reveal-init ${shown ? 'in' : ''} ${className}`.trim();

  return (
    // The `as` cast is necessary because TS can't narrow the generic tag here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cls} style={style}>
      {children}
    </Tag>
  );
}
