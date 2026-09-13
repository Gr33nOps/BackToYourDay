import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SimpleDatePicker } from "@/components/ui/SimpleDatePicker";
import { ActionButton } from "@/components/ui/ActionButton";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { FilmGrain } from "@/components/effects/FilmGrain";
import { sound } from "@/lib/sound";
import { ArrowRight } from "lucide-react";

interface LandingSceneProps {
  initialDate?: Date;
  onSubmit: (date: Date) => void;
}

export function LandingScene({ initialDate, onSubmit }: LandingSceneProps) {
  const [date, setDate] = useState<Date>(initialDate || new Date(1996, 5, 15));

  const weekdayName = useMemo(() => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }, [date]);

  const formattedDate = useMemo(() => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);

  const handleSubmit = () => {
    sound.playTick();
    onSubmit(date);
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col justify-between px-6 sm:px-12 md:px-16 py-10 select-none bg-canvas overflow-hidden">
      {/* Subtle Starfield Background */}
      <StarfieldBackground starCount={100} enableShootingStars={true} />

      {/* Procedural Film Grain Overlay */}
      <FilmGrain />

      {/* Top Ledger Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 border-b border-surface-border pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
            BACKTOYOURDAY
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-foreground-dim tracking-widest uppercase">
          HISTORICAL ALMANAC &bull; 1920 &ndash; PRESENT
        </span>
        <span className="sm:hidden font-mono text-[10px] text-foreground-dim tracking-widest uppercase">
          1920 &ndash; PRESENT
        </span>
      </header>

      {/* Main Asymmetric Content Area */}
      <main className="w-full max-w-6xl mx-auto z-10 my-auto py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 text-left space-y-6">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.04]">
              The world on the day you arrived.
            </h1>
            <p className="text-foreground-muted text-base sm:text-lg font-sans leading-relaxed max-w-xl">
              A chronological reconstruction of the exact calendar day you entered the world&mdash;the lunar phase in the night sky, the weather overhead, the number-one songs playing on radios, and the theatrical releases in cinema.
            </p>

            {/* Factual Record Indicators */}
            <div className="pt-6 border-t border-surface-border grid grid-cols-3 gap-6 text-xs font-mono text-foreground-dim">
              <div>
                <span className="text-white block font-semibold text-sm font-sans">100+ YEARS</span>
                <span>Historical Archive</span>
              </div>
              <div>
                <span className="text-white block font-semibold text-sm font-sans">EPHEMERIS</span>
                <span>Astronomical Math</span>
              </div>
              <div>
                <span className="text-white block font-semibold text-sm font-sans">CULTURE</span>
                <span>Music &amp; Cinema</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile Date Instrument Console */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border border-surface-border bg-surface/90 p-6 sm:p-8 space-y-6 shadow-2xl text-left"
            >
              {/* Target Date Feedback Header */}
              <div className="border-b border-surface-border pb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-dim block mb-1">
                  TARGET ARCHIVE DATE
                </span>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {formattedDate}
                </div>
                <div className="text-xs font-mono text-accent mt-1">
                  Recorded on a {weekdayName}
                </div>
              </div>

              {/* Date Inputs */}
              <SimpleDatePicker value={date} onChange={setDate} />

              {/* Action Button */}
              <ActionButton
                onClick={handleSubmit}
                className="w-full py-3.5 text-xs font-mono tracking-wider uppercase"
              >
                <span>Inspect The Archive</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </ActionButton>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Bottom Ledger Footer */}
      <footer className="w-full max-w-6xl mx-auto z-10 flex items-center justify-between border-t border-surface-border pt-4 text-[11px] font-mono text-foreground-dim uppercase tracking-wider">
        <span>Standard Record Epoch</span>
        <span className="hidden sm:inline">Astronomical, Meteorological &amp; Cultural Chronology</span>
        <span>Public Domain &bull; Almanac</span>
      </footer>
    </div>
  );
}

