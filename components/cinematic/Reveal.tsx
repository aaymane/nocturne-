'use client';

import {
  ElementType,
  ReactNode,
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Delay in milliseconds — stagger nearby reveals for editorial pacing. */
  delay?: number;
  /** IntersectionObserver threshold (default 0.15). */
  threshold?: number;
  /** Animate only on the first intersection. Default true. */
  once?: boolean;
};

const Reveal = forwardRef<HTMLElement, RevealProps>(
  (
    {
      as: Tag = 'div',
      children,
      className = '',
      style,
      delay = 0,
      threshold = 0.15,
      once = true,
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    // Merge the internal observer ref with any forwarded ref so both work.
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (innerRef as any).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef != null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (forwardedRef as any).current = node;
        }
      },
      [forwardedRef],
    );

    useEffect(() => {
      const el = innerRef.current;
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

    const mergedStyle: CSSProperties = { transitionDelay: `${delay}ms`, ...style };
    const cls = `reveal-init ${shown ? 'in' : ''} ${className}`.trim();

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Tag ref={setRef as any} className={cls} style={mergedStyle}>
        {children}
      </Tag>
    );
  },
);

Reveal.displayName = 'Reveal';

// Named export kept for existing `import { Reveal }` call-sites.
export { Reveal };
export default Reveal;
