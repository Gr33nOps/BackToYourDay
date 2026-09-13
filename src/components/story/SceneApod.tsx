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
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/20 animate-pulse">
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

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : -16 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-8 sm:top-12 left-8 sm:left-14 z-10 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">NASA · {formattedDate}</span>
      </motion.div>

      {/* View full res link — top right */}
      {(sky.hdUrl || sky.imageUrl) && imageLoaded && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          href={sky.hdUrl || sky.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-8 sm:top-12 right-8 sm:right-14 z-10 flex items-center gap-1.5 cursor-pointer"
          style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-widest hover:text-white/60 transition-colors">Full Res</span>
        </motion.a>
      )}

      {/* Bottom: title + credit */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : 24 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 sm:bottom-12 left-8 sm:left-14 right-8 sm:right-14 z-10"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-2">
          {sky.constellationFocus || "Deep Space"}
        </div>
        <h2
          className="font-display font-black text-white leading-tight"
          style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)" }}
        >
          {sky.title}
        </h2>
        <div className="font-mono text-[10px] text-white/20 mt-2">
          {sky.copyright || "NASA / ESA Space Telescopes"}
        </div>
      </motion.div>
    </div>
  );
}
