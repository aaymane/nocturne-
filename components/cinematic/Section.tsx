import { type ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  /** Optional className appended to the scene root. */
  className?: string;
  /** If true, the section gets a stronger top fade for hard cuts. */
  topFade?: boolean;
}

/**
 * Scene wrapper. Establishes:
 *  - the relative positioning context for the video underlay
 *  - the gradient overlay sitting at z-[1] that gives text legibility
 *  - the content layer at z-[2] that scenes populate
 *
 * Per the brief, every section is fullscreen and minimal.
 */
export function Section({ id, children, className = '', topFade = false }: SectionProps) {
  return (
    <section id={id} className={`scene flex ${className}`}>
      {/* Children include the <CinematicVideo /> as the first child.
          The overlay sits above it, content above that. */}
      {children}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: topFade
            ? `radial-gradient(ellipse 160% 100% at 50% 50%, transparent 42%, rgba(2,2,2,0.48) 72%, rgba(2,2,2,0.80) 100%),
               linear-gradient(180deg, rgba(3,3,3,0.80) 0%, rgba(3,3,3,0.12) 16%, rgba(3,3,3,0.04) 55%, rgba(3,3,3,0.88) 100%)`
            : `radial-gradient(ellipse 160% 100% at 50% 50%, transparent 38%, rgba(2,2,2,0.52) 74%, rgba(2,2,2,0.85) 100%),
               linear-gradient(180deg, rgba(3,3,3,0.78) 0%, rgba(3,3,3,0.08) 20%, rgba(3,3,3,0.10) 58%, rgba(3,3,3,0.90) 100%)`,
        }}
      />
    </section>
  );
}
