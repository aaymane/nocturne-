'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CinematicVideo } from '@/components/cinematic/CinematicVideo';
import { Reveal } from '@/components/cinematic/Reveal';
import { Section } from '@/components/cinematic/Section';
import { editorial } from '@/lib/editorial';

/**
 * SCENE 02 — DRIVER IMMERSION
 *
 * POV night-drive footage. The screen should feel like glass between
 * the reader and the city. We add a slow translate-Y parallax on the
 * headline as the section scrolls through the viewport — anchored to
 * useScroll so it stays perfectly synced with Lenis.
 */
export function SceneDriver() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // `target` is the wrapper; offset tracks the scene as it crosses the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Slow upward drift across the section's lifetime — feels like the
  // headline is "floating" against the moving footage behind it.
  const y = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [0, 1, 1, 0.15]);

  const { eyebrow, headline, body, meta } = editorial.scene2;

  return (
    <div ref={sectionRef}>
      <Section id="scene-2">
        <CinematicVideo
          src="/videos/scene-02.mp4"
          driftFrom={1.05}
          driftDuration={38}
        />

        <div className="relative z-[2] flex w-full items-center px-6 py-20 sm:px-[6vw] md:px-[8vw] md:py-40">
          <div className="grid w-full grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-20">
            {/* LEFT — eyebrow + headline with parallax */}
            <motion.div style={{ y, opacity }}>
              <Reveal>
                <div className="editorial-label mb-6 flex items-center gap-3 text-chrome sm:mb-8">
                  <span className="block h-px w-9 bg-chrome" />
                  {eyebrow}
                </div>
              </Reveal>
              <Reveal delay={150}>
                <h2 className="font-display text-[clamp(32px,7vw,104px)] font-light italic leading-[0.96] tracking-[-0.01em] whitespace-pre-line">
                  {headline}
                </h2>
              </Reveal>
            </motion.div>

            {/* RIGHT — body + meta */}
            <div>
              {body.map((p, i) => (
                <Reveal key={i} delay={300 + i * 200}>
                  <p className="mt-3 max-w-[420px] text-[13px] leading-[1.8] text-ink-dim first:mt-0 sm:mt-4 sm:text-[14px]">
                    {p}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={800}>
                <div className="mt-8 flex flex-wrap gap-8 sm:mt-12 sm:gap-12">
                  {meta.map((m) => (
                    <div key={m.label}>
                      <div className="editorial-micro">{m.label}</div>
                      <div
                        className="mt-1 font-display text-[18px] italic font-light text-ink sm:mt-2 sm:text-[22px]"
                        style={{ letterSpacing: '0.02em' }}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
