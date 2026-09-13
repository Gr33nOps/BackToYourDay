import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SceneDaysLivedProps {
  daysLived: number;
  identity?: BirthdayIdentity;
}

export function SceneDaysLived({ daysLived, identity }: SceneDaysLivedProps) {
  const breathsTakenM = Math.round((daysLived * 20000) / 1_000_000);
  const galacticKmBillion = Math.round((daysLived * 2.3) / 100) / 10;
  const approximateHeartbeatsM = identity
    ? Math.round(identity.metrics.approximateHeartbeats / 1_000_000)
    : Math.round((daysLived * 100000) / 1_000_000);
  const solarOrbits = identity
    ? identity.metrics.earthOrbits
    : Math.floor(daysLived / 365.25);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4 text-left"
    >
      {/* Header & Colossal Headline */}
      <div className="border-b border-surface-border pb-4 sm:pb-8 mb-4 sm:mb-8 space-y-2 sm:space-y-4">
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold block">
          TEMPORAL PASSAGE
        </span>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
          <div className="font-display text-5xl xs:text-6xl sm:text-9xl md:text-[9.5rem] font-bold tracking-tighter text-white tabular-nums leading-none">
            <NumberTicker value={daysLived} delay={0.15} />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-4xl font-bold text-white tracking-tight">
              Days on Earth
            </h2>
            <p className="text-foreground-muted text-xs sm:text-base font-sans mt-1 sm:mt-2 max-w-md leading-relaxed">
              You have lived through {solarOrbits} complete revolutions around the Sun, drawing roughly {breathsTakenM} million breaths while journeying {galacticKmBillion} billion kilometers through interstellar space.
            </p>
          </div>
        </div>
      </div>

      {/* Single Horizontal Milestone Ledger */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-surface-border bg-surface/80 divide-y md:divide-y-0 md:divide-x divide-surface-border">
        {/* Heartbeats */}
        <div className="p-3 sm:p-5 border-r md:border-r-0 border-surface-border">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-foreground-dim uppercase mb-1">
            Cardiac Pulses
          </div>
          <div className="font-display text-lg sm:text-3xl font-bold text-white tabular-nums">
            ~<NumberTicker value={approximateHeartbeatsM} delay={0.2} /><span className="text-accent ml-0.5 text-sm sm:text-base font-mono">M</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block">
            estimated heartbeats
          </span>
        </div>

        {/* Solar Orbits */}
        <div className="p-3 sm:p-5">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-foreground-dim uppercase mb-1">
            Solar Returns
          </div>
          <div className="font-display text-lg sm:text-3xl font-bold text-white tabular-nums">
            <NumberTicker value={solarOrbits} delay={0.2} /><span className="text-accent ml-0.5 text-sm sm:text-base font-mono">×</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block">
            orbital cycles
          </span>
        </div>

        {/* Respiration */}
        <div className="p-3 sm:p-5 border-r md:border-r-0 border-surface-border">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-foreground-dim uppercase mb-1">
            Respiration
          </div>
          <div className="font-display text-lg sm:text-3xl font-bold text-white tabular-nums">
            ~<NumberTicker value={breathsTakenM} delay={0.2} /><span className="text-accent ml-0.5 text-sm sm:text-base font-mono">M</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block">
            breaths drawn
          </span>
        </div>

        {/* Galactic Transit */}
        <div className="p-3 sm:p-5">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-wider text-foreground-dim uppercase mb-1">
            Galactic Voyage
          </div>
          <div className="font-display text-lg sm:text-3xl font-bold text-white tabular-nums">
            {galacticKmBillion}<span className="text-accent ml-0.5 text-sm sm:text-base font-mono">B</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block">
            km through cosmos
          </span>
        </div>
      </div>

      {/* Subdued Footer Note */}
      {identity && (
        <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[11px] sm:text-xs font-mono text-foreground-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span>
            Next solar return occurs in <strong className="text-white font-medium">{identity.metrics.daysUntilNextBirthday}</strong> calendar days.
          </span>
        </div>
      )}
    </motion.div>
  );
}


