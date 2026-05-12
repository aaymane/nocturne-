'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CinematicVideo } from '@/components/cinematic/CinematicVideo';
import { Reveal } from '@/components/cinematic/Reveal';
import { Section } from '@/components/cinematic/Section';
import { editorial } from '@/lib/editorial';

function useClock() {
  const [t, setT] = useState('--:--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * Spring physics — overdamped (ζ ≈ 2.8) so there is zero bounce,
 * but stiffness is high enough that motion is clearly perceptible.
 *
 * Previous version used stiffness:14 which was essentially invisible.
 * stiffness:45 with heavy mass gives slow but clearly felt response.
 */
const SPRING = { stiffness: 45, damping: 55, mass: 2.2 };

/**
 * SCENE 01 — HERO
 *
 * Spatial composition across four depth planes, each driven by the
 * same spring but with progressively larger translation ranges:
 *
 *   Plane          X travel    Y travel    Differential vs bg
 *   ─────────────  ─────────   ─────────   ──────────────────
 *   Background     ±18 px      ±12 px      —
 *   Atmosphere     ±32 px      ±21 px      +14 px
 *   Headline       ±52 px      ±34 px      +34 px
 *   Metadata       ±75 px      ±50 px      +57 px  ← clearly felt
 *
 * The headline also carries a CSS 3D camera rotation (±2°/±1.5°),
 * making it feel like a monumental object floating in 3D space rather
 * than text pasted onto a screen.
 *
 * Autonomous atmospheric movement:
 *   Two independent haze layers (50s + 62s cycles, never in sync)
 *   drift across the composition. No JS — pure CSS, GPU-only.
 *   Positioned at corners, never create a centred hotspot.
 */
export function SceneHero() {
  const time = useClock();
  const { hero, volume, subtitle, coordinates, city } = editorial;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  // Depth-plane translations
  const bgX   = useTransform(x, [-1, 1], [-18,  18]);
  const bgY   = useTransform(y, [-1, 1], [-12,  12]);

  const atmX  = useTransform(x, [-1, 1], [-32,  32]);
  const atmY  = useTransform(y, [-1, 1], [-21,  21]);

  const typX  = useTransform(x, [-1, 1], [-52,  52]);
  const typY  = useTransform(y, [-1, 1], [-34,  34]);

  const metaX = useTransform(x, [-1, 1], [-75,  75]);
  const metaY = useTransform(y, [-1, 1], [-50,  50]);

  // 3D camera rotation on the headline — perspective makes it feel
  // like a physical object floating in the space, not flat text.
  const camRotX = useTransform(y, [-1, 1], [ 1.5, -1.5]);
  const camRotY = useTransform(x, [-1, 1], [-2.0,  2.0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth)  * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  return (
    <Section id="hero" topFade>

      {/* ── PLANE 1: Video ────────────────────────────────────────────
          8% oversized so the ±18 px travel never exposes an edge.
          Ken Burns drift runs on the video itself via GSAP (separate
          from the mouse parallax — two independent motion layers). */}
      <motion.div
        className="absolute inset-[-4%]"
        style={{ x: bgX, y: bgY }}
      >
        <CinematicVideo
          src="/videos/scene-01.mp4"
          poster="/images/hero-poster.png"
          driftFrom={1.08}
          driftDuration={36}
        />
      </motion.div>

      {/* ── PLANE 2: Widescreen lateral framing ──────────────────────
          Moves at atmosphere depth — slightly faster than video,
          creating the sensation that the frame itself has depth. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          x: atmX,
          y: atmY,
          background:
            'linear-gradient(90deg, rgba(2,2,2,0.58) 0%, transparent 20%, transparent 80%, rgba(2,2,2,0.50) 100%)',
        }}
      />

      {/* ── PLANE 2: Directional contrast shadow ────────────────────
          A single slow-drifting dark diagonal — adds spatial depth
          without contributing any brightness. Pure subtraction. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-5%] z-[2] animate-haze-drift"
        style={{
          background:
            'linear-gradient(148deg, rgba(3,3,3,0.22) 0%, transparent 35%, transparent 65%, rgba(3,3,3,0.18) 100%)',
          animationDelay: '-34s',
        }}
      />

      {/* ── PLANE 3 + 4: Typography and metadata ─────────────────────
          Content layer. The headline has an additional 3D camera
          rotation via `perspective` so it feels like a monumental
          object occupying real space. Metadata rides the deepest
          parallax (±75 px) — it floats closest to the viewer. */}
      <div className="relative z-[3] flex w-full flex-col justify-between px-[8vw] pb-14 pt-32 md:pt-36">

        {/* Metadata — closest plane, max parallax */}
        <motion.div
          className="flex items-start justify-between"
          style={{ x: metaX, y: metaY }}
        >
          <Reveal delay={200}>
            <div className="editorial-label max-w-[240px] leading-[1.8]">
              {volume}
              <br />
              {subtitle}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="editorial-label text-right leading-[1.8]">
              {coordinates}
              <br />
              {city}
            </div>
          </Reveal>
        </motion.div>

        {/* Headline — mid plane + 3D camera rotation.
            The perspective wrapper makes rotateX/Y apply in 3D space,
            so the headline tilts like a physical surface — not a screen
            element doing a 2D skew. */}
        <div style={{ perspective: '900px' }}>
          <motion.h1
            className="mt-auto font-display font-light leading-[0.86] tracking-[-0.02em] text-balance"
            style={{
              x: typX,
              y: typY,
              rotateX: camRotX,
              rotateY: camRotY,
            }}
          >
            <Reveal as="span" delay={500}>
              <span
                className="block text-[clamp(64px,14vw,220px)]"
                style={{ textShadow: '0 4px 80px rgba(0,0,0,0.45)' }}
              >
                {hero.line1}
              </span>
            </Reveal>
            <Reveal as="span" delay={800}>
              <span
                className="block text-[clamp(64px,14vw,220px)] pl-[14vw]"
                style={{ textShadow: '0 4px 80px rgba(0,0,0,0.45)' }}
              >
                for the{' '}
                <em
                  className="italic font-light"
                  style={{
                    color: '#ead8b4',
                    // Spread so wide it affects only the letter edges —
                    // reads as a slight warmth, never a visible shape.
                    textShadow:
                      '0 0 200px rgba(234,216,180,0.06), 0 4px 80px rgba(0,0,0,0.45)',
                  }}
                >
                  night
                </em>
                .
              </span>
            </Reveal>
          </motion.h1>
        </div>

        {/* Bottom triad — rides metadata depth */}
        <motion.div
          className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_auto_1fr]"
          style={{ x: metaX, y: metaY }}
        >
          <Reveal delay={1100}>
            <p className="max-w-[360px] text-[13px] leading-[1.6] text-ink-dim">
              {hero.sub}
            </p>
          </Reveal>

          <Reveal delay={1300} className="hidden md:block">
            <div className="flex flex-col items-center gap-3">
              <span className="editorial-micro">Scroll</span>
              <span
                className="h-16 w-px animate-scrollline"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, rgba(157,157,157,0.55), transparent)',
                  backgroundSize: '100% 200%',
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={1100}>
            <div className="text-right">
              <div className="editorial-label">Tonight</div>
              <div
                className="mt-2 font-display text-2xl italic font-light text-ink"
                style={{ letterSpacing: '0.02em' }}
              >
                {time}
              </div>
            </div>
          </Reveal>
        </motion.div>

      </div>
    </Section>
  );
}
