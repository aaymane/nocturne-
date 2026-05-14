'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CinematicVideo } from '@/components/cinematic/CinematicVideo';
import { Reveal } from '@/components/cinematic/Reveal';
import { Section } from '@/components/cinematic/Section';
import { editorial } from '@/lib/editorial';

/**
 * SCENE 04 — EDITORIAL LIFESTYLE
 *
 * Final scene before the closing footer. Three single-word lines stacked
 * with alternating alignment, each scale-fading independently across the
 * scroll range. Three-column editorial credits sit below.
 *
 * The alternating alignment ("Paris." left, "Rain." center, "Motion." right)
 * is a deliberate compositional rhythm — it forces the eye to traverse the
 * full width of the page line by line, the way a fashion editorial spread
 * does across a fold.
 */
export function SceneEditorial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Three staggered fades — each word appears, peaks, then drifts
  const op1 = useTransform(scrollYProgress, [0.08, 0.22, 0.62, 0.82], [0, 1, 1, 0.08]);
  const op2 = useTransform(scrollYProgress, [0.16, 0.30, 0.68, 0.86], [0, 1, 1, 0.08]);
  const op3 = useTransform(scrollYProgress, [0.24, 0.38, 0.74, 0.90], [0, 1, 1, 0.08]);

  const y1 = useTransform(scrollYProgress, [0, 1], [55, -55]);
  const y2 = useTransform(scrollYProgress, [0, 1], [75, -75]);
  const y3 = useTransform(scrollYProgress, [0, 1], [95, -95]);

  const { eyebrow, headlineLine1, headlineLine2, headlineLine3, columns } = editorial.scene4;

  return (
    <div ref={ref}>
      <Section id="scene-4" className="min-h-[110svh]">
        <CinematicVideo
          src="/videos/scene-04.mp4"
          driftFrom={1.05}
          driftDuration={30}
        />

        <div className="relative z-[2] flex w-full flex-col justify-between px-6 py-14 sm:px-[6vw] sm:py-20 md:px-[8vw] md:py-32">
          {/* TOP — chapter mark + meta */}
          <div className="flex items-start justify-between">
            <Reveal>
              <div className="editorial-label flex items-center gap-3 text-chrome">
                <span className="block h-px w-9 bg-chrome" />
                {eyebrow}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="editorial-label text-right">
                A film
                <br />
                in three frames
              </div>
            </Reveal>
          </div>

          {/* MIDDLE — three-word stacked headline with alternating alignment */}
          <h2 className="mt-auto font-display font-light leading-[0.84] tracking-[-0.03em]">
            <motion.span
              style={{ opacity: op1, y: y1 }}
              className="block text-[clamp(52px,14vw,260px)] text-left"
            >
              {headlineLine1}
            </motion.span>
            <motion.span
              style={{ opacity: op2, y: y2 }}
              className="block text-[clamp(52px,14vw,260px)] text-center"
            >
              <em className="italic text-chrome font-light">{headlineLine2}</em>
            </motion.span>
            <motion.span
              style={{ opacity: op3, y: y3 }}
              className="block text-[clamp(52px,14vw,260px)] text-right"
            >
              {headlineLine3}
            </motion.span>
          </h2>

          {/* BOTTOM — editorial credits */}
          <div className="mt-8 grid grid-cols-1 gap-6 text-[12px] leading-[1.7] text-ink-dim sm:grid-cols-2 sm:gap-8 sm:text-[13px] md:mt-14 md:grid-cols-3 md:gap-12">
            {columns.map((c, i) => (
              <Reveal key={c.title} delay={300 + i * 150}>
                <div>
                  <h6 className="mb-4 text-[10px] font-normal uppercase tracking-wider text-chrome">
                    {c.title}
                  </h6>
                  <p>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
