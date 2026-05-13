'use client';

import { useEffect, useRef } from 'react';

/**
 * Nightcrest cursor — two-layer crescent design.
 *
 * Dot      : 4 px chrome point — follows mouse DIRECTLY inside mousemove,
 *            zero interpolation, zero rAF latency.
 *
 * Crescent : 36 px SVG crescent — lerp 0.35 in rAF for a 1–2 frame trail.
 *            Rotation handled via the CSS `rotate` property (separate
 *            compositor layer from `transform`, so position never jitters).
 *
 * Performance contract:
 *   - Dot updates: every mousemove event (~240 Hz on modern hardware)
 *   - Crescent position: 60 fps rAF loop (lerp 0.35 ≈ 2-frame trail)
 *   - Rotation: delta-time based → frame-rate independent
 *   - Zero React re-renders after mount
 */

/* ─── Design tokens ──────────────────────────────────────── */
const CHROME   = '#d8c9a8';
const INK      = '#f5f5f5';
const EASE_CIN = 'cubic-bezier(0.16, 0.84, 0.30, 1)';

/* ─── Motion constants ───────────────────────────────────── */
const LERP          = 0.35;           // crescent position lerp (higher = less trail)
const ROT_DEFAULT   = 360 / 24;       // °/s — one revolution per 24 s
const ROT_HOVER     = 360 / 8;        // °/s — faster on interactive elements

/* ─── Crescent sizes (px) ────────────────────────────────── */
const SIZE_DEFAULT     = 36;
const SIZE_INTERACTIVE = 60;
const SIZE_MEDIA       = 72;

type HoverState = 'default' | 'interactive' | 'media';

export function LuxuryCursor() {
  const dotWrapRef      = useRef<HTMLDivElement>(null);
  const crescentWrapRef = useRef<HTMLDivElement>(null);
  const dotRef          = useRef<HTMLDivElement>(null);
  const crescentInnerRef = useRef<HTMLDivElement>(null);
  const svgRef          = useRef<SVGSVGElement>(null);
  const circleRef       = useRef<SVGCircleElement>(null);
  const arrowRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotWrap     = dotWrapRef.current;
    const cresWrap    = crescentWrapRef.current;
    const dot         = dotRef.current;
    const cresInner   = crescentInnerRef.current;
    const svg         = svgRef.current;
    const circle      = circleRef.current;
    const arrow       = arrowRef.current;
    if (!dotWrap || !cresWrap || !dot || !cresInner || !svg || !circle || !arrow) return;

    /* ── Mutable state — zero React re-renders ────────────── */
    let mouseX = -300, mouseY = -300;   // raw pointer coords
    let cresX  = -300, cresY  = -300;   // lerped crescent coords
    let rotDeg       = 0;
    let rotDegPerSec = ROT_DEFAULT;
    let lastTime     = 0;
    let visible      = false;
    let hoverState: HoverState = 'default';
    let onInput      = false;
    let raf          = 0;

    /* ── Helpers ──────────────────────────────────────────── */

    const showCursors = (on: boolean) => {
      const v = on ? '1' : '0';
      dot.style.opacity       = v;
      cresInner.style.opacity = v;
    };

    const setSize = (px: number) => {
      const half = px / 2;
      cresInner.style.width  = `${px}px`;
      cresInner.style.height = `${px}px`;
      cresInner.style.left   = `-${half}px`;
      cresInner.style.top    = `-${half}px`;
    };

    const applyHoverState = (next: HoverState) => {
      hoverState = next;
      switch (next) {
        case 'default':
          setSize(SIZE_DEFAULT);
          circle.style.stroke       = CHROME;
          dot.style.backgroundColor = CHROME;
          dot.style.width           = '4px';
          dot.style.height          = '4px';
          dot.style.left            = '-2px';
          dot.style.top             = '-2px';
          arrow.style.opacity       = '0';
          rotDegPerSec              = ROT_DEFAULT;
          break;

        case 'interactive':
          setSize(SIZE_INTERACTIVE);
          circle.style.stroke       = INK;
          dot.style.backgroundColor = CHROME;
          dot.style.width           = '4px';
          dot.style.height          = '4px';
          dot.style.left            = '-2px';
          dot.style.top             = '-2px';
          arrow.style.opacity       = '0';
          rotDegPerSec              = ROT_HOVER;
          break;

        case 'media':
          setSize(SIZE_MEDIA);
          circle.style.stroke       = CHROME;
          dot.style.backgroundColor = 'transparent';
          arrow.style.opacity       = '1';
          rotDegPerSec              = ROT_DEFAULT;
          break;
      }
    };

    /* ── rAF loop — crescent position + rotation only ─────── */
    const tick = (time: number) => {
      const dt = lastTime
        ? Math.min((time - lastTime) / 1000, 0.1)  // cap at 100 ms (tab switch)
        : 0;
      lastTime = time;

      // Lerp crescent toward mouse — translate3d forces GPU layer
      cresX += (mouseX - cresX) * LERP;
      cresY += (mouseY - cresY) * LERP;
      cresWrap.style.transform = `translate3d(${cresX}px,${cresY}px,0)`;

      // Continuous rotation via standalone `rotate` CSS property.
      // This never touches `transform`, so position lerp is never corrupted.
      rotDeg = (rotDeg + rotDegPerSec * dt) % 360;
      svg.style.rotate = `${rotDeg}deg`;

      raf = requestAnimationFrame(tick);
    };

    /* ── Event handlers ───────────────────────────────────── */

    // Dot: DIRECT update in mousemove — no rAF, no lerp, pixel-perfect.
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // translate3d → GPU compositing, avoids layout / paint
      dotWrap.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
      if (!visible) {
        visible = true;
        if (!onInput) showCursors(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const isInput  = !!t?.closest('input, textarea, select, [contenteditable]');
      const isMedia  = !!t?.closest('video, img');
      const isActive = !!t?.closest('a, button, [role="button"], [data-hover]');

      if (isInput !== onInput) {
        onInput = isInput;
        if (visible) showCursors(!isInput);
      }

      const next: HoverState = isMedia ? 'media' : isActive ? 'interactive' : 'default';
      if (next !== hoverState) applyHoverState(next);
    };

    // Mousedown: dot pulse + crescent colour flash
    const onDown = () => {
      dot.style.transform = 'scale(0.6)';
      const prev = circle.style.stroke;
      circle.style.stroke = INK;
      setTimeout(() => { circle.style.stroke = prev || CHROME; }, 200);
    };
    const onUp = () => { dot.style.transform = 'scale(1)'; };

    const onLeave = () => {
      visible = false;
      showCursors(false);
    };

    // mousemove for the dot (not pointermove — avoids duplicate pen/touch events)
    window.addEventListener('mousemove',   onMouseMove, { passive: true });
    window.addEventListener('pointerover', onOver,      { passive: true });
    window.addEventListener('pointerdown', onDown,      { passive: true });
    window.addEventListener('pointerup',   onUp,        { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',   onMouseMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup',   onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // CSS transitions: ONLY for visual state changes (opacity, size, colour).
  // NEVER include `transform` here — that would double-lag the position.
  const T = `300ms ${EASE_CIN}`;
  const sizeTransition    = `width ${T}, height ${T}, left ${T}, top ${T}`;
  const visTransition     = `opacity 500ms ${EASE_CIN}`;
  const dotTransition     = `opacity 500ms ${EASE_CIN}, transform 150ms ${EASE_CIN}, background-color ${T}`;
  const strokeTransition  = `stroke ${T}`;

  return (
    <>
      {/* ── Dot — instant, no blend mode, chrome fixed ──────── */}
      <div
        ref={dotWrapRef}
        aria-hidden
        className="luxury-cursor pointer-events-none fixed left-0 top-0 z-[10000]"
        style={{ willChange: 'transform' }}
      >
        <div
          ref={dotRef}
          style={{
            position:        'absolute',
            width:           4, height: 4,
            left:            -2, top: -2,
            borderRadius:    '50%',
            backgroundColor: CHROME,
            opacity:         0,
            transition:      dotTransition,
          }}
        />
      </div>

      {/* ── Crescent — lerp, mix-blend-mode: difference ─────── */}
      <div
        ref={crescentWrapRef}
        aria-hidden
        className="luxury-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: 'transform', mixBlendMode: 'difference' }}
      >
        {/* Size container — transitions on hover state change */}
        <div
          ref={crescentInnerRef}
          style={{
            position:   'absolute',
            width:      SIZE_DEFAULT,
            height:     SIZE_DEFAULT,
            left:       -(SIZE_DEFAULT / 2),
            top:        -(SIZE_DEFAULT / 2),
            opacity:    0,
            transition: `${visTransition}, ${sizeTransition}`,
          }}
        >
          {/*
            SVG crescent via mask:
              • Main circle: cx=18 cy=18 r=13
              • Bite circle: cx=24 cy=18 r=11 (overlaps from the right)
              Intersection points ≈ (25, 7) and (25, 29) — tips point right.
              The visible stroke is the left C-shaped arc (opening to the right).

            CSS `rotate` applied by JS in rAF — completely separate from
            the wrapper's `transform`, preventing any jitter.
          */}
          <svg
            ref={svgRef}
            viewBox="0 0 36 36"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            <defs>
              <mask id="luxcm">
                <rect width="36" height="36" fill="white" />
                <circle cx="24" cy="18" r="11" fill="black" />
              </mask>
            </defs>
            <circle
              ref={circleRef}
              cx="18" cy="18" r="13"
              fill="none"
              stroke={CHROME}
              strokeWidth="1.2"
              strokeLinecap="round"
              mask="url(#luxcm)"
              style={{ transition: strokeTransition }}
            />
          </svg>
        </div>

        {/* Arrow — replaces dot on media hover, centred on cursor point */}
        <div
          ref={arrowRef}
          style={{
            position:      'absolute',
            left:          0, top: 0,
            transform:     'translate(-50%, -50%)',
            opacity:       0,
            color:         CHROME,
            fontSize:      13,
            lineHeight:    1,
            fontFamily:    'var(--font-display)',
            letterSpacing: '0.05em',
            userSelect:    'none',
            transition:    `opacity 300ms ${EASE_CIN}`,
          }}
        >
          →
        </div>
      </div>
    </>
  );
}
