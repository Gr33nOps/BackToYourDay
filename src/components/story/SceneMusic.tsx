import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SongItem } from "@/lib/culture";
import { prefersReducedMotion } from "@/utils/motion";
import { PillTag } from "@/components/ui/PillTag";
import { sound } from "@/lib/sound";
import { Radio } from "lucide-react";

interface SceneMusicProps {
  songs: SongItem[];
  year: number;
}

function MiniEqualizer({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-1 h-5 shrink-0 px-1" aria-hidden="true">
      <span
        className={`w-1 rounded-full transition-all duration-300 ${
          active
            ? "bg-amber-400 animate-[pulse_0.7s_ease-in-out_infinite] h-4"
            : "bg-white/20 h-1.5"
        }`}
      />
      <span
        className={`w-1 rounded-full transition-all duration-300 ${
          active
            ? "bg-amber-400 animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-5"
            : "bg-white/20 h-3"
        }`}
      />
      <span
        className={`w-1 rounded-full transition-all duration-300 ${
          active
            ? "bg-amber-400 animate-[pulse_0.8s_ease-in-out_infinite_0.4s] h-3"
            : "bg-white/20 h-2"
        }`}
      />
      <span
        className={`w-1 rounded-full transition-all duration-300 ${
          active
            ? "bg-amber-400 animate-[pulse_0.6s_ease-in-out_infinite_0.1s] h-4"
            : "bg-white/20 h-2.5"
        }`}
      />
    </div>
  );
}

export function SceneMusic({ songs, year }: SceneMusicProps) {
  const [selected, setSelected] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!songs || songs.length === 0) return null;

  const displaySongs = songs.slice(0, 3);
  const currentSong = displaySongs[selected] || displaySongs[0];

  const handleSelect = (index: number) => {
    sound.playTick();
    setSelected(index);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const numBars = Math.floor(w / 7);
    const bars = Array.from({ length: numBars }, (_, i) => ({
      phase: (i / numBars) * Math.PI * 8 + Math.random() * Math.PI * 2,
      speed: 0.04 + Math.random() * 0.06,
      amp: 0.35 + Math.random() * 0.55,
    }));

    if (prefersReducedMotion()) {
      const barW = w / numBars;
      const centerY = h * 0.65;
      const maxH = h * 0.35;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const hue = 32 + (i / numBars) * 25;
        ctx.fillStyle = `hsla(${hue},80%,65%,0.15)`;
        ctx.fillRect(i * barW, centerY - height, barW - 1.5, height * 2);
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const barW = w / numBars;
      const centerY = h * 0.65;
      const maxH = h * 0.35;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        b.phase += b.speed;
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const hue = 32 + (i / numBars) * 25;
        const alpha = 0.08 + Math.abs(Math.sin(b.phase)) * 0.16;
        ctx.fillStyle = `hsla(${hue},80%,65%,${alpha})`;
        ctx.fillRect(i * barW, centerY - height, barW - 1.5, height * 2);
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
      {/* Blurred album art background synchronized with selected track */}
      <AnimatePresence mode="wait">
        {currentSong.albumArt && (
          <motion.div
            key={currentSong.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${currentSong.albumArt})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(40px) brightness(0.22) saturate(0.6)",
              transform: "scale(1.2)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-[1]"
      />

      {/* Atmospheric vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,7,0.95) 0%, transparent 40%, rgba(5,5,7,0.6) 100%)",
        }}
      />

      {/* Header with clearance below HUD */}
      <header className="relative z-10 pt-14 sm:pt-12 px-5 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <PillTag
            icon={<Radio className="w-3 h-3 text-accent" />}
            label="AIRWAVES"
            value={`${year} BILLBOARD`}
            dot
            dotColor="amber"
            variant="glass"
          />
        </div>
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/45">
          Top 3 Anthems
        </div>
      </header>

      {/* Main 3-Song Showcase: 1 page with all 3 songs and full visible names */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 max-w-3xl mx-auto w-full my-auto py-2 sm:py-4">
        <div className="w-full flex flex-col gap-2.5 sm:gap-3.5">
          {displaySongs.map((song, index) => {
            const isSelected = index === selected;
            return (
              <motion.button
                key={song.title}
                type="button"
                onClick={() => handleSelect(index)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2 }}
                aria-label={`Select #${index + 1} song: ${song.title} by ${song.artist}`}
                className={`group relative flex items-center justify-between gap-3 sm:gap-5 rounded-2xl p-2.5 sm:p-3.5 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.09] border-amber-400/60 shadow-[0_0_24px_rgba(229,169,60,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-amber-400/40"
                    : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20 opacity-90 hover:opacity-100"
                } border backdrop-blur-xl`}
              >
                {/* Left: Album cover with rank badge */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden shadow-lg bg-black/50">
                    <img
                      src={song.albumArt}
                      alt={song.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Rank badge overlay */}
                    <div className="absolute top-1 left-1">
                      <span
                        className={`inline-flex items-center justify-center font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-md shadow-md ${
                          index === 0
                            ? "bg-amber-500 text-black border border-amber-300"
                            : "bg-black/80 text-white/90 border border-white/20"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Title & Artist — FULL PROPER VISIBLE NAME (no truncate!) */}
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-accent/80 mb-0.5">
                      {index === 0 ? "Billboard #1" : `Rank #${index + 1}`} · {year}
                    </div>
                    <h3
                      className={`font-display font-bold leading-tight break-words text-xs sm:text-base md:text-lg ${
                        isSelected ? "text-amber-200" : "text-white"
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p className="font-mono text-[10px] sm:text-xs text-white/55 uppercase tracking-wider break-words mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {/* Right: Audio Equalizer animation */}
                <div className="flex items-center gap-2 shrink-0">
                  <MiniEqualizer active={isSelected} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Bottom hint with safe clearance above mobile nav */}
      <footer className="relative z-10 pb-16 sm:pb-12 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Tap any track to preview mood
        </span>
      </footer>
    </div>
  );
}
