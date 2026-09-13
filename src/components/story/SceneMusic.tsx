import { motion } from "framer-motion";
import { TiltPlate } from "@/components/ui/TiltPlate";
import type { SongItem } from "@/lib/culture";
import { Disc3 } from "lucide-react";

interface SceneMusicProps {
  songs: SongItem[];
  year: number;
}

export function SceneMusic({ songs, year }: SceneMusicProps) {
  if (!songs || songs.length === 0) return null;

  const topSong = songs[0];
  const runnerUps = songs.slice(1, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-4"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-surface-border pb-4 mb-8 text-left">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-1">
            BROADCAST ARCHIVE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Airwaves of {year}
          </h2>
        </div>
        <p className="text-foreground-muted text-xs font-mono mt-2 sm:mt-0 uppercase tracking-wide">
          Leading Radio Broadcasts of Your Birth Year
        </p>
      </div>

      {/* Asymmetric Chart Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
        {/* Primary Feature: #1 Radio Anthem with 3D Tilt */}
        <div className="md:col-span-7">
          <TiltPlate>
            <div className="flex flex-col sm:flex-row gap-6 p-5 border border-surface-border bg-surface/70">
              <div className="w-full sm:w-48 shrink-0 aspect-square overflow-hidden border border-surface-border bg-surface relative">
                <img
                  src={topSong.albumArt}
                  alt={`${topSong.title} by ${topSong.artist}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/90 border border-surface-border text-[10px] font-mono text-accent font-semibold">
                  #01 BROADCAST
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/80 border border-surface-border text-[10px] font-mono text-foreground-muted">
                  <Disc3 className="w-3 h-3 text-accent" />
                  <span>33⅓ RPM</span>
                </div>
              </div>

          <div className="flex flex-col justify-between py-1">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                NUMBER-ONE RECORD
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {topSong.title}
              </h3>
              <p className="text-sm font-sans text-accent font-medium">
                {topSong.artist}
              </p>
              <p className="text-xs font-sans text-foreground-muted leading-relaxed pt-1">
                The defining musical hit playing across commercial radio frequencies and domestic stereos during your arrival.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-surface-border text-[11px] font-mono text-foreground-dim">
              Format: <span className="text-white font-medium">Master Vinyl Single</span>
            </div>
          </div>
        </div>
      </TiltPlate>
    </div>

        {/* Secondary Records: #2 and #3 Chart Hits */}
        <div className="md:col-span-5 space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground-dim pb-1 border-b border-surface-border">
            TOP CHART RUNNERS-UP
          </div>

          {runnerUps.map((song, idx) => (
            <div
              key={song.title}
              className="flex gap-4 p-3.5 border border-surface-border bg-surface/40 hover:bg-surface/70 transition-colors"
            >
              <div className="w-16 shrink-0 aspect-square overflow-hidden border border-surface-border bg-surface relative">
                <img
                  src={song.albumArt}
                  alt={`${song.title} by ${song.artist}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center space-y-1 min-w-0">
                <div className="text-[10px] font-mono font-semibold text-accent">
                  NO. 0{idx + 2} ON AIRWAVES
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
                  {song.title}
                </h4>
                <p className="text-xs text-foreground-dim font-mono truncate">
                  {song.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


