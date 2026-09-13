import { motion } from "framer-motion";
import { BirthdayIdentity } from "@/lib/almanac";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SceneDateRevealProps {
  monthName: string;
  day: number;
  year: number;
  weekday: string;
  identity?: BirthdayIdentity;
}

export function SceneDateReveal({
  monthName,
  day,
  year,
  weekday,
  identity,
}: SceneDateRevealProps) {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-4 text-left"
    >
      {/* Top Archival Folio Reference */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-8 text-[11px] font-mono uppercase tracking-widest text-foreground-dim">
        <div className="flex items-center gap-2 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>RECORD NO. {year}</span>
        </div>
        <span>CALENDAR CHRONOLOGY</span>
      </div>

      {/* Massive Date Headline & Narrative */}
      <div className="space-y-4 mb-8">
        <p className="text-foreground-muted text-sm sm:text-base font-mono uppercase tracking-wider">
          Recorded on a <span className="text-white font-semibold">{weekday}</span>
        </p>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[1.02]">
          {monthName} {day}, {year}
        </h1>

        <p className="text-foreground-muted text-base sm:text-lg font-sans max-w-2xl leading-relaxed">
          You arrived <strong className="text-white font-medium"><NumberTicker value={yearsAgo} delay={0.2} /> years ago</strong> into the historical record. In the skies above, the Sun traversed the sign of {identity?.western.name}, and the lunar calendar marked the Year of the {identity?.chinese.animal}.
        </p>
      </div>

      {/* Single Horizontal Archival Ledger Strip */}
      {identity && (
        <div className="border border-surface-border bg-surface/70 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-surface-border">
          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Season
            </span>
            <span className="block font-display text-base sm:text-lg font-bold text-white mt-1">
              {identity.metrics.season}
            </span>
            <span className="text-[11px] font-mono text-foreground-muted mt-0.5 block">
              hemisphere cycle
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Solar Sign
            </span>
            <span className="block font-display text-base sm:text-lg font-bold text-white mt-1">
              {identity.western.name}
            </span>
            <span className="text-[11px] font-mono text-accent mt-0.5 block">
              {identity.western.element} Element
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Lunar Zodiac
            </span>
            <span className="block font-display text-base sm:text-lg font-bold text-white mt-1">
              {identity.chinese.animal}
            </span>
            <span className="text-[11px] font-mono text-foreground-muted mt-0.5 block">
              {identity.chinese.element} &bull; {identity.chinese.polarity}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Temporal Span
            </span>
            <span className="block font-display text-base sm:text-lg font-bold text-white mt-1">
              {yearsAgo} Solar Orbits
            </span>
            <span className="text-[11px] font-mono text-foreground-muted mt-0.5 block">
              verified chronology
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

