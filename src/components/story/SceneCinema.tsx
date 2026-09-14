import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieItem } from "@/lib/culture";
import { TiltPlate } from "@/components/ui/TiltPlate";
import { sound } from "@/lib/sound";
import { Film } from "lucide-react";

interface SceneCinemaProps {
  movies: MovieItem[];
  year: number;
}

export function SceneCinema({ movies, year }: SceneCinemaProps) {
  const [selected, setSelected] = useState(0);
  if (!movies || movies.length === 0) return null;

  const displayMovies = movies.slice(0, 3);
  const current = displayMovies[selected] || displayMovies[0];

  const handleSelect = (index: number) => {
    sound.playTick();
    setSelected(index);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      {/* Blurred background ambiance */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${current.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(50px)",
          }}
        />
      </AnimatePresence>

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Film className="w-3 h-3 text-accent" />
          <span>Act VI · The Cinema</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-xl w-full"
          >
            {/* Centered Movie Poster with 3D Tilt */}
            <div className="w-44 sm:w-52 md:w-60 max-w-full">
              <TiltPlate maxTilt={6} className="w-full">
                <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 bg-[#0d0f15] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(229,169,60,0.18)] group">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/80">
                    <img
                      src={current.posterUrl}
                      alt={current.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="px-3 py-1.5 bg-[#0a0c12]/90 flex items-center justify-between border-t border-white/10">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                      #{selected + 1} Box Office · {year}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                </div>
              </TiltPlate>
            </div>

            {/* Movie Title */}
            <h2 className="font-display font-black text-white text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight px-2">
              {current.title}
            </h2>

            {/* Director & Genre */}
            <div className="font-mono text-xs sm:text-sm text-white/60 uppercase tracking-widest">
              Directed by {current.director}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Selector Pills */}
      {displayMovies.length > 1 && (
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-2 shrink-0 mb-12 sm:mb-14 px-2 relative z-10">
          {displayMovies.map((movie, idx) => {
            const isSelected = idx === selected;
            return (
              <button
                key={movie.title}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-3 py-1 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-accent text-black font-bold shadow-[0_0_12px_rgba(229,169,60,0.5)]"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white border border-white/10"
                }`}
              >
                #{idx + 1} {movie.title.slice(0, 16)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
