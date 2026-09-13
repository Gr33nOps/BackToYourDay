import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Compass, Sparkles, Eye } from "lucide-react";
import type { NasaApodData } from "@/lib/culture";

interface SceneApodProps {
  sky: NasaApodData;
  formattedDate: string;
}

export function SceneApod({ sky, formattedDate }: SceneApodProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reliable fallback image if NASA APOD fails or returns non-image
  const fallbackImg =
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80";
  const displayImage = hasError ? fallbackImg : sky.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto select-none px-2 sm:px-4 text-left"
    >
      {/* Museum Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3 sm:pb-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>ARCHIVAL PLATE NO. 07 &bull; DEEP SPACE OBSERVATION</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground-dim">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>NASA CELESTIAL ARCHIVE</span>
        </div>
      </div>

      {/* Main Responsive Grid: Viewport + Archival Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        {/* Left Column: Framed Observatory Telescope Viewport */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/3] w-full rounded-xl overflow-hidden border border-surface-border bg-canvas-subtle shadow-2xl group">
            {/* Loading shimmer placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-surface animate-pulse flex items-center justify-center">
                <span className="font-mono text-xs text-foreground-dim uppercase tracking-widest">
                  Calibrating Telescope Optics...
                </span>
              </div>
            )}

            {/* High-Resolution Cosmic Photo with Subtle Drift */}
            <motion.img
              src={displayImage}
              alt={sky.title}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setHasError(true);
                setImageLoaded(true);
              }}
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className={`w-full h-full object-cover object-center filter brightness-95 contrast-[1.05] transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Subtle Vignette Gradient around edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-canvas/40 pointer-events-none" />

            {/* Telescope Reticle Crosshairs (Corner brackets) */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent/60 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent/60 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent/60 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent/60 pointer-events-none" />

            {/* Live Observation Badge */}
            <div className="absolute top-3 left-3 pl-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TELESCOPE VIEWPORT</span>
            </div>

            {/* Open Full Resolution Link */}
            {(sky.hdUrl || sky.imageUrl) && (
              <a
                href={sky.hdUrl || sky.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 pr-3 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[10px] font-mono text-foreground hover:text-white transition-all cursor-pointer shadow-lg"
                title="Inspect original high-resolution capture"
              >
                <Eye className="w-3 h-3 text-accent" />
                <span>Full Res</span>
                <ExternalLink className="w-2.5 h-2.5 text-foreground-dim" />
              </a>
            )}

            {/* Bottom Telemetry Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between text-[10px] font-mono text-foreground-muted bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-accent" />
                <span className="text-white font-medium">FIELD: {sky.constellationFocus || "DEEP SPACE"}</span>
              </div>
              <span className="text-foreground-dim uppercase">OPTICAL / INFRARED</span>
            </div>
          </div>

          {/* Copyright attribution under image */}
          <div className="flex items-center justify-between text-[10px] font-mono text-foreground-dim px-1">
            <span>Captured by {sky.copyright || "NASA / ESA Space Telescopes"}</span>
            <span className="hidden sm:inline">Archival Ephemeris</span>
          </div>
        </div>

        {/* Right Column: Title, NASA Explanation & Metadata Ledger */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Title & Tagline */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-accent font-semibold block">
              COSMIC PHENOMENON
            </span>
            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {sky.title}
            </h1>
          </div>

          {/* NASA Official Scientific Explanation */}
          <div className="bg-surface/60 border border-surface-border rounded-lg p-3.5 sm:p-4">
            <h3 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-foreground-dim mb-1.5 flex items-center gap-1.5">
              <span>Scientific Explanation</span>
            </h3>
            <p className="text-foreground-muted text-xs sm:text-sm font-sans leading-relaxed">
              {sky.explanation || `The celestial vista cataloged on record for ${formattedDate}.`}
            </p>
          </div>

          {/* 2x2 Archival Metadata Ledger */}
          <div className="border border-surface-border bg-surface/70 grid grid-cols-2 divide-x divide-y divide-surface-border">
            {/* Observation Date */}
            <div className="p-2.5 sm:p-3">
              <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                Record Date
              </span>
              <span className="block font-display text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                {formattedDate}
              </span>
            </div>

            {/* Constellation / Target */}
            <div className="p-2.5 sm:p-3">
              <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                Constellation
              </span>
              <span className="block font-display text-xs sm:text-sm font-bold text-accent mt-0.5 truncate">
                {sky.constellationFocus || "Deep Cosmos"}
              </span>
            </div>

            {/* Source */}
            <div className="p-2.5 sm:p-3">
              <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                Catalog Source
              </span>
              <span className="block font-mono text-[10px] sm:text-xs text-white mt-0.5 truncate">
                {sky.isArchivalFallback ? "NASA Deep Sky" : "NASA APOD"}
              </span>
            </div>

            {/* Credit */}
            <div className="p-2.5 sm:p-3">
              <span className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                Observatory
              </span>
              <span className="block font-mono text-[10px] sm:text-xs text-foreground-muted mt-0.5 truncate">
                {sky.copyright || "NASA / STScI"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
