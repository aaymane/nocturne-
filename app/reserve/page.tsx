'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Reveal } from '@/components/cinematic/Reveal';

/* ─── Data ──────────────────────────────────────────────────────────── */

const COUNTRIES = [
  'France', 'Belgium', 'Switzerland', 'United Kingdom',
  'United States', 'Italy', 'Germany', 'Spain', 'Other',
];

const SIZES = [
  { value: 'S',  label: 'S — 56cm' },
  { value: 'M',  label: 'M — 58cm' },
  { value: 'L',  label: 'L — 60cm' },
  { value: 'XL', label: 'XL — 62cm' },
];

const RECAP_ITEMS = [
  '200 pieces · numbered',
  'Worldwide shipping · 5-7 days',
  'Crafted in Paris',
];

/* ─── Types ─────────────────────────────────────────────────────────── */

type FormState = {
  name:    string;
  email:   string;
  country: string;
  size:    string;
  notes:   string;
};

type RequiredField = 'name' | 'email' | 'country' | 'size';

const REQUIRED: RequiredField[] = ['name', 'email', 'country', 'size'];

/* ─── Style helpers ─────────────────────────────────────────────────── */

// Base without border-color so errors can swap it in
const inputBase =
  'w-full bg-transparent border-b py-4 text-[13px] text-ink ' +
  'placeholder:text-ink-faint focus:outline-none ' +
  'transition-colors duration-700 ease-cinematic';

const labelCls = 'editorial-label text-ink-faint mb-2 block';

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function ReservePage() {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', country: '', size: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Set<RequiredField>>(new Set());

  // On change: update value + clear per-field error
  const set =
    (k: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      if (REQUIRED.includes(k as RequiredField)) {
        setErrors((prev) => {
          const next = new Set(prev);
          next.delete(k as RequiredField);
          return next;
        });
      }
    };

  // Border-bottom: error red (subtle) or default ghost
  const fieldCls = (k: RequiredField, extra = '') =>
    `${inputBase} ${errors.has(k) ? 'border-red-500/40' : 'border-ink-ghost'} ${extra}`.trim();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const missing = REQUIRED.filter((k) => !form[k].trim());
    if (missing.length > 0) {
      setErrors(new Set(missing));
      return;
    }
    setErrors(new Set());
    setSubmitted(true);
  };

  const hasErrors = errors.size > 0;

  return (
    <>
      <Navigation />

      <main className="relative bg-night">

        {/* ── SECTION 1: Hero ─────────────────────────────────────── */}
        <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden">
          <Image
            src="/products/04-packaging.webp"
            alt="The Nightcrest Cap — packaging"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/70" />

          <div className="relative z-[2] flex flex-col items-center px-[5vw] py-20 text-center">
            <Reveal>
              <div className="editorial-label mb-8 flex items-center gap-3 text-ink-faint">
                <span className="block h-px w-9 bg-chrome" />
                Reservation
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="font-display font-light leading-[0.88] tracking-[-0.02em] text-[clamp(40px,8vw,120px)]">
                The{' '}
                <em className="font-light italic text-chrome">Nightcrest</em>
                {' '}Cap
              </h1>
            </Reveal>

            <Reveal delay={400}>
              <p className="mt-4 text-sm uppercase tracking-wider text-ink-dim">
                Edition 01 — 200 numbered pieces
              </p>
            </Reveal>

            <Reveal delay={600}>
              <div className="mt-8 h-px w-12 bg-chrome opacity-60" />
            </Reveal>

            <Reveal delay={800}>
              <p className="mt-8 max-w-md text-[13px] leading-[1.9] text-ink-dim">
                Each piece is hand-finished in Paris. Production begins after reservation.
                <br />
                Estimated delivery&nbsp;: 4-6 weeks.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── SECTION 2: Recap + Form ──────────────────────────────── */}
        <section className="relative z-[2] px-[5vw] py-20 sm:px-[6vw] sm:py-24 md:px-[8vw] md:py-32">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-[6vw]">

            {/* LEFT — sticky order recap */}
            <div className="md:sticky md:top-[15vh] md:self-start">
              <Reveal>
                <div className="editorial-label mb-8 flex items-center gap-3 text-chrome">
                  <span className="block h-px w-9 bg-chrome" />
                  Your Edition
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div
                  className="relative mb-8 overflow-hidden border border-ink-ghost"
                  style={{ maxWidth: 320, aspectRatio: '1 / 1' }}
                >
                  <Image
                    src="/products/01-hero-studio.webp"
                    alt="The Nightcrest Cap — studio"
                    fill
                    quality={85}
                    sizes="(max-width: 767px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={200}>
                <p className="mb-3 text-[13px] text-ink">
                  The Nightcrest Cap — Edition 01
                </p>
                <p className="font-display font-light tracking-[-0.02em] text-[clamp(28px,4vw,48px)]">
                  €380
                </p>
                <ul className="mt-6 flex flex-col gap-3 border-t border-ink-ghost pt-6">
                  {RECAP_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="editorial-label flex items-center gap-2 text-ink-dim"
                    >
                      <span className="block h-px w-4 flex-shrink-0 bg-ink-faint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* RIGHT — form or success state */}
            <div>
              <Reveal>
                <div className="editorial-label mb-10 flex items-center gap-3 text-chrome">
                  <span className="block h-px w-9 bg-chrome" />
                  Reservation Details
                </div>
              </Reveal>

              {submitted ? (

                /* ── Success ── */
                <Reveal>
                  <div className="border border-ink-ghost p-10 text-center">
                    <p className="font-display font-light italic text-[clamp(20px,3vw,32px)] text-chrome">
                      Your reservation has been received.
                    </p>
                    <p className="mt-4 text-[13px] leading-[1.9] text-ink-dim">
                      We'll be in touch within 48 hours.
                    </p>
                  </div>
                </Reveal>

              ) : (

                /* ── Form ── */
                <Reveal delay={100}>
                  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">

                    {/* Full name */}
                    <div>
                      <label className={labelCls}>Full name</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={set('name')}
                        className={fieldCls('name')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={set('email')}
                        className={fieldCls('email')}
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelCls}>Country</label>
                      <div className="relative">
                        <select
                          value={form.country}
                          onChange={set('country')}
                          className={fieldCls('country', 'appearance-none cursor-pointer pr-6')}
                        >
                          <option value="" disabled>Select your country</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c} className="bg-night text-ink">
                              {c}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute bottom-[18px] right-0 text-[10px] text-ink-faint">
                          ▾
                        </span>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className={labelCls}>Size</label>
                      <div className="relative">
                        <select
                          value={form.size}
                          onChange={set('size')}
                          className={fieldCls('size', 'appearance-none cursor-pointer pr-6')}
                        >
                          <option value="" disabled>Select your size</option>
                          {SIZES.map((s) => (
                            <option key={s.value} value={s.value} className="bg-night text-ink">
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute bottom-[18px] right-0 text-[10px] text-ink-faint">
                          ▾
                        </span>
                      </div>
                    </div>

                    {/* Notes — optional, no validation */}
                    <div>
                      <label className={labelCls}>
                        Notes{' '}
                        <span className="normal-case text-ink-faint">(optional)</span>
                      </label>
                      <textarea
                        placeholder="Any specific request ?"
                        rows={3}
                        value={form.notes}
                        onChange={set('notes')}
                        className={`${inputBase} border-ink-ghost resize-none`}
                      />
                    </div>

                    {/* Submit area */}
                    <div className="flex flex-col gap-4 pt-2">
                      {/* Global validation message */}
                      {hasErrors && (
                        <p className="text-center text-[11px] uppercase tracking-editorial text-red-400/60">
                          Please complete all required fields
                        </p>
                      )}

                      <button
                        type="submit"
                        className="group flex w-full items-center justify-between border border-ink-ghost px-8 py-5 text-[12px] uppercase tracking-editorial text-ink transition-colors duration-1200 ease-cinematic hover:bg-ink hover:text-night"
                      >
                        <span>Confirm reservation</span>
                        <span className="transition-transform duration-700 ease-cinematic group-hover:translate-x-1">
                          →
                        </span>
                      </button>

                      <p className="editorial-micro text-center text-ink-faint">
                        By reserving, you agree to be contacted within 48h to confirm details.
                        No payment is taken now.
                      </p>
                    </div>

                  </form>
                </Reveal>

              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
