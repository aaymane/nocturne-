export function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[41]"
      style={{
        background:
          'radial-gradient(108% 72% at 50% 50%, transparent 32%, rgba(0,0,0,calc(var(--vignette-strength) * 0.50)) 58%, rgba(0,0,0,calc(var(--vignette-strength) * 0.80)) 78%, rgba(0,0,0,calc(var(--vignette-strength))) 100%)',
      }}
    />
  );
}
