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
  /** Filter override (sat/contrast/brightness). Defaults to the project's grade. */
  className?: string;
}

/**
 * Fullscreen cinematic video background.
 *
 * Behaviour:
 *  - autoplays muted + looped + playsInline (mobile-friendly)
 *  - performs a very slow scale drift via GSAP — Ken Burns simulation that
 *    sells "camera breathing" rather than the static feel of looped footage
 *  - pauses when offscreen via IntersectionObserver to conserve resources
 *  - inherits the project's color grade through the .scene-video class
 *
 * The drift is intentionally subtle (1.05 → 1.0 over 24s). Anything faster
 * reads as zoom; anything visible reads as cinematic camera presence.
 */
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

    // Slow scale drift — restarts on each loop iteration so the breathing
    // never visibly resets.
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

    // Visibility-driven playback. Pausing offscreen avoids decode work
    // and respects the user's bandwidth.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — silent fail, poster remains visible */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(video);

    return () => {
      tween.kill();
      io.disconnect();
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
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
