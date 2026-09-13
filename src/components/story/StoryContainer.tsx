import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import type { NasaApodData, MovieItem, SongItem } from "@/lib/culture";
import { sound } from "@/lib/sound";
import { clampScene, sceneProgress } from "@/lib/story";

import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { FilmGrain } from "@/components/effects/FilmGrain";

import { UnifiedSlide } from "./UnifiedSlide";

interface StoryContainerProps {
  date: Date;
  identity: BirthdayIdentity;
  moon: MoonPhaseInfo;
  weather: HistoricalWeather;
  sky: NasaApodData;
  movies: MovieItem[];
  songs: SongItem[];
  onReset: () => void;
}

const SCENE_NAMES = [
  "The Day",
  "Sun Sign",
  "Birthstone",
  "Birth Flower",
  "The Moon",
  "Weather",
  "The Universe",
  "Cinema",
  "Music",
  "Life in Numbers",
  "Your Story",
];

// Clip-path transition variants cycling through 4 styles
type TransitionStyle = "iris" | "curtain" | "slide-up" | "slide-down";

function getTransitionVariants(style: TransitionStyle, dir: 1 | -1) {
  switch (style) {
    case "iris":
      return {
        initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
        animate: { clipPath: "circle(150% at 50% 50%)", opacity: 1 },
        exit:    { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      };
    case "curtain":
      return {
        initial: { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        animate: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        exit:    { clipPath: "inset(100% 0 0% 0)", opacity: 1 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };
    default: // slide
      return {
        initial: { opacity: 0, y: dir > 0 ? 60 : -60, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit:    { opacity: 0, y: dir > 0 ? -60 : 60, filter: "blur(8px)" },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      };
  }
}

function cycleStyle(scene: number): TransitionStyle {
  const styles: TransitionStyle[] = ["iris", "slide-up", "curtain", "slide-down", "iris", "slide-up", "curtain", "slide-down", "iris", "slide-up", "curtain"];
  return styles[scene % styles.length] ?? "slide-up";
}

export function StoryContainer({
  date, identity, moon, weather, sky, movies, songs, onReset,
}: StoryContainerProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [audioActive, setAudioActive] = useState(() => sound.isEnabled());
  const isTransitioning = useRef(false);

  const TOTAL_SCENES = 11;

  const handleToggleAudio = () => {
    const next = sound.toggle();
    setAudioActive(next);
  };

  const goToScene = useCallback((index: number) => {
    if (index === activeScene || isTransitioning.current) return;
    if (index === clampScene(index, TOTAL_SCENES)) {
      isTransitioning.current = true;
      setDirection(index > activeScene ? 1 : -1);
      setActiveScene(index);
      sound.playShutter();
      setTimeout(() => { isTransitioning.current = false; }, 700);
    }
  }, [activeScene]);

  const nextScene = useCallback(() => {
    if (activeScene < TOTAL_SCENES - 1) goToScene(activeScene + 1);
  }, [activeScene, goToScene]);

  const prevScene = useCallback(() => {
    if (activeScene > 0) goToScene(activeScene - 1);
  }, [activeScene, goToScene]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault(); nextScene();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault(); prevScene();
      } else if (e.key === "ArrowRight") { e.preventDefault(); nextScene(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prevScene(); }
      else if (e.key === "r" || e.key === "R" || e.key === "Escape") { onReset(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene, onReset]);

  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = performance.now();
    if (now - lastWheelTime.current < 600) return;
    if (Math.abs(e.deltaY) > 24) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) nextScene(); else prevScene();
    }
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) nextScene(); else prevScene();
    } else if (Math.abs(diffY) > 60 && Math.abs(diffY) > Math.abs(diffX) * 1.4) {
      if (diffY > 0) nextScene(); else prevScene();
    }
  };

  const style = cycleStyle(activeScene);
  const vars = getTransitionVariants(style, direction);

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#050507] text-foreground select-none flex flex-col overscroll-contain"
    >
      <StarfieldBackground starCount={90} enableShootingStars={true} />

      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-4 sm:px-6 pointer-events-none">
        {/* Brand */}
        <button
          type="button"
          onClick={onReset}
          className="pointer-events-auto flex items-center gap-2 cursor-pointer group"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 group-hover:text-white/80 transition-colors">
            BTYD
          </span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-[11px]"
            >
              {String(activeScene + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")} <span className="text-white/35">·</span> {SCENE_NAMES[activeScene]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={audioActive ? "Mute sounds" : "Enable sounds"}
            className="cursor-pointer text-white/45 hover:text-white/80 transition-colors"
            style={{ background: "none", border: "none", padding: "4px" }}
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5 text-accent/70" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Choose another date"
            className="cursor-pointer text-white/45 hover:text-white/80 transition-colors"
            style={{ background: "none", border: "none", padding: "4px" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Progress arc — thin hairline at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-accent/70"
          animate={{ width: `${sceneProgress(activeScene, TOTAL_SCENES)}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <nav
        aria-label="Story navigation"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-[#090a0f]/90 px-2 py-2 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={prevScene}
          disabled={activeScene === 0}
          aria-label="Previous scene"
          className="flex h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="min-w-14 px-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 tabular-nums">
          {activeScene + 1} / {TOTAL_SCENES}
        </span>
        {activeScene < TOTAL_SCENES - 1 ? (
          <button
            type="button"
            onClick={nextScene}
            aria-label="Next scene"
            className="flex h-10 min-w-10 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(229,169,60,0.2)] transition-all hover:bg-amber-500/30 active:scale-95"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            aria-label="Start over"
            className="flex h-10 min-w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition-all hover:bg-white/[0.15] active:scale-95"
          >
            ↩
          </button>
        )}
      </nav>

      <main className="relative z-10 h-full w-full flex-1 overflow-hidden pb-20 pt-14 sm:pb-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={vars.initial}
            animate={vars.animate}
            exit={vars.exit}
            transition={vars.transition}
            className="absolute inset-0 w-full h-full"
          >
            <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden">
              <UnifiedSlide index={activeScene} date={date} identity={identity} moon={moon} weather={weather} sky={sky} movies={movies} songs={songs} onReset={onReset} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <FilmGrain />
    </div>
  );
}
