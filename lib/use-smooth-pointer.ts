'use client';

import { useEffect, useRef } from 'react';

export interface SmoothPointer {
  /** Live target (normalized: -0.5..0.5 across viewport). */
  target: { x: number; y: number };
  /** Smoothed value, updated each frame via lerp. */
  smoothed: { x: number; y: number };
}

/**
 * Tracks the pointer in normalized coordinates and damps the value
 * with a lerp loop. Components read `smoothed` each frame (e.g. inside
 * useFrame) so they receive cinematic, weighted motion instead of raw input.
 */
export function useSmoothPointer(lerp = 0.06): SmoothPointer {
  const ref = useRef<SmoothPointer>({
    target: { x: 0, y: 0 },
    smoothed: { x: 0, y: 0 },
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.target.x = e.clientX / window.innerWidth - 0.5;
      ref.current.target.y = e.clientY / window.innerHeight - 0.5;
    };

    let raf = 0;
    const tick = () => {
      const { target, smoothed } = ref.current;
      smoothed.x += (target.x - smoothed.x) * lerp;
      smoothed.y += (target.y - smoothed.y) * lerp;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [lerp]);

  return ref.current;
}
