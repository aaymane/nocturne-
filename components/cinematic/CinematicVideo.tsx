'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CinematicVideoProps {
  src: string;
  poster?: string;
  /** Initial scale; the video drifts FROM this scale up to 1 over `driftDuration`. */
  driftFrom?: number;
  /** Drift duration in seconds. Long, slow — never under 20. */
  driftDuration?: number;
  className?: string;
  /**
   * Skip lazy loading entirely — attach sources at mount and start loading
   * immediately. Use for above-the-fold videos (scene-01 hero).
   */
  priority?: boolean;
}

export function CinematicVideo({
  src,
  poster,
  driftFrom = 1.05,
  driftDuration = 24,
  className = '',
  priority = false,
}: CinematicVideoProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    const onCanPlay = () => tryPlay();
    video.addEventListener('canplay', onCanPlay, { once: true });

    const tween = gsap.fromTo(
      video,
      { scale: driftFrom },
      {
        scale: 1,
        duration: driftDuration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      },
    );

    const injectSources = () => {
      const webmEl = document.createElement('source');
      webmEl.src  = src.replace('.mp4', '.webm');
      webmEl.type = 'video/webm';
      video.appendChild(webmEl);

      const mp4El = document.createElement('source');
      mp4El.src  = src;
      mp4El.type = 'video/mp4';
      video.appendChild(mp4El);

      video.load();
    };

    if (priority) {
      // Above-the-fold: inject sources immediately, no lazy load guard.
      injectSources();

      // Only manage play/pause by visibility once sources are loaded.
      const visObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        },
        { threshold: 0, rootMargin: '0px' },
      );
      visObserver.observe(video);

      return () => {
        tween.kill();
        visObserver.disconnect();
        video.removeEventListener('canplay', onCanPlay);
      };
    }

    // ── Lazy path: two separate observers ─────────────────────────────────

    // Observer 1 — starts loading well before the section enters the viewport,
    // so the video is ready to play by the time the user scrolls to it.
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadedRef.current) return;
        loadedRef.current = true;
        injectSources();
      },
      { rootMargin: '1500px 0px 1500px 0px', threshold: 0 },
    );

    // Observer 2 — controls actual play/pause at the moment of visual entry.
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.25, rootMargin: '0px' },
    );

    loadObserver.observe(video);
    playObserver.observe(video);

    return () => {
      tween.kill();
      loadObserver.disconnect();
      playObserver.disconnect();
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [src, driftFrom, driftDuration, priority]);

  const fadeTransition = 'opacity 600ms cubic-bezier(0.16, 0.84, 0.30, 1)';

  return (
    <>
      {/* Poster — solid background visible until the first frame plays. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#050505',
          backgroundImage: poster ? `url(${poster})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: playing ? 0 : 1,
          transition: fadeTransition,
        }}
      />

      {/* Sources injected lazily or at mount (priority). */}
      <video
        ref={videoRef}
        className={`scene-video ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? 'auto' : 'none'}
        style={{ opacity: playing ? 1 : 0, transition: fadeTransition }}
        onPlaying={() => setPlaying(true)}
      >
        {/* <source> elements appended at runtime by the IntersectionObserver. */}
      </video>
    </>
  );
}
