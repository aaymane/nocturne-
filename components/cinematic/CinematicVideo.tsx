'use client';

import { useEffect, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    // Play as soon as there's enough data — don't wait for IntersectionObserver.
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    // Slow Ken Burns drift — yoyo so there's never a visible reset.
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

    // Pause when significantly offscreen to conserve decode budget.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(video);

    return () => {
      tween.kill();
      io.disconnect();
      video.removeEventListener('canplay', tryPlay);
    };
  }, [driftFrom, driftDuration]);

  return (
    <video
      ref={videoRef}
      className={`scene-video ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
