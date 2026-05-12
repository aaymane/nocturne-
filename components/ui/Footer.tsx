'use client';

import { Reveal } from '@/components/cinematic/Reveal';
import { editorial } from '@/lib/editorial';

/**
 * Closing footer. Large valedictory headline, four columns of editorial
 * info (no commerce — this is intentionally not a store footer), and a
 * Roman-numeral copyright line.
 */
export function Footer() {
  const { footer } = editorial;

  return (
    <footer id="footer" className="relative border-t border-ink-ghost bg-[#040404] px-[5vw] pb-8 pt-12 sm:px-[6vw] sm:pt-16 md:px-[8vw] md:pb-12 md:pt-24 lg:pt-32">
      <Reveal>
        <h3 className="font-display font-light leading-[0.9] tracking-[-0.02em]">
          <span className="block text-[clamp(36px,9vw,144px)]">{footer.headlineLine1}</span>
          <span className="block text-[clamp(36px,9vw,144px)]">
            <em className="italic text-chrome">the next chapter.</em>
          </span>
        </h3>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-ink-ghost pt-10 sm:grid-cols-2 md:mt-20 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12 md:pt-12 lg:mt-24">
        {footer.columns.map((c, i) => (
          <Reveal key={c.title} delay={i * 120}>
            <h6 className="editorial-micro mb-4 font-normal">{c.title}</h6>
            {'body' in c && c.body && (
              <p className="max-w-[360px] text-[13px] leading-[1.7] text-ink-dim">{c.body}</p>
            )}
            {'items' in c && c.items && (
              <ul className="flex flex-col gap-2 text-[13px] text-ink-dim">
                {c.items.map((it) => (
                  <li key={it} data-hover className="cursor-none transition-colors duration-500 hover:text-ink">
                    {it}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal delay={400}>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 editorial-micro md:mt-16 md:flex-row md:items-center lg:mt-24">
          <span>{footer.copyright}</span>
          <span>Filmed in Paris · Mastered in 24p</span>
        </div>
      </Reveal>
    </footer>
  );
}
