import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SongItem } from "@/lib/culture";
import { prefersReducedMotion } from "@/utils/motion";
import { sound } from "@/lib/sound";
import { Disc3 } from "lucide-react";

interface SceneMusicProps {
  songs: SongItem[];
  year: number;
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

    const numBars = Math.floor(w / 8);
    const bars = Array.from({ length: numBars }, (_, i) => ({
      phase: (i / numBars) * Math.PI * 8 + Math.random() * Math.PI * 2,
      speed: 0.04 + Math.random() * 0.06,
      amp: 0.35 + Math.random() * 0.55,
    }));

    if (prefersReducedMotion()) {
      const barW = w / numBars;
      const centerY = h * 0.75;
      const maxH = h * 0.25;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        ctx.fillStyle = `rgba(229,169,60,0.12)`;
        ctx.fillRect(i * barW, centerY - height, barW - 1.5, height * 2);
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const barW = w / numBars;
      const centerY = h * 0.75;
      const maxH = h * 0.25;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        b.phase += b.speed;
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const alpha = 0.06 + Math.abs(Math.sin(b.phase)) * 0.14;
        ctx.fillStyle = `rgba(229,169,60,${alpha})`;
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
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      {/* Background blurred ambiance */}
      <AnimatePresence mode="wait">
        {currentSong.albumArt && (
          <motion.div
            key={currentSong.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${currentSong.albumArt})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(55px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Disc3 className="w-3 h-3 text-accent" />
          <span>Act VII · The Anthem</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-xl w-full"
          >
            {/* Centered Vinyl Record with spinning album center */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
              {/* Vinyl outer disc */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full bg-[#111115] border-4 border-[#222228] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(229,169,60,0.2)] flex items-center justify-center relative overflow-hidden"
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-2 rounded-full border border-white/5" />
                <div className="absolute inset-5 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-11 rounded-full border border-white/5" />

                {/* Album Art Center Label */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-inner relative z-10 bg-black">
                  {currentSong.albumArt ? (
                    <img
                      src={currentSong.albumArt}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <Disc3 className="w-8 h-8 text-accent" />
                    </div>
                  )}
                  {/* Center spindle hole */}
                  <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#060608] border border-amber-400/60 shadow" />
                </div>
              </motion.div>
            </div>

            {/* Song Title */}
            <h2 className="font-display font-black text-white text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight px-2">
              {currentSong.title}
            </h2>

            {/* Artist */}
            <div className="font-serif font-bold text-accent text-lg sm:text-xl">
              {currentSong.artist}
            </div>

            {/* Billboard Rank Tag */}
            <div className="font-mono text-xs text-white/50 uppercase tracking-widest">
              #{selected + 1} Billboard Hot 100 · {year}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Selector Pills */}
      {displaySongs.length > 1 && (
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-2 shrink-0 mb-12 sm:mb-14 px-2 relative z-10">
          {displaySongs.map((song, idx) => {
            const isSelected = idx === selected;
            return (
              <button
                key={song.title}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-3 py-1 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-accent text-black font-bold shadow-[0_0_12px_rgba(229,169,60,0.5)]"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white border border-white/10"
                }`}
              >
                #{idx + 1} {song.title.slice(0, 16)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
