'use client';

import { CinematicVideo } from '@/components/cinematic/CinematicVideo';
import { Reveal } from '@/components/cinematic/Reveal';
import { editorial } from '@/lib/editorial';

/**
 * SCENE 03 — DETAIL CINEMATIC
 *
 * Asymmetric editorial composition that runs ~120svh tall.
 *
 * LEFT (sticky):  oversized italic typography stays pinned while…
 * RIGHT (scrolls): vertical 4:5 video, caption, numbered list, all flow past
 *
 * Effect:  feels like flipping pages of a printed editorial where the
 * chapter mark stays at the top while the photographs and copy advance.
 */
export function SceneDetail() {
  const { eyebrow, headlinePrefix, headlineEm, headlineSuffix, body, list } = editorial.scene3;

  return (
    <section id="scene-3" className="relative w-full overflow-hidden bg-[#050505]">
      {/* Atmospheric warmth — faint warm glow at the sticky-text side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 25% 40%, rgba(216,201,168,0.028) 0%, transparent 65%)',
        }}
      />
      <div className="relative z-[2] grid grid-cols-1 gap-[8vw] px-[8vw] py-40 md:grid-cols-[1.1fr_1fr]">
        {/* LEFT — sticky display headline */}
        <div className="md:sticky md:top-[18vh] md:self-start">
          <Reveal>
            <div className="editorial-label mb-10 flex items-center gap-3 text-chrome">
              <span className="block h-px w-9 bg-chrome" />
              {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h2 className="font-display text-[clamp(54px,10vw,160px)] font-light leading-[0.88] tracking-[-0.02em]">
              {headlinePrefix}{' '}
              <em className="italic text-chrome font-light">{headlineEm}</em>
              <span className="mt-12 block font-sans text-[11px] uppercase tracking-wider text-ink-dim normal-case font-normal">
                {headlineSuffix}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-10 max-w-[420px] text-[14px] leading-[1.8] text-ink-dim">{body}</p>
          </Reveal>
        </div>

        {/* RIGHT — vertical video + editorial list */}
        <div>
          <Reveal>
            <div className="relative overflow-hidden border border-ink-ghost"
                 style={{ aspectRatio: '4 / 5' }}>
              <CinematicVideo
                src="/videos/scene-03.mp4"
                driftFrom={1.08}
                driftDuration={22}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 60%, rgba(5,5,5,0.7))',
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-4 flex justify-between editorial-micro">
              <span>Plate Nº 03</span>
              <span>Atelier — Paris</span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <ul className="mt-14 border-t border-ink-ghost">
              {list.map((item, i) => (
                <li
                  key={item.n}
                  data-hover
                  className="grid grid-cols-[60px_1fr_auto] items-baseline gap-6 border-b border-ink-ghost py-6 text-[13px] text-ink-dim transition-colors duration-700 ease-cinematic hover:text-ink"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="font-display italic text-chrome">{item.n}</span>
                  <span className="text-ink tracking-[0.02em]">{item.t}</span>
                  <span className="editorial-micro">{item.v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
