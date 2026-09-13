import { motion } from "framer-motion";
import { MoonVisual } from "@/components/visuals/MoonVisual";
import { TiltPlate } from "@/components/ui/TiltPlate";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SceneMoonProps {
  moon: MoonPhaseInfo;
}

export function SceneMoon({ moon }: SceneMoonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Lunar Disk Observation Frame with 3D Tilt */}
        <div className="md:col-span-5">
          <TiltPlate>
            <div className="flex flex-col items-center justify-center p-8 border border-surface-border bg-surface/60 relative">
              <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-foreground-dim border-b border-surface-border pb-2.5 mb-6">
                <span>OBSERVATION PLATE &bull; LUNAR</span>
                <span>DAY {moon.ageDays}</span>
              </div>

              <div className="relative my-4 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <MoonVisual
                    illumination={moon.illumination}
                    phaseFraction={moon.phaseFraction}
                    isWaxing={moon.isWaxing}
                    size={190}
                  />
                </motion.div>
              </div>

              <div className="w-full text-center pt-4 border-t border-surface-border text-[11px] font-mono text-foreground-muted">
                Surface Illumination: <span className="text-white font-medium">{moon.illumination}%</span>
              </div>
            </div>
          </TiltPlate>
        </div>

        {/* Right Column: Left-Aligned Astronomical Log */}
        <div className="md:col-span-7 text-left space-y-5">
          <div className="space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
              NIGHT SKY EPHEMERIS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {moon.phaseName}
            </h2>
            <div className="text-accent text-sm font-mono uppercase tracking-wider font-semibold">
              <NumberTicker value={moon.illumination} delay={0.2} />% illuminated lunar disk
            </div>
          </div>

          {/* Narrative Astronomical Record */}
          <p className="text-foreground-muted text-sm sm:text-base leading-relaxed font-sans">
            On the night you entered the world, the lunar body was{" "}
            <strong className="text-white font-medium">
              {moon.isWaxing ? "waxing toward maximum radiance" : "waning toward shadow"}
            </strong>
            , positioned at day {moon.ageDays} of the continuous 29.53-day synodic cycle.
          </p>

          {/* Technical Ledger Strip */}
          <div className="grid grid-cols-3 border-t border-b border-surface-border py-3 text-xs font-mono divide-x divide-surface-border">
            <div className="pr-3">
              <span className="text-[10px] text-foreground-dim block uppercase">Trajectory</span>
              <span className="text-white font-semibold text-sm">{moon.isWaxing ? "Waxing" : "Waning"}</span>
            </div>
            <div className="px-3">
              <span className="text-[10px] text-foreground-dim block uppercase">Synodic Age</span>
              <span className="text-white font-semibold text-sm">{moon.ageDays} days</span>
            </div>
            <div className="pl-3">
              <span className="text-[10px] text-foreground-dim block uppercase">Cycle Progress</span>
              <span className="text-white font-semibold text-sm">{Math.round(moon.phaseFraction * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

