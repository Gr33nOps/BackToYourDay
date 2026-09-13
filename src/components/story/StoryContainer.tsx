import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
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
  "The Day You Were Born",
  "Your Sun Sign",
  "Your Birthstone",
  "Your Birth Flower",
  "The Moon That Night",
  "Atmospheric Weather",
  "A View of the Universe",
  "Movies in Theaters",
  "Songs on the Radio",
  "Your Life in Numbers",
  "Birthday Keepsake",
];

export function StoryContainer({
  date,
  monthName,
  identity,
  moon,
  weather,
  sky,
  movies,
  songs,
  onReset,
}: StoryContainerProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [audioActive, setAudioActive] = useState(() => sound.isEnabled());
  const isTransitioning = useRef(false);

  const day = date.getDate();
  const year = date.getFullYear();
  const weekday = identity.metrics.weekdayBorn;
  const formattedDate = `${monthName} ${day}, ${year}`;

  const TOTAL_SCENES = 11;

  const handleToggleAudio = () => {
    const next = sound.toggle();
    setAudioActive(next);
  };

  const goToScene = useCallback(
    (index: number) => {
      if (index === activeScene || isTransitioning.current) return;
      if (index >= 0 && index < TOTAL_SCENES) {
        isTransitioning.current = true;
        setDirection(index > activeScene ? 1 : -1);
        setActiveScene(index);
        sound.playShutter();
        setTimeout(() => {
          isTransitioning.current = false;
        }, 550);
      }
    },
    [activeScene, TOTAL_SCENES]
  );

  const nextScene = useCallback(() => {
    if (activeScene < TOTAL_SCENES - 1) {
      goToScene(activeScene + 1);
    }
  }, [activeScene, TOTAL_SCENES, goToScene]);

  const prevScene = useCallback(() => {
    if (activeScene > 0) {
      goToScene(activeScene - 1);
    }
  }, [activeScene, goToScene]);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        nextScene();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        prevScene();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextScene();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevScene();
      } else if (e.key === "r" || e.key === "R" || e.key === "Escape") {
        onReset();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene, onReset]);

  // Wheel scroll navigation with momentum throttle
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = performance.now();
    if (now - lastWheelTime.current < 550) return;

    if (Math.abs(e.deltaY) > 24) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        nextScene();
      } else {
        prevScene();
      }
    }
  };

  // Safe horizontal touch swipe support (allows normal vertical scrolling)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Only trigger slide transition if horizontal gesture is predominant
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX > 0) {
        nextScene();
      } else {
        prevScene();
      }
    }
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-canvas text-foreground select-none flex flex-col overscroll-contain"
    >
      {/* Background Starfield Canvas */}
      <StarfieldBackground starCount={100} enableShootingStars={true} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-surface-border px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-colors">
        {/* Brand & Date */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-foreground hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="hidden xs:inline">BackToYourDay</span>
            <span className="xs:hidden">BTYD</span>
          </button>
          <span className="hidden sm:inline text-foreground-dim text-xs">&bull;</span>
          <span className="hidden md:inline text-xs font-mono text-foreground-muted truncate">
            {formattedDate}
          </span>
        </div>

        {/* Scene Progress & Audio & Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-foreground-muted font-mono flex items-center gap-1.5 sm:gap-2"
            >
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-surface border border-surface-border text-[10px] sm:text-[11px] text-accent font-semibold">
                {String(activeScene + 1).padStart(2, "0")}/{String(TOTAL_SCENES).padStart(2, "0")}
              </span>
              <span className="hidden md:inline text-foreground font-sans font-medium text-xs max-w-[150px] lg:max-w-none truncate">
                {SCENE_NAMES[activeScene]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className="inline-flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-raised text-foreground-muted hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title={audioActive ? "Mute audio effects" : "Enable tactile sound effects"}
            aria-label={audioActive ? "Mute audio" : "Unmute audio"}
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline ml-1.5 text-accent">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-foreground-dim" />
                <span className="hidden sm:inline ml-1.5 text-foreground-dim">Audio Off</span>
              </>
            )}
          </button>

          {/* Change Date Button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-raised text-foreground-muted hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title="Try another birthday"
            aria-label="Change birthday date"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Change Date</span>
          </button>
        </div>

        {/* Crisp Archival Amber Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface-border">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${((activeScene + 1) / TOTAL_SCENES) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Main Animated Stage with Directional Transitions */}
      <main className="flex-1 w-full h-full relative pt-14 sm:pt-16 pb-16 sm:pb-0 overflow-hidden z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto overflow-x-hidden px-3 sm:px-8"
          >
            <div className="min-h-full w-full flex flex-col justify-start sm:justify-center items-center py-4 sm:py-8">
              {activeScene === 0 && (
                <SceneDateReveal
                  monthName={monthName}
                  day={day}
                  year={year}
                  weekday={weekday}
                  identity={identity}
                />
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
                  day={day}
                  monthName={monthName}
                  year={year}
                  identity={identity}
                  moon={moon}
                  weather={weather}
                  onReset={onReset}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Screens < md) */}
      <nav
        aria-label="Mobile story navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-lg border-t border-surface-border px-3 py-2 flex items-center justify-between pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <button
          type="button"
          onClick={prevScene}
          disabled={activeScene === 0}
          aria-label="Previous scene"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-border bg-surface disabled:opacity-30 disabled:pointer-events-none text-foreground hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex flex-col items-center justify-center min-w-0 px-2 text-center">
          <span className="text-[10px] font-mono text-accent font-semibold tracking-wider">
            {String(activeScene + 1).padStart(2, "0")} OF {String(TOTAL_SCENES).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-medium text-foreground truncate max-w-[170px]">
            {SCENE_NAMES[activeScene]}
          </span>
        </div>

        {activeScene < TOTAL_SCENES - 1 ? (
          <button
            type="button"
            onClick={nextScene}
            aria-label="Next scene"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-accent text-canvas font-mono font-bold text-xs hover:bg-accent-hover transition-colors cursor-pointer shadow-md"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            aria-label="Finish and explore another birthday"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-canvas font-mono font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
          >
            <span>Restart</span>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </nav>

      {/* Side Dot Navigation (Desktop only) */}
      <nav
        aria-label="Story scenes"
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 p-1.5 rounded-full bg-surface/90 border border-surface-border backdrop-blur-sm"
      >
        {Array.from({ length: TOTAL_SCENES }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToScene(idx)}
            title={SCENE_NAMES[idx]}
            aria-label={`Go to scene ${idx + 1}: ${SCENE_NAMES[idx]}`}
            className={`rounded-full transition-all duration-200 cursor-pointer ${
              activeScene === idx
                ? "w-1.5 h-4 bg-accent"
                : "w-1.5 h-1.5 bg-foreground-dim/40 hover:bg-foreground-muted"
            }`}
          />
        ))}
      </nav>

      {/* Desktop Arrow Controls (Floating Bottom Right, Desktop only) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2">
        {activeScene > 0 && (
          <button
            type="button"
            onClick={prevScene}
            aria-label="Previous scene"
            className="w-10 h-10 rounded-lg bg-surface border border-surface-border text-foreground hover:text-white hover:bg-surface-raised flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
        {activeScene < TOTAL_SCENES - 1 && (
          <button
            type="button"
            onClick={nextScene}
            aria-label="Next scene"
            className="w-10 h-10 rounded-lg bg-white text-canvas hover:bg-neutral-200 font-bold border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop Keyboard Instrument Legend */}
      <div className="hidden lg:flex fixed bottom-6 left-6 z-40 items-center gap-2 font-mono text-[11px] text-foreground-dim/70 tracking-wider select-none pointer-events-none">
        <span className="px-1.5 py-0.5 border border-surface-border rounded bg-surface/60 text-foreground-muted">↑</span>
        <span className="px-1.5 py-0.5 border border-surface-border rounded bg-surface/60 text-foreground-muted">↓</span>
        <span>SCROLL</span>
        <span className="text-surface-border">&bull;</span>
        <span className="px-1.5 py-0.5 border border-surface-border rounded bg-surface/60 text-foreground-muted">SPACE</span>
        <span>NEXT</span>
        <span className="text-surface-border">&bull;</span>
        <span className="px-1.5 py-0.5 border border-surface-border rounded bg-surface/60 text-foreground-muted">R</span>
        <span>RESET</span>
      </div>

      {/* Procedural Film Grain Overlay */}
      <FilmGrain />
    </div>
  );
}
