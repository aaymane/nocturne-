'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSmoothPointer } from '@/lib/use-smooth-pointer';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/**
 * Floating atmospheric particles. Tiny, soft, drifting slowly upward.
 * Like dust caught in a headlamp beam — visible only as subtle depth.
 *
 * pointsMaterial is unlit (no lights needed), additive blending brightens
 * highlights only, and the whole canvas is composited at low opacity via
 * mix-blend-mode: screen — so it adds atmosphere without introducing any
 * distinct shape or glow artifact.
 */
function AtmosphericDust({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const pointer = useSmoothPointer(0.04);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.018 + Math.random() * 0.032;
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const pos = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += speeds[i] * delta;
      pos[i3 + 0] += Math.sin(state.clock.elapsedTime * 0.18 + i) * 0.0007;

      if (pos[i3 + 1] > 5) {
        pos[i3 + 1] = -5;
        pos[i3 + 0] = (Math.random() - 0.5) * 14;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;

    pts.rotation.x = pointer.smoothed.y * 0.035;
    pts.rotation.y = pointer.smoothed.x * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        sizeAttenuation
        color="#c8baa0"
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function WebGLAtmosphere() {
  // mix-blend-mode: screen + AdditiveBlending particles can only add
  // brightness — structurally incompatible with a dark cinematic look.
  // Film grain (GrainOverlay) and CSS vignette handle texture and depth.
  void useReducedMotion;
  return null;
}
