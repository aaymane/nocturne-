'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const lenis    = useLenis();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useLiveClock();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 60);
    };
    lenis.on('scroll', onScroll);
    return () => { lenis.off('scroll', onScroll); };
  }, [lenis]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el && lenis) lenis.scrollTo(el as HTMLElement, { duration: 2.2 });
      else if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navBg = scrolled || menuOpen
    ? 'border-b border-ink-ghost bg-night/80 backdrop-blur-2xl backdrop-saturate-150'
    : 'border-b border-transparent bg-transparent';

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 0.84, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-4 transition-all duration-700 ease-cinematic sm:py-5 md:px-10 md:py-6 ${navBg}`}
      >
        {/* Brand — Link to home; smooth-scrolls to top when already on / */}
        <Link
          href="/"
          data-hover
          onClick={onLogoClick}
          className="font-display text-xl italic font-light leading-none"
        >
          {editorial.brand}
          <span className="text-chrome">.</span>
        </Link>

        {/* Desktop links */}
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

        {/* Right side: clock (md+) + hamburger (< md) */}
        <div className="flex items-center gap-4">
          <div className="editorial-label hidden items-center gap-2 md:flex">
            <span>Paris</span>
            <span className="text-ink-faint">·</span>
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

          {/* Hamburger — visible only below md */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
          >
            <span
              className={`block h-px w-6 bg-ink origin-center transition-all duration-300 ease-cinematic ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-px bg-ink transition-all duration-200 ease-cinematic ${
                menuOpen ? 'w-0 opacity-0' : 'w-5'
              }`}
            />
            <span
              className={`block h-px bg-ink origin-center transition-all duration-300 ease-cinematic ${
                menuOpen ? 'w-6 -translate-y-[7px] -rotate-45' : 'w-4'
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 0.84, 0.3, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-night/96 px-5 pb-10 pt-20 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col mt-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{
                    delay: 0.08 + i * 0.07,
                    duration: 0.45,
                    ease: [0.16, 0.84, 0.3, 1],
                  }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => onAnchor(e, l.href)}
                    className="flex items-center justify-between border-b border-ink-ghost py-5 font-display text-[clamp(28px,7vw,44px)] font-light italic text-ink transition-colors duration-300 active:text-chrome"
                  >
                    {l.label}
                    <span className="editorial-micro text-ink-faint">0{i + 1}</span>
                  </a>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="mt-auto flex items-end justify-between"
            >
              <div className="editorial-label flex flex-col gap-1 text-ink-dim">
                <span>{editorial.brand}</span>
                <span className="text-ink-faint">Paris · {time}</span>
              </div>
              <span className="editorial-micro text-ink-faint">Vol. I</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
