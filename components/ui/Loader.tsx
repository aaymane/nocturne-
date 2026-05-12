'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLenis } from '@/lib/lenis-provider';
import { editorial } from '@/lib/editorial';

/**
 * Intro slate. A cinematic dark hold:
 *  - mark fades in over 1.6s
 *  - hairline progress bar fills with the chrome accent over 2.4s
 *  - the entire loader fades out
 *  - Lenis scroll is paused while the loader is visible so accidental
 *    wheel input during the slate doesn't skip the hero entrance reveal
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (!done) lenis.stop();
    else lenis.start();
  }, [lenis, done]);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 0.84, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 0.84, 0.3, 1] }}
              className="font-display text-5xl italic font-light text-ink"
            >
              {editorial.brand}
              <span className="text-chrome">.</span>
            </motion.div>

            <div className="relative mx-auto mt-6 h-px w-40 overflow-hidden bg-ink-ghost">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: 'left' }}
                className="h-full w-full bg-chrome"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.8 }}
              className="editorial-micro mt-4"
            >
              A Cinematic Editorial — {editorial.volume.split('—')[1]?.trim() ?? 'Vol. 01'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
