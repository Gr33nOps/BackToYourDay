import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieItem } from "@/lib/culture";
import { PillTag } from "@/components/ui/PillTag";
import { sound } from "@/lib/sound";
import { Film } from "lucide-react";

interface SceneCinemaProps {
  movies: MovieItem[];
  year: number;
}

export function SceneCinema({ movies, year }: SceneCinemaProps) {
  const [selected, setSelected] = useState(0);
  if (!movies || movies.length === 0) return null;

  // Showcase top 3 movies prominently
  const displayMovies = movies.slice(0, 3);
  const current = displayMovies[selected] || displayMovies[0];

  const handleSelect = (index: number) => {
    sound.playTick();
    setSelected(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
      {/* Blurred poster background of current selected film */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.03 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${current.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(34px) brightness(0.25) saturate(0.7)",
            transform: "scale(1.15)",
          }}
        />
      </AnimatePresence>

      {/* Atmospheric dark gradients and subtle vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(5,5,7,0.15) 0%, rgba(5,5,7,0.85) 85%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(5,5,7,0.95) 0%, transparent 45%, rgba(5,5,7,0.6) 100%)",
        }}
      />

      {/* Top header with clearance below HUD */}
      <header className="relative z-10 pt-14 sm:pt-12 px-5 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <PillTag
            icon={<Film className="w-3 h-3 text-accent" />}
            label="THEATERS"
            value={`${year} BOX OFFICE`}
            dot
            dotColor="amber"
            variant="glass"
          />
        </div>
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/45">
          Top 3 Box Office
        </div>
      </header>

      {/* Main 3-film showcase: 1 page with all 3 movies and full visible names */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 sm:px-8 max-w-5xl mx-auto w-full my-auto py-2 sm:py-4">
        {/* Active spotlight details banner — NEVER truncated */}
        <div className="text-center mb-2.5 sm:mb-5 max-w-xl mx-auto px-2">
          <motion.div
            key={`spotlight-badge-${current.title}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/80 mb-1"
          >
            #{selected + 1} Spotlight · {year}
          </motion.div>
          <motion.h2
            key={`spotlight-title-${current.title}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display font-black text-white leading-tight tracking-tight text-lg sm:text-2xl md:text-3xl break-words"
          >
            {current.title}
          </motion.h2>
          <motion.p
            key={`spotlight-dir-${current.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="font-mono text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mt-1 break-words"
          >
            Directed by {current.director}
          </motion.p>
        </div>

        {/* 3 Prominent Movie Box Tabs Display — Full visible names */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-4xl items-start">
          {displayMovies.map((movie, index) => {
            const isSelected = index === selected;
            return (
              <motion.button
                key={movie.title}
                type="button"
                onClick={() => handleSelect(index)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                aria-label={`Select #${index + 1} movie: ${movie.title}`}
                className={`group relative flex flex-col items-center rounded-xl p-2 sm:p-3 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.09] border-amber-400/70 shadow-[0_0_28px_rgba(229,169,60,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-amber-400/40"
                    : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/25 opacity-90 hover:opacity-100"
                } border backdrop-blur-md`}
              >
                {/* Poster container with rank badge overlay */}
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2 sm:mb-2.5 shadow-xl bg-black/40 shrink-0">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle vignette on poster */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                  {/* Rank badge */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
                    <span
                      className={`inline-flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-md shadow-md ${
                        index === 0
                          ? "bg-amber-500 text-black border border-amber-300"
                          : "bg-black/80 text-white/90 border border-white/20"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </div>

                  {/* Active indicator dot on poster */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Movie Title & Info — FULL PROPER VISIBLE NAME (no truncate!) */}
                <div className="w-full px-0.5 text-center sm:text-left flex-1 flex flex-col justify-start">
                  <h3
                    className={`font-display font-bold leading-tight break-words text-[11px] sm:text-sm md:text-base min-h-[2.2rem] sm:min-h-[2.6rem] flex items-center justify-center sm:justify-start ${
                      isSelected ? "text-amber-200" : "text-white"
                    }`}
                  >
                    {movie.title}
                  </h3>
                  <p className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider break-words mt-0.5">
                    {movie.director}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Bottom spacer for clearance above mobile nav */}
      <footer className="relative z-10 pb-16 sm:pb-12 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Tap any box to spotlight
        </span>
      </footer>
    </div>
  );
}
