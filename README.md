# Nocturne — A Cinematic Editorial

> Engineered for the night.
> A luxury interactive short film, built as a production-grade Next.js experience.

---

## Stack

- **Next.js 14** (App Router, TypeScript, React 18)
- **Tailwind CSS** with custom luxury design tokens
- **Lenis** — smooth scroll, tuned for cinematic deceleration (lerp 0.08, expo-out)
- **Framer Motion** — entrance choreography, scroll-driven parallax, the custom cursor's spring physics
- **GSAP** — slow Ken Burns drift on every video underlay
- **Three.js / React Three Fiber / Drei** — fixed WebGL atmosphere layer (floating dust, chrome reflection orb, pointer-driven camera drift)

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

## Project structure

```
nocturne/
├── app/
│   ├── layout.tsx              # root layout, fonts (Fraunces + Inter Tight), metadata
│   ├── page.tsx                # composes the four scenes + nav + footer
│   └── providers.tsx           # client-side: Lenis, loader, cursor, atmosphere
│
├── components/
│   ├── atmosphere/             # always-on visual layers
│   │   ├── GrainOverlay.tsx    # SVG-turbulence film grain
│   │   ├── Sheen.tsx           # slow diagonal "light on glass"
│   │   └── Vignette.tsx        # corner fall-off
│   │
│   ├── cinematic/              # reusable scene primitives
│   │   ├── CinematicVideo.tsx  # autoplay + GSAP Ken Burns + IO pause
│   │   ├── Reveal.tsx          # blur-to-clear IO reveal
│   │   └── Section.tsx         # scene shell (video + overlay + content layer)
│   │
│   ├── scenes/                 # the four chapters
│   │   ├── SceneHero.tsx       # Chapter 0  — "Engineered for the night."
│   │   ├── SceneDriver.tsx     # Chapter I  — "Luxury after midnight."
│   │   ├── SceneDetail.tsx     # Chapter II — "Crafted details."
│   │   └── SceneEditorial.tsx  # Chapter III — "Paris. Rain. Motion."
│   │
│   ├── three/
│   │   └── WebGLAtmosphere.tsx # R3F: dust + chrome orb + camera drift
│   │
│   └── ui/
│       ├── Footer.tsx
│       ├── Loader.tsx          # cinematic intro slate
│       ├── LuxuryCursor.tsx    # spring-damped, mix-blend-difference
│       └── Navigation.tsx      # transparent → blurred, Lenis-aware
│
├── lib/
│   ├── editorial.ts            # all copy, one place
│   ├── lenis-provider.tsx      # Lenis + React context
│   ├── use-reduced-motion.ts
│   └── use-smooth-pointer.ts   # lerp-damped pointer (-0.5..0.5)
│
├── public/
│   ├── videos/                 # scene-01..scene-04.mp4
│   └── images/                 # hero-poster.png
│
└── styles/
    └── globals.css             # Tailwind + atmospheric primitives
```

## Design system

| Token        | Value       | Use                                    |
|--------------|-------------|----------------------------------------|
| `night`      | `#050505`   | Background                             |
| `night-soft` | `#0a0a0a`   | Section variations                     |
| `ink`        | `#f5f5f5`   | Primary text                           |
| `ink-dim`    | `#9d9d9d`   | Secondary text                         |
| `ink-faint`  | `#5a5a5a`   | Micro / metadata text                  |
| `chrome`     | `#d8c9a8`   | Warm gold accent (italics, lines, rules) |

Typography:

- **Display** — Fraunces 300 (regular + italic), weighted toward italic for editorial emphasis
- **Sans** — Inter Tight 300/400/500, with `tracking-editorial` (0.32em) for uppercase labels

## Adding / changing a scene

1. Drop a new `.mp4` into `public/videos/`
2. Create `components/scenes/SceneYourName.tsx`, using `<Section>` + `<CinematicVideo>` as the shell
3. Add copy to `lib/editorial.ts` so it stays out of the component
4. Mount it from `app/page.tsx`

The `Reveal` component handles all entrance animation — pass `delay={ms}` to stagger.

## Performance notes

- Every `<CinematicVideo>` pauses when off-screen via `IntersectionObserver` (no decode work on hidden scenes)
- Lenis uses a single `requestAnimationFrame` loop; all scroll-driven transforms read from `useScroll` so they share that frame
- The WebGL canvas runs at `dpr=[1, 1.5]` and uses `MeshTransmissionMaterial` with `samples: 4` (visually rich, cheap)
- All motion respects `prefers-reduced-motion`; the WebGL canvas is *fully disabled* in that mode

## Notes on content

The brief originally referenced specific brand names visible in the uploaded footage. Per your follow-up instruction, **no trademarked brand names appear in any UI copy**. The site is presented as the editorial work of "Nocturne", a fictional studio. The videos are used purely as cinematic atmospheric assets.

## License

This is project scaffolding generated to your brief. Treat the code as yours; verify any media licensing before publishing.
