'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLenis } from '@/lib/lenis-provider';
import { editorial } from '@/lib/editorial';

const links = [
  { label: 'Collection', href: '#scene-2' },
  { label: 'Editorial', href: '#scene-3' },
  { label: 'Archive', href: '#scene-4' },
  { label: 'About', href: '#footer' },
];

function useLiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Navigation() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const time = useLiveClock();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 60);
    };
    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  // Anchor scroll routed through Lenis for cinematic deceleration
  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { duration: 2.2 });
    else if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 0.84, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-5 transition-all duration-700 ease-cinematic md:px-10 md:py-6 ${
        scrolled
          ? 'border-b border-ink-ghost bg-night/60 backdrop-blur-2xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="font-display text-xl italic font-light leading-none">
        {editorial.brand}
        <span className="text-chrome">.</span>
      </div>

      <ul className="hidden gap-9 md:flex">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              data-hover
              onClick={(e) => onAnchor(e, l.href)}
              className="group relative inline-block py-1 text-[11px] uppercase tracking-editorial text-ink-dim transition-colors duration-500 hover:text-ink"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-chrome transition-all duration-700 ease-cinematic group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <div className="editorial-label flex items-center gap-2">
        <span className="hidden sm:inline">Paris</span>
        <span className="hidden sm:inline text-ink-faint">·</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={time}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="font-display italic text-ink"
            style={{ letterSpacing: '0.05em' }}
          >
            {time}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
