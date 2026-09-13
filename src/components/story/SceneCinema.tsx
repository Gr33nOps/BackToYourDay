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

      {/* Top label */}
      <div className="absolute top-8 sm:top-12 left-8 sm:left-14 z-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          Theaters · {year}
        </div>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex items-end pb-8 sm:pb-14 px-8 sm:px-14">
        <div className="flex gap-6 sm:gap-10 items-end w-full">
          {/* Featured poster */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
              style={{
                width: "clamp(90px, 12vw, 180px)",
                aspectRatio: "2/3",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
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
              className="font-mono text-[10px] uppercase tracking-widest text-accent/60 mb-2"
            >
              #{selected + 1} · {year}
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={current.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="font-display font-black text-white leading-tight truncate"
                style={{ fontSize: "clamp(1.8rem, 6vw, 5.5rem)" }}
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
                className="font-mono text-[11px] text-white/50 mt-1 uppercase tracking-wider"
              >
                Dir. {current.director}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Runner-up chips — right side */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
        {movies.slice(0, 4).map((m, i) => (
          <button
            key={m.title}
            type="button"
            onClick={() => setSelected(i)}
            className={`cursor-pointer transition-all duration-300 flex items-center gap-2 px-2 py-1.5 ${
              i === selected
                ? "opacity-100"
                : "opacity-45 hover:opacity-80"
            }`}
            style={{
              background: "rgba(0,0,0,0.4)",
              border: i === selected ? "1px solid rgba(229,169,60,0.4)" : "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              maxWidth: "140px",
            }}
          >
            <img
              src={m.posterUrl}
              alt={m.title}
              className="w-7 h-10 object-cover shrink-0"
            />
            <span className="font-mono text-[10px] text-white/70 truncate leading-tight text-left">
              {m.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
