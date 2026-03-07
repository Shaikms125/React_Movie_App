export function AuroraBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background: `
          radial-gradient(ellipse 85% 65% at 8% 8%, color-mix(in oklch, var(--primary) 42%, transparent), transparent 60%),
          radial-gradient(ellipse 75% 60% at 75% 35%, color-mix(in oklch, var(--secondary) 55%, transparent), transparent 62%),
          radial-gradient(ellipse 70% 60% at 15% 80%, color-mix(in oklch, var(--destructive) 40%, transparent), transparent 62%),
          radial-gradient(ellipse 70% 60% at 92% 92%, color-mix(in oklch, var(--ring) 45%, transparent), transparent 62%),
          linear-gradient(180deg, var(--background), var(--card))
        `,
      }}
    />
  );
}
