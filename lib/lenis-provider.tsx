'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis(): Lenis | null {
  return useContext(LenisContext).lenis;
}

/**
 * Wraps the app in a Lenis smooth-scroll instance.
 * - Slow, cinematic easing (lerp ~0.08) so scroll feels weighted, not snappy.
 * - Disables on touch — native momentum on mobile is preferable.
 * - Exposes the instance via context so other components (parallax, scroll-snap)
 *   can subscribe to scroll events without instantiating their own loop.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      lerp: 0.08,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false,
    });

    setLenis(instance);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
}
