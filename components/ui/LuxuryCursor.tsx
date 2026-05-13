'use client';

import { useEffect, useRef } from 'react';

/**
 * Luxury cursor — two-layer design:
 *   Dot  : 4 px solid point, follows mouse INSTANTLY (no interpolation)
 *   Ring : 32 px outline, lerp 0.18 for a subtle cinematic trail
 *
 * All position updates bypass React state and go directly to DOM via rAF
 * to guarantee 60 fps without re-render overhead.
 *
 * mix-blend-mode: difference keeps both elements legible on dark AND light
 * surfaces (nav, video highlights, editorial sections).
 */

const LERP       = 0.18;
const EASE_OUT   = 'cubic-bezier(0.16, 0.84, 0.30, 1)';

// Ring default / hover appearance
const RING_DEFAULT = {
  width:   '32px', height:  '32px',
  left:    '-16px', top:    '-16px',
  borderColor:     'rgba(245,245,245,0.38)',
  backgroundColor: 'transparent',
};
const RING_HOVER = {
  width:   '56px', height:  '56px',
  left:    '-28px', top:    '-28px',
  borderColor:     'transparent',
  backgroundColor: 'rgba(245,245,245,0.10)',
};

export function LuxuryCursor() {
  const dotWrapRef  = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const dotInnerRef  = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotWrap   = dotWrapRef.current;
    const ringWrap  = ringWrapRef.current;
    const dotInner  = dotInnerRef.current;
    const ringInner = ringInnerRef.current;
    if (!dotWrap || !ringWrap || !dotInner || !ringInner) return;

    // Mutable state — never triggers React renders
    let mouseX   = -200, mouseY  = -200;
    let ringX    = -200, ringY   = -200;
    let visible  = false;
    let hovering = false;
    let onInput  = false;
    let raf      = 0;

    /* ── helpers ─────────────────────────────────────────── */

    const showCursors = (on: boolean) => {
      const v = on ? '1' : '0';
      dotInner.style.opacity  = v;
      ringInner.style.opacity = v;
    };

    const applyRingState = (hover: boolean) => {
      const s = hover ? RING_HOVER : RING_DEFAULT;
      ringInner.style.width           = s.width;
      ringInner.style.height          = s.height;
      ringInner.style.left            = s.left;
      ringInner.style.top             = s.top;
      ringInner.style.borderColor     = s.borderColor;
      ringInner.style.backgroundColor = s.backgroundColor;
    };

    /* ── rAF loop ─────────────────────────────────────────── */

    const tick = () => {
      // Dot: instant — set each frame regardless (ensures first-frame sync)
      dotWrap.style.transform = `translate(${mouseX}px,${mouseY}px)`;

      // Ring: lerp
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;
      ringWrap.style.transform = `translate(${ringX}px,${ringY}px)`;

      raf = requestAnimationFrame(tick);
    };

    /* ── event handlers ───────────────────────────────────── */

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        if (!onInput) showCursors(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const isHover = !!t?.closest('a, button, [data-hover]');
      const isInput = !!t?.closest('input, textarea, select');

      if (isInput !== onInput) {
        onInput = isInput;
        if (visible) showCursors(!isInput);
      }
      if (isHover !== hovering) {
        hovering = isHover;
        applyRingState(hovering);
      }
    };

    // Dot retracts on press — gives tactile feedback
    const onDown = () => { dotInner.style.transform = 'scale(0.65)'; };
    const onUp   = () => { dotInner.style.transform = 'scale(1)';   };

    const onLeave = () => {
      visible = false;
      showCursors(false);
    };

    window.addEventListener('pointermove',  onMove, { passive: true });
    window.addEventListener('pointerover',  onOver, { passive: true });
    window.addEventListener('pointerdown',  onDown, { passive: true });
    window.addEventListener('pointerup',    onUp,   { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup',   onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Shared transition for visual-state changes (NOT for position — that's rAF)
  const stateTransition = [
    `opacity 400ms ${EASE_OUT}`,
    `transform 150ms ${EASE_OUT}`,
  ].join(', ');

  const ringTransition = [
    `opacity 400ms ${EASE_OUT}`,
    `width 250ms ${EASE_OUT}`,
    `height 250ms ${EASE_OUT}`,
    `left 250ms ${EASE_OUT}`,
    `top 250ms ${EASE_OUT}`,
    `border-color 250ms ${EASE_OUT}`,
    `background-color 250ms ${EASE_OUT}`,
  ].join(', ');

  return (
    <>
      {/* ── Dot wrapper — instant position, no transition on transform ── */}
      <div
        ref={dotWrapRef}
        aria-hidden
        className="luxury-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: 'transform', mixBlendMode: 'difference' }}
      >
        <div
          ref={dotInnerRef}
          style={{
            position:        'absolute',
            width:           4,
            height:          4,
            left:            -2,
            top:             -2,
            borderRadius:    '50%',
            backgroundColor: '#f5f5f5',
            opacity:         0,
            transition:      stateTransition,
          }}
        />
      </div>

      {/* ── Ring wrapper — lerp position, no transition on transform ── */}
      <div
        ref={ringWrapRef}
        aria-hidden
        className="luxury-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: 'transform', mixBlendMode: 'difference' }}
      >
        <div
          ref={ringInnerRef}
          style={{
            position:        'absolute',
            width:           32,
            height:          32,
            left:            -16,
            top:             -16,
            borderRadius:    '50%',
            border:          '1px solid rgba(245,245,245,0.38)',
            backgroundColor: 'transparent',
            opacity:         0,
            transition:      ringTransition,
          }}
        />
      </div>
    </>
  );
}
