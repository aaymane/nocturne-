'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Luxury cursor. A thin ring damped by a Framer Motion spring so it
 * trails the pointer with a slight, cinematic lag. Expands and softens
 * over any [data-hover] element. Uses mix-blend-difference so it remains
 * legible against both the dark UI chrome and the bright video footage.
 *
 * Hidden entirely on touch via the .luxury-cursor utility (in globals.css).
 */
export function LuxuryCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Soft spring — the cursor should *float* toward the pointer, not snap.
  const springX = useSpring(x, { damping: 28, stiffness: 240, mass: 0.6 });
  const springY = useSpring(y, { damping: 28, stiffness: 240, mass: 0.6 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest('[data-hover]'));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y, visible]);

  return (
    <motion.div
      aria-hidden
      className="luxury-cursor pointer-events-none fixed left-0 top-0 z-[100] rounded-full backdrop-blur-[2px]"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
      }}
      animate={{
        width: hovering ? 78 : 34,
        height: hovering ? 78 : 34,
        borderColor: hovering ? 'rgba(245,245,245,0.85)' : 'rgba(245,245,245,0.55)',
        backgroundColor: hovering ? 'rgba(245,245,245,0.08)' : 'rgba(245,245,245,0)',
        opacity: visible ? 1 : 0,
      }}
      transition={{
        width: { duration: 0.45, ease: [0.16, 0.84, 0.3, 1] },
        height: { duration: 0.45, ease: [0.16, 0.84, 0.3, 1] },
        backgroundColor: { duration: 0.45 },
        borderColor: { duration: 0.45 },
        opacity: { duration: 0.3 },
      }}
    >
      <span className="border border-current absolute inset-0 rounded-full" />
      <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
    </motion.div>
  );
}
