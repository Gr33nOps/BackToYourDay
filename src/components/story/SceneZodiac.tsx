import { motion } from "framer-motion";
import { ZodiacGlyph } from "@/components/visuals/ZodiacGlyph";
import { TiltPlate } from "@/components/ui/TiltPlate";
import { WesternZodiac } from "@/lib/almanac";

interface SceneZodiacProps {
  zodiac: WesternZodiac;
}

export function SceneZodiac({ zodiac }: SceneZodiacProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 md:gap-12 items-center">
        {/* Left Column: Specimen Observation Plate with 3D Tilt */}
        <div className="md:col-span-5">
          <TiltPlate>
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 border border-surface-border bg-surface/60 relative">
              <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-foreground-dim border-b border-surface-border pb-2 mb-4 sm:mb-6">
                <span>PLATE I &bull; CELESTIAL</span>
                <span>SIG. {zodiac.symbol}</span>
              </div>

              <div className="relative my-2 sm:my-4 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[130px] h-[130px] sm:w-[210px] sm:h-[210px] rounded-full border border-surface-border border-dashed pointer-events-none"
                />
                <div className="absolute w-[105px] h-[105px] sm:w-[170px] sm:h-[170px] rounded-full border border-surface-border/50 pointer-events-none" />

                <div className="relative z-10 p-1 sm:p-2 text-white">
                  <div className="sm:hidden">
                    <ZodiacGlyph sign={zodiac.name} size={85} />
                  </div>
                  <div className="hidden sm:block">
                    <ZodiacGlyph sign={zodiac.name} size={110} />
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-3 sm:pt-4 border-t border-surface-border text-[10px] sm:text-[11px] font-mono text-foreground-muted">
                Solar House &bull; <span className="text-white font-medium">{zodiac.name}</span>
              </div>
            </div>
          </TiltPlate>
        </div>

        {/* Right Column: Left-Aligned Editorial Dossier */}
        <div className="md:col-span-7 text-left space-y-3.5 sm:space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold block">
              ASTRONOMICAL SIGN
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {zodiac.name}
            </h2>
            <p className="text-foreground-muted text-xs font-mono">
              Transit: {zodiac.dates}
            </p>
          </div>

          {/* Technical Ledger Strip */}
          <div className="grid grid-cols-3 border-t border-b border-surface-border py-2 sm:py-3 text-[11px] sm:text-xs font-mono divide-x divide-surface-border">
            <div className="pr-2 sm:pr-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Element</span>
              <span className="text-white font-semibold text-xs sm:text-sm">{zodiac.element}</span>
            </div>
            <div className="px-2 sm:px-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Ruling Body</span>
              <span className="text-white font-semibold text-xs sm:text-sm truncate block">{zodiac.traditionalRuler}</span>
            </div>
            <div className="pl-2 sm:pl-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Constellation</span>
              <span className="text-white font-semibold text-xs sm:text-sm truncate block">{zodiac.constellation}</span>
            </div>
          </div>

          {/* Narrative Lore */}
          <p className="text-foreground-muted text-xs sm:text-base leading-relaxed font-sans">
            {zodiac.rulerContext}
          </p>

          {zodiac.latinMotto && (
            <div className="pt-1 sm:pt-2">
              <span className="text-[10px] sm:text-xs font-mono text-foreground-dim uppercase tracking-wider block mb-0.5">
                Classical Motto
              </span>
              <p className="text-xs sm:text-sm font-mono italic text-accent">
                &ldquo;{zodiac.latinMotto}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

