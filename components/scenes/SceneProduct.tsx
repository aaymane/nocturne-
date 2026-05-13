'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/cinematic/Reveal';
import { sceneProduct } from '@/lib/editorial';

/**
 * SCENE 05 — PRODUCT
 *
 * Four acts in continuous scroll:
 *   01  Hero      — full-bleed night image, parallax, centred-bottom reveal
 *   02  Specs     — sticky studio shot left · tagline + specs + price right
 *   03  Worn      — editorial copy left · sticky lifestyle image right
 *   04  Packaging — centred unboxing image + CTA
 */
export function SceneProduct() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  // Gentle parallax: image drifts 60 px down as hero scrolls out
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const {
    eyebrow, productName, productSubtitle,
    price, edition, shipping, tagline,
    descriptionLines, specs, worn, packaging, cta,
  } = sceneProduct;

  return (
    <section id="scene-5" className="relative w-full overflow-hidden bg-night">

      {/* ── ACT 1: Hero ──────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[100svh] w-full overflow-hidden">

        {/* Parallax image — oversized 130 % to absorb the y drift */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="relative h-[130%] -top-[15%]">
            <Image
              src="/products/02-hero-paris-night.png"
              alt="The Nightcrest Cap — Paris at night"
              fill
              priority
              quality={95}
              className="object-cover"
            />
          </div>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,5,0.15) 0%, transparent 38%, rgba(5,5,5,0.94) 100%)',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 z-[2] px-[5vw] pb-14 sm:px-[6vw] sm:pb-20 md:px-[8vw] md:pb-28">
          <Reveal>
            <div className="editorial-label mb-5 flex items-center gap-3 text-chrome">
              <span className="block h-px w-9 bg-chrome" />
              {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h2 className="font-display font-light leading-[0.88] tracking-[-0.02em] text-[clamp(48px,12vw,180px)]">
              {productName}
            </h2>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-4 editorial-label text-ink-dim">{productSubtitle}</p>
          </Reveal>
        </div>
      </div>

      {/* ── ACT 2: Specs + studio shot ───────────────────────────── */}
      <div className="relative z-[2] grid grid-cols-1 gap-16 px-[5vw] py-20 sm:px-[6vw] sm:py-24 md:grid-cols-2 md:gap-[6vw] md:px-[8vw] md:py-32">

        {/* LEFT — sticky studio image */}
        <div className="md:sticky md:top-[15vh] md:self-start">
          <Reveal>
            <div
              className="group relative overflow-hidden border border-ink-ghost"
              style={{ aspectRatio: '4 / 5' }}
            >
              <Image
                src="/products/01-hero-studio.png"
                alt="The Nightcrest Cap — studio"
                fill
                quality={95}
                className="object-cover"
              />
              {/* Subtle chrome warmth on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1200 ease-cinematic group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(216,201,168,0.07) 0%, transparent 70%)',
                }}
              />
            </div>
          </Reveal>
        </div>

        {/* RIGHT — tagline · description · specs · price */}
        <div className="flex flex-col gap-14">

          <Reveal>
            <p className="font-display font-light leading-[1.1] tracking-[-0.02em] text-[clamp(22px,3.5vw,42px)]">
              {tagline}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <ul className="border-t border-ink-ghost">
              {descriptionLines.map((line, i) => (
                <li
                  key={i}
                  className="border-b border-ink-ghost py-4 text-[13px] font-light leading-relaxed text-ink-dim"
                >
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={300}>
            <div>
              <div className="editorial-label mb-6 flex items-center gap-3 text-chrome">
                <span className="block h-px w-9 bg-chrome" />
                Specifications
              </div>
              <ul className="border-t border-ink-ghost">
                {specs.map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-2 gap-4 border-b border-ink-ghost py-3 text-[12px] sm:text-[13px]"
                  >
                    <span className="editorial-micro self-center">{s.label}</span>
                    <span className="text-ink">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={450}>
            <div className="border-t border-ink-ghost pt-10">
              <p className="font-display font-light tracking-[-0.02em] text-[clamp(36px,5vw,64px)]">
                {price}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-10">
                <span className="editorial-label text-ink-dim">{edition}</span>
                <span className="editorial-label text-ink-dim">{shipping}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── ACT 3: Worn lifestyle (layout inversé) ───────────────── */}
      <div className="relative z-[2] grid grid-cols-1 md:grid-cols-2">

        {/* LEFT — editorial copy */}
        <div className="flex flex-col justify-center px-[5vw] py-20 sm:px-[6vw] sm:py-24 md:px-[8vw] md:py-32">
          <Reveal>
            <div className="editorial-label mb-8 flex items-center gap-3 text-chrome">
              <span className="block h-px w-9 bg-chrome" />
              Chapter 02
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h3 className="font-display font-light leading-[0.9] tracking-[-0.02em] text-[clamp(32px,6vw,96px)]">
              {worn.title}
            </h3>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-8 max-w-[400px] text-[13px] leading-[1.9] text-ink-dim sm:text-[14px]">
              {worn.body}
            </p>
          </Reveal>
          <Reveal delay={600}>
            <p className="mt-10 editorial-label text-ink-faint">— Paris, after rain</p>
          </Reveal>
        </div>

        {/* RIGHT — sticky lifestyle image */}
        <div className="md:sticky md:top-0 md:self-start">
          <Reveal>
            <div className="relative min-h-[60svh] overflow-hidden md:min-h-[80svh]">
              <Image
                src="/products/03-worn-paris.png"
                alt="The Nightcrest Cap — worn in Paris"
                fill
                quality={95}
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── ACT 4: Packaging + CTA ───────────────────────────────── */}
      <div className="relative z-[2] px-[5vw] py-20 text-center sm:px-[6vw] sm:py-24 md:px-[8vw] md:py-32">

        <Reveal>
          <div className="editorial-label mb-10 inline-flex items-center gap-3 text-chrome">
            <span className="block h-px w-9 bg-chrome" />
            The Object
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            className="relative mx-auto mb-14 max-w-3xl overflow-hidden border border-ink-ghost"
            style={{ aspectRatio: '4 / 3' }}
          >
            <Image
              src="/products/04-packaging.png"
              alt="The Nightcrest Cap — packaging"
              fill
              quality={95}
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <h3 className="mx-auto max-w-2xl font-display font-light leading-[0.9] tracking-[-0.02em] text-[clamp(28px,5vw,72px)]">
            {packaging.title}
          </h3>
        </Reveal>

        <Reveal delay={450}>
          <p className="mx-auto mt-6 max-w-lg text-[13px] leading-[1.9] text-ink-dim sm:text-[14px]">
            {packaging.body}
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-14 flex flex-col items-center gap-4">
            <Link
              href={cta.href}
              className="inline-block border border-ink-ghost px-10 py-4 text-[12px] uppercase tracking-editorial text-ink transition-colors duration-1200 ease-cinematic hover:bg-ink hover:text-night"
            >
              {cta.label}
            </Link>
            <p className="editorial-micro text-ink-faint">{cta.subtext}</p>
          </div>
        </Reveal>
      </div>

    </section>
  );
}
