import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import type { NasaApodData, MovieItem, SongItem } from "@/lib/culture";
import { sound } from "@/lib/sound";

import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { FilmGrain } from "@/components/effects/FilmGrain";

import { SceneDateReveal } from "./SceneDateReveal";
import { SceneZodiac } from "./SceneZodiac";
import { SceneGemstone } from "./SceneGemstone";
import { SceneBotanical } from "./SceneBotanical";
import { SceneMoon } from "./SceneMoon";
import { SceneWeather } from "./SceneWeather";
import { SceneApod } from "./SceneApod";
import { SceneCinema } from "./SceneCinema";
import { SceneMusic } from "./SceneMusic";
import { SceneDaysLived } from "./SceneDaysLived";
import { SceneShareEnding } from "./SceneShareEnding";

interface StoryContainerProps {
  date: Date;
  monthName: string;
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
  date, monthName, identity, moon, weather, sky, movies, songs, onReset,
}: StoryContainerProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [audioActive, setAudioActive] = useState(() => sound.isEnabled());
  const isTransitioning = useRef(false);

  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${monthName} ${day}, ${year}`;
  const TOTAL_SCENES = 11;

  const handleToggleAudio = () => {
    const next = sound.toggle();
    setAudioActive(next);
  };

  const goToScene = useCallback((index: number) => {
    if (index === activeScene || isTransitioning.current) return;
    if (index >= 0 && index < TOTAL_SCENES) {
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

      {/* Floating minimal top HUD */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3 pointer-events-none">
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

        {/* Scene label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50"
          >
            {String(activeScene + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")}
            <span className="hidden sm:inline ml-2 text-white/35">
              · {SCENE_NAMES[activeScene]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            className="cursor-pointer text-white/45 hover:text-white/80 transition-colors"
            style={{ background: "none", border: "none", padding: "4px" }}
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5 text-accent/70" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onReset}
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
          animate={{ width: `${((activeScene + 1) / TOTAL_SCENES) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Right dot nav (desktop) */}
      <nav
        className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2"
        aria-label="Story scenes"
      >
        {Array.from({ length: TOTAL_SCENES }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToScene(idx)}
            title={SCENE_NAMES[idx]}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              activeScene === idx
                ? "w-[3px] h-5 bg-accent"
                : "w-[3px] h-[3px] bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </nav>

      {/* Mobile nav pill with frosted glass background */}
      <nav
        aria-label="Mobile story navigation"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#050507]/90 border border-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.8)]"
      >
        <button
          type="button"
          onClick={prevScene}
          disabled={activeScene === 0}
          aria-label="Previous scene"
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-20 transition-all text-white/70 hover:text-white active:scale-95 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10"
        >
          ‹
        </button>
        <span className="font-mono text-[11px] text-white/60 tabular-nums px-1">
          {activeScene + 1} / {TOTAL_SCENES}
        </span>
        {activeScene < TOTAL_SCENES - 1 ? (
          <button
            type="button"
            onClick={nextScene}
            aria-label="Next scene"
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(229,169,60,0.25)]"
          >
            ›
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            aria-label="Start over"
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white"
          >
            ↩
          </button>
        )}
      </nav>

      {/* Main scene stage */}
      <main className="flex-1 w-full h-full relative overflow-hidden z-10">
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
              {activeScene === 0 && (
                <SceneDateReveal monthName={monthName} day={day} year={year}
                  weekday={identity.metrics.weekdayBorn} identity={identity} />
              )}
              {activeScene === 1 && <SceneZodiac zodiac={identity.western} />}
              {activeScene === 2 && <SceneGemstone birthstone={identity.birthstone} />}
              {activeScene === 3 && <SceneBotanical botanicals={identity.botanicals} />}
              {activeScene === 4 && <SceneMoon moon={moon} />}
              {activeScene === 5 && <SceneWeather weather={weather} />}
              {activeScene === 6 && <SceneApod sky={sky} formattedDate={formattedDate} />}
              {activeScene === 7 && <SceneCinema movies={movies} year={year} />}
              {activeScene === 8 && <SceneMusic songs={songs} year={year} />}
              {activeScene === 9 && (
                <SceneDaysLived daysLived={identity.metrics.daysLived} identity={identity} />
              )}
              {activeScene === 10 && (
                <SceneShareEnding
                  day={day} monthName={monthName} year={year}
                  identity={identity} moon={moon} weather={weather} onReset={onReset}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <FilmGrain />
    </div>
  );
}
