import { useState } from "react";
import { motion } from "framer-motion";
import { Telescope, ExternalLink } from "lucide-react";
import type { NasaApodData } from "@/lib/culture";
import { TiltPlate } from "@/components/ui/TiltPlate";

interface SceneApodProps {
  sky: NasaApodData;
  formattedDate: string;
}

export function SceneApod({ sky }: SceneApodProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallbackImg =
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80";
  const displayImage = hasError ? fallbackImg : sky.imageUrl;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      {/* Background blurred ambiance */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${displayImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px)",
        }}
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Telescope className="w-3 h-3 text-accent" />
          <span>Act IV · The Cosmos</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-xl w-full"
        >
          {/* Centered Space Telescope Specimen Plate */}
          <div className="w-64 sm:w-80 md:w-96 max-w-full">
            <TiltPlate maxTilt={6} className="w-full">
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 bg-[#0d0f15] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(229,169,60,0.18)] group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/80">
                  <img
                    src={displayImage}
                    alt={sky.title}
                    loading="eager"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setHasError(true);
                      setImageLoaded(true);
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="px-3 py-1.5 bg-[#0a0c12]/90 flex items-center justify-between border-t border-white/10">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                    {sky.constellationFocus || "Deep Space"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
              </div>
            </TiltPlate>
          </div>

          {/* Title */}
          <h2 className="font-display font-black text-white text-xl sm:text-3xl md:text-4xl leading-tight tracking-tight px-2">
            {sky.title}
          </h2>

          {/* Attribution / Copyright */}
          <div className="font-mono text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest">
            {sky.copyright ? `Captured by ${sky.copyright}` : "NASA / ESA Space Telescopes"}
          </div>

          {/* Full Res Link */}
          {(sky.hdUrl || sky.imageUrl) && imageLoaded && (
            <a
              href={sky.hdUrl || sky.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent/80 hover:text-accent transition-colors pt-1"
            >
              <span>View Full Resolution</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </motion.div>
      </div>

      {/* Bottom spacer for clearance above HUD */}
      <div className="shrink-0 mb-12 sm:mb-14" />
    </div>
  );
}
