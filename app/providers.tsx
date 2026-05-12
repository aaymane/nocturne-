'use client';

import { type ReactNode } from 'react';
import { LenisProvider } from '@/lib/lenis-provider';
import { Loader } from '@/components/ui/Loader';
import { LuxuryCursor } from '@/components/ui/LuxuryCursor';
import { GrainOverlay } from '@/components/atmosphere/GrainOverlay';
import { Vignette } from '@/components/atmosphere/Vignette';
import { Sheen } from '@/components/atmosphere/Sheen';
import { WebGLAtmosphere } from '@/components/three/WebGLAtmosphere';

/**
 * Single client-component entry-point so that the server-rendered
 * <html>/<body> stay static, and all motion/interactivity boots
 * inside this tree.
 *
 * Order matters here:
 *  - Lenis lives at the root so every child can subscribe
 *  - WebGLAtmosphere sits BELOW grain/vignette (atmosphere stacks
 *    visually but z-indexes are set per-component, not by order)
 *  - LuxuryCursor lives ABOVE everything so it never gets occluded
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <Loader />
      <WebGLAtmosphere />
      <Sheen />
      <Vignette />
      <GrainOverlay />
      <LuxuryCursor />
      {children}
    </LenisProvider>
  );
}
