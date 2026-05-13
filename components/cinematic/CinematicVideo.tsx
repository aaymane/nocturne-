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
}

export function CinematicVideo({
  src,
  poster,
  driftFrom = 1.05,
  driftDuration = 24,
  className = '',
}: CinematicVideoProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);           // sources injected only once
  const [playing, setPlaying] = useState(false); // drives the fade-in

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    // canplay fires once sources are loaded — triggers first play.
    const onCanPlay = () => tryPlay();
    video.addEventListener('canplay', onCanPlay, { once: true });

    // Ken Burns drift — yoyo so there's never a visible reset.
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

    // One observer handles both lazy loading (200 px early) and play/pause.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loadedRef.current) {
            // First entry: inject sources and trigger load.
            loadedRef.current = true;

            const webmEl = document.createElement('source');
            webmEl.src  = src.replace('.mp4', '.webm');
            webmEl.type = 'video/webm';
            video.appendChild(webmEl);

            const mp4El = document.createElement('source');
            mp4El.src  = src;
            mp4El.type = 'video/mp4';
            video.appendChild(mp4El);

            video.load(); // canplay → tryPlay
          } else {
            // Subsequent entries: resume.
            tryPlay();
          }
        } else {
          video.pause();
        }
      },
      // rootMargin starts loading 200 px before the element enters the viewport.
      { rootMargin: '200px 0px', threshold: 0 },
    );
    io.observe(video);

    return () => {
      tween.kill();
      io.disconnect();
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [src, driftFrom, driftDuration]);

  // Cinematic easing matches the design-system token.
  const fadeTransition = 'opacity 600ms cubic-bezier(0.16, 0.84, 0.30, 1)';

  return (
    <>
      {/* Poster / solid background — visible until the first frame plays. */}
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

      {/* Video — fades in on the `playing` event. Sources injected lazily. */}
      <video
        ref={videoRef}
        className={`scene-video ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        style={{ opacity: playing ? 1 : 0, transition: fadeTransition }}
        onPlaying={() => setPlaying(true)}
      >
        {/* <source> elements are appended at runtime by the IntersectionObserver. */}
      </video>
    </>
  );
}
