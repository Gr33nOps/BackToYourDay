import { motion } from "framer-motion";
import { TiltPlate } from "@/components/ui/TiltPlate";
import type { MovieItem } from "@/lib/culture";

interface SceneCinemaProps {
  movies: MovieItem[];
  year: number;
}

export function SceneCinema({ movies, year }: SceneCinemaProps) {
  if (!movies || movies.length === 0) return null;

  const topMovie = movies[0];
  const runnerUps = movies.slice(1, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-2 sm:px-4"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-surface-border pb-2.5 sm:pb-4 mb-4 sm:mb-8 text-left">
        <div>
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold block mb-0.5 sm:mb-1">
            THEATRICAL ARCHIVE
          </span>
          <h2 className="font-display text-2xl sm:text-5xl font-bold tracking-tight text-white">
            In Theaters {year}
          </h2>
        </div>
        <p className="text-foreground-muted text-[11px] sm:text-xs font-mono mt-1 sm:mt-0 uppercase tracking-wide">
          Box Office Records of Your Birth Year
        </p>
      </div>

      {/* Asymmetric Box Office Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start text-left">
        {/* Primary Feature: #1 Box Office Hit with 3D Tilt */}
        <div className="md:col-span-7">
          <TiltPlate>
            <div className="flex flex-row gap-3.5 sm:gap-6 p-3 sm:p-5 border border-surface-border bg-surface/70">
              <div className="w-24 sm:w-44 md:w-48 shrink-0 aspect-[2/3] overflow-hidden border border-surface-border bg-surface relative">
                <img
                  src={topMovie.posterUrl}
                  alt={topMovie.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/90 border border-surface-border text-[9px] sm:text-[10px] font-mono text-accent font-semibold">
                  #01 CHAMPION
                </div>
              </div>

              <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                <div className="space-y-1 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-dim block">
                    THEATRICAL PREMIERE
                  </span>
                  <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight truncate">
                    {topMovie.title}
                  </h3>
                  <p className="text-xs font-mono text-accent truncate">
                    Directed by {topMovie.director}
                  </p>
                  <p className="text-xs font-sans text-foreground-muted leading-relaxed line-clamp-3 sm:line-clamp-4 pt-0.5">
                    {topMovie.tagline || "One of the standout theatrical releases drawing audiences to cinemas nationwide."}
                  </p>
                </div>
                <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-surface-border text-[10px] sm:text-[11px] font-mono text-foreground-dim">
                  Release Year: <span className="text-white font-medium">{year}</span>
                </div>
              </div>
            </div>
          </TiltPlate>
        </div>

        {/* Secondary Records: #2 and #3 Contenders */}
        <div className="md:col-span-5 space-y-2.5 sm:space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground-dim pb-1 border-b border-surface-border">
            TOP BOX OFFICE RUNNERS-UP
          </div>

          {runnerUps.map((movie, idx) => (
            <div
              key={movie.title}
              className="flex gap-3 sm:gap-4 p-2.5 sm:p-3.5 border border-surface-border bg-surface/40 hover:bg-surface/70 transition-colors"
            >
              <div className="w-12 sm:w-16 shrink-0 aspect-[2/3] overflow-hidden border border-surface-border bg-surface relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-mono font-semibold text-accent">
                  NO. 0{idx + 2} IN THEATERS
                </div>
                <h4 className="font-display font-bold text-xs sm:text-base text-white truncate">
                  {movie.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-foreground-dim font-mono truncate">
                  Dir. {movie.director}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

