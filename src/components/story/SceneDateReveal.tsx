import { motion } from "framer-motion";
import { BirthdayIdentity } from "@/lib/almanac";

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
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4 text-left"
    >
      {/* Top Archival Folio Reference */}
      <div className="flex items-center justify-between border-b border-surface-border pb-2.5 mb-4 sm:mb-8 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-foreground-dim">
        <div className="flex items-center gap-1.5 sm:gap-2 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>RECORD NO. {year}</span>
        </div>
        <span>CALENDAR CHRONOLOGY</span>
      </div>

      {/* Massive Date Headline & Narrative */}
      <div className="space-y-2.5 sm:space-y-4 mb-6 sm:mb-8">
        <p className="text-foreground-muted text-xs sm:text-base font-mono uppercase tracking-wider">
          Recorded on a <span className="text-white font-semibold">{weekday}</span>
        </p>

        <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.05]">
          {monthName} {day}, {year}
        </h1>

        <p className="text-foreground-muted text-sm sm:text-base lg:text-lg font-sans max-w-2xl leading-relaxed">
          You arrived <strong className="text-white font-medium">{yearsAgo} years ago</strong> into the historical record. In the skies above, the Sun traversed the sign of {identity?.western.name}, and the lunar calendar marked the Year of the {identity?.chinese.animal}.
        </p>
      </div>

      {/* Single Horizontal Archival Ledger Strip */}
      {identity && (
        <div className="border border-surface-border bg-surface/70 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-surface-border">
          <div className="p-3 sm:p-5 border-r md:border-r-0 border-surface-border">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Season
            </span>
            <span className="block font-display text-sm sm:text-lg font-bold text-white mt-1 truncate">
              {identity.metrics.season}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block truncate">
              hemisphere cycle
            </span>
          </div>

          <div className="p-3 sm:p-5">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Solar Sign
            </span>
            <span className="block font-display text-sm sm:text-lg font-bold text-white mt-1 truncate">
              {identity.western.name}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-accent mt-0.5 block truncate">
              {identity.western.element} Element
            </span>
          </div>

          <div className="p-3 sm:p-5 border-r md:border-r-0 border-surface-border">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Lunar Zodiac
            </span>
            <span className="block font-display text-sm sm:text-lg font-bold text-white mt-1 truncate">
              {identity.chinese.animal}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block truncate">
              {identity.chinese.element} &bull; {identity.chinese.polarity}
            </span>
          </div>

          <div className="p-3 sm:p-5">
            <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
              Temporal Span
            </span>
            <span className="block font-display text-sm sm:text-lg font-bold text-white mt-1 truncate">
              {yearsAgo} Solar Orbits
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-foreground-muted mt-0.5 block truncate">
              verified chronology
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

