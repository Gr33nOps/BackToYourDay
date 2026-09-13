import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieItem } from "@/lib/culture";

interface SceneCinemaProps {
  movies: MovieItem[];
  year: number;
}

export function SceneCinema({ movies, year }: SceneCinemaProps) {
  const [selected, setSelected] = useState(0);
  if (!movies || movies.length === 0) return null;

  const current = movies[selected];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blurred poster background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.06 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${current.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(28px) brightness(0.35) saturate(0.7)",
            transform: "scale(1.15)",
          }}
        />
      </AnimatePresence>

      {/* Strong vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(5,5,7,0.1) 0%, rgba(5,5,7,0.7) 80%)" }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,5,7,0.9) 0%, transparent 40%)" }}
      />

      {/* Top label with clearance below HUD */}
      <div className="absolute top-14 sm:top-12 left-6 sm:left-14 z-10">
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50">
          Theaters · {year}
        </div>
      </div>

      {/* Main content with clearance above mobile nav */}
      <div className="absolute bottom-16 sm:bottom-12 left-6 right-6 sm:left-14 sm:right-auto z-10 flex items-end max-w-2xl">
        <div className="flex gap-4 sm:gap-8 items-end w-full">
          {/* Featured poster */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, x: -20, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 rounded-lg overflow-hidden"
              style={{
                width: "clamp(75px, 14vw, 170px)",
                aspectRatio: "2/3",
                boxShadow: "0 16px 50px rgba(0,0,0,0.8)",
              }}
            >
              <img
                src={current.posterUrl}
                alt={current.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[10px] uppercase tracking-widest text-accent/70 mb-1 sm:mb-2"
            >
              #{selected + 1} · {year}
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={current.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="font-display font-black text-white leading-tight truncate"
                style={{ fontSize: "clamp(1.4rem, 5vw, 4.5rem)" }}
              >
                {current.title}
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.director}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-[10px] sm:text-[11px] text-white/55 mt-1 uppercase tracking-wider truncate"
              >
                Dir. {current.director}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Runner-up selector chips — responsive: compact thumbnails on mobile top right, full chips on desktop right */}
      <div className="absolute top-14 right-6 md:top-1/2 md:-translate-y-1/2 md:right-10 z-20 flex md:flex-col gap-1.5 sm:gap-2.5">
        {movies.slice(0, 4).map((m, i) => (
          <button
            key={m.title}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Select ${m.title}`}
            className={`cursor-pointer transition-all duration-300 flex items-center gap-2 p-1 md:px-2 md:py-1.5 rounded-lg ${
              i === selected
                ? "opacity-100 ring-1 ring-accent/60 bg-black/60"
                : "opacity-45 hover:opacity-80 bg-black/40"
            }`}
            style={{
              border: i === selected ? "1px solid rgba(229,169,60,0.5)" : "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <img
              src={m.posterUrl}
              alt={m.title}
              className="w-6 h-9 sm:w-7 sm:h-10 object-cover shrink-0 rounded-sm"
            />
            <span className="hidden md:inline font-mono text-[10px] text-white/75 truncate leading-tight text-left max-w-[100px]">
              {m.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
