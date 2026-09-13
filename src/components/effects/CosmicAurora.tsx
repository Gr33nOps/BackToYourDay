interface CosmicAuroraProps {
  color?: string;
  variant?: "hero" | "zodiac" | "moon" | "gemstone" | "weather" | "cinema" | "music" | "universe";
  className?: string;
}

export function CosmicAurora({ className = "" }: CosmicAuroraProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {/* Subtle vignette radial mask keeping contrast ultra crisp in center */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-transparent to-canvas/80 pointer-events-none" />
      {/* Delicate warm archival amber radial wash at top */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-accent/5 filter blur-[120px] pointer-events-none" />
    </div>
  );
}
