import { motion } from "framer-motion";
import { BotanicalVisual } from "@/components/visuals/BotanicalVisual";
import { TiltPlate } from "@/components/ui/TiltPlate";
import type { BirthBotanicals } from "@/lib/almanac";

interface SceneBotanicalProps {
  botanicals: BirthBotanicals;
}

export function SceneBotanical({ botanicals }: SceneBotanicalProps) {
  const flower = botanicals.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 md:gap-12 items-center">
        {/* Left Column: Specimen Herbarium Plate with 3D Tilt */}
        <div className="md:col-span-5">
          <TiltPlate>
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 border border-surface-border bg-surface/60 relative">
              <div className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-foreground-dim border-b border-surface-border pb-2 mb-4 sm:mb-6">
                <span>PLATE III &bull; FLORIOGRAPHY</span>
                <span>HERBARIUM</span>
              </div>

              <div className="relative my-2 sm:my-4 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <div className="sm:hidden">
                    <BotanicalVisual name={flower.name} size={130} />
                  </div>
                  <div className="hidden sm:block">
                    <BotanicalVisual name={flower.name} size={180} />
                  </div>
                </motion.div>
              </div>

              <div className="w-full text-center pt-3 sm:pt-4 border-t border-surface-border text-[10px] sm:text-[11px] font-mono text-foreground-muted">
                Botanical Plate &bull; <span className="text-white font-medium">{flower.name}</span>
              </div>
            </div>
          </TiltPlate>
        </div>

        {/* Right Column: Editorial Dossier */}
        <div className="md:col-span-7 text-left space-y-3.5 sm:space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold block">
              BOTANICAL EMBLEM
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {flower.name}
            </h2>
            <p className="text-foreground-muted text-xs font-mono">
              Symbolic Meaning: <span className="text-accent">{flower.meaning}</span>
            </p>
          </div>

          {/* Technical Ledger Strip */}
          <div className="grid grid-cols-2 border-t border-b border-surface-border py-2 sm:py-3 text-[11px] sm:text-xs font-mono divide-x divide-surface-border">
            <div className="pr-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Tradition</span>
              <span className="text-white font-semibold text-xs sm:text-sm">Language of Flowers</span>
            </div>
            <div className="pl-3">
              <span className="text-[9px] sm:text-[10px] text-foreground-dim block uppercase">Attribute</span>
              <span className="text-white font-semibold text-xs sm:text-sm">{flower.meaning}</span>
            </div>
          </div>

          {/* Narrative Lore */}
          <p className="text-foreground-muted text-xs sm:text-base leading-relaxed font-sans">
            In classical floriography, the {flower.name} has long represented enduring {flower.meaning.toLowerCase()}, bringing grace and distinction to those born in this season.
          </p>

          {botanicals.secondary && (
            <div className="pt-1 sm:pt-2">
              <span className="text-[10px] sm:text-xs font-mono text-foreground-dim uppercase tracking-wider block mb-0.5">
                Companion Bloom
              </span>
              <p className="text-xs sm:text-sm font-sans text-white">
                Paired with <span className="font-medium text-accent">{botanicals.secondary.name}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

