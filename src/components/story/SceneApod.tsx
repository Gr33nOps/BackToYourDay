import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { NasaApodData } from "@/lib/culture";

interface SceneApodProps {
  sky: NasaApodData;
  formattedDate: string;
}

export function SceneApod({ sky, formattedDate }: SceneApodProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallbackImg = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80";
  const displayImage = hasError ? fallbackImg : sky.imageUrl;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Full-bleed image with Ken Burns zoom */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#050507] flex items-center justify-center z-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Loading…
          </div>
        </div>
      )}

      <motion.img
        src={displayImage}
        alt={sky.title}
        loading="eager"
        onLoad={() => setImageLoaded(true)}
        onError={() => { setHasError(true); setImageLoaded(true); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
        style={{ transformOrigin: "center center" }}
      />

      {/* Vignette — only top + bottom */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(5,5,7,0.55) 0%, transparent 25%, transparent 70%, rgba(5,5,7,0.8) 100%)" }}
      />

      {/* Top label with clearance below HUD */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : -16 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-14 sm:top-12 left-6 sm:left-14 z-10 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/60">NASA · {formattedDate}</span>
      </motion.div>

      {/* View full res link — top right with clearance below HUD */}
      {(sky.hdUrl || sky.imageUrl) && imageLoaded && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          href={sky.hdUrl || sky.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-14 sm:top-12 right-6 sm:right-14 z-10 flex items-center gap-1.5 cursor-pointer text-white/50 hover:text-white/80 transition-colors px-2 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm"
          style={{ textDecoration: "none" }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Full Res</span>
        </motion.a>
      )}

      {/* Bottom: title + credit with clearance above mobile nav */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : 24 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-16 sm:bottom-12 left-6 sm:left-14 right-6 sm:right-14 z-10"
      >
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50 mb-1 sm:mb-2">
          {sky.constellationFocus || "Deep Space"}
        </div>
        <h2
          className="font-display font-black text-white leading-tight"
          style={{ fontSize: "clamp(1.3rem, 4.5vw, 3.8rem)" }}
        >
          {sky.title}
        </h2>
        <div className="font-mono text-[10px] sm:text-[11px] text-white/45 mt-1 sm:mt-2">
          {sky.copyright || "NASA / ESA Space Telescopes"}
        </div>
      </motion.div>
    </div>
  );
}
