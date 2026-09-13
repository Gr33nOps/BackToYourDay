import { useState } from "react";
import { motion } from "framer-motion";
import type { NasaApodData } from "@/lib/culture";

interface SceneApodProps {
  sky: NasaApodData;
  formattedDate: string;
}

export function SceneApod({ sky, formattedDate }: SceneApodProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col justify-end items-center p-4 sm:p-8 md:p-12 text-center select-none overflow-hidden">
      {/* Full-bleed NASA Deep Space Imagery with subtle drift */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={sky.imageUrl}
          alt={sky.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className={`w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Archival dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-canvas/20 pointer-events-none" />
      </div>

      {/* Museum Placard Caption Panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 w-full max-w-xl mb-4 sm:mb-6"
      >
        <div className="p-5 sm:p-6 text-center space-y-2.5 bg-canvas/90 backdrop-blur-md border border-surface-border rounded-xl">
          {/* Category Marker */}
          <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Archival Plate &bull; NASA Deep Space</span>
          </div>

          {/* NASA Title */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-snug">
            {sky.title}
          </h2>

          {/* Description */}
          <p className="text-foreground-muted text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The celestial vista cataloged on record for {formattedDate}.
          </p>

          {/* Metadata */}
          {sky.copyright && (
            <div className="pt-2.5 border-t border-surface-border text-[11px] font-mono text-foreground-dim">
              Photograph &copy; {sky.copyright}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
