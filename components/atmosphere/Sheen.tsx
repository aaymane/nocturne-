export function Sheen() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[42] animate-sheen"
      style={{
        opacity: 0.18,
        background:
          'linear-gradient(115deg, transparent 36%, rgba(216,201,168,0.038) 50%, transparent 64%)',
        backgroundSize: '300% 300%',
      }}
    />
  );
}
