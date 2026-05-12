export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-[-50%] z-40 h-[200%] w-[200%] animate-grain mix-blend-overlay"
      style={{
        opacity: 'var(--grain-opacity)',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.48 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}
