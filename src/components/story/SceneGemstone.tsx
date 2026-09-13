import { motion } from "framer-motion";
import { GemstoneVisual } from "@/components/visuals/GemstoneVisual";
import { TiltPlate } from "@/components/ui/TiltPlate";
import { BirthstoneInfo } from "@/lib/almanac";

interface SceneGemstoneProps {
  birthstone: BirthstoneInfo;
}

export function SceneGemstone({ birthstone }: SceneGemstoneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 md:gap-12 items-center">
        {/* Left Column: Specimen Plate with 3D Tilt */}
        <div className="md:col-span-5">
          <TiltPlate>
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 border border-surface-border bg-surface/60 relative">
              <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-foreground-dim border-b border-surface-border pb-2 mb-4 sm:mb-6">
                <span>PLATE II &bull; MINERALOGY</span>
                <span>TYPE #{birthstone.primary.slice(0, 3).toUpperCase()}</span>
              </div>

              <div className="relative my-2 sm:my-4 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <div className="sm:hidden">
                    <GemstoneVisual
                      name={birthstone.primary}
                      colorHex="#e5a93c"
                      size={125}
                    />
                  </div>
                  <div className="hidden sm:block">
                    <GemstoneVisual
                      name={birthstone.primary}
                      colorHex="#e5a93c"
                      size={170}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="w-full text-center pt-3 sm:pt-4 border-t border-surface-border text-[10px] sm:text-[11px] font-mono text-foreground-muted">
                Mineral Specimen &bull; <span className="text-white font-medium">{birthstone.primary}</span>
              </div>
            </div>
          </TiltPlate>
        </div>

        {/* Right Column: Editorial Dossier */}
        <div className="md:col-span-7 text-left space-y-3.5 sm:space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold block">
              EARTH TALISMAN
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {birthstone.primary}
            </h2>
            <p className="text-foreground-muted text-xs font-mono">
              Recorded Birthstone Specimen
            </p>
          </div>

          {/* Technical Ledger Strip */}
          <div className="grid grid-cols-2 border-t border-b border-surface-border py-2 sm:py-3 text-[11px] sm:text-xs font-mono divide-x divide-surface-border">
            <div className="pr-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Classification</span>
              <span className="text-white font-semibold text-xs sm:text-sm">Natural Gemstone</span>
            </div>
            <div className="pl-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Tradition</span>
              <span className="text-white font-semibold text-xs sm:text-sm">Gregorian Almanac</span>
            </div>
          </div>

          {/* Narrative Lore */}
          <p className="text-foreground-muted text-xs sm:text-base leading-relaxed font-sans">
            {birthstone.lore}
          </p>

          {birthstone.alternate && (
            <div className="pt-1 sm:pt-2">
              <span className="text-[10px] sm:text-xs font-mono text-foreground-dim uppercase tracking-wider block mb-0.5">
                Alternate Mineral Form
              </span>
              <p className="text-xs sm:text-sm font-sans text-white">
                Historical record also recognizes{" "}
                <span className="font-medium text-accent">{birthstone.alternate}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

