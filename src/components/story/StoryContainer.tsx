import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, RotateCcw, Volume2, VolumeX } from "lucide-react";
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

  // Touch swipe support
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
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
      className="relative w-full h-screen overflow-hidden bg-canvas text-foreground select-none flex flex-col"
    >
      {/* Background Starfield Canvas */}
      <StarfieldBackground starCount={100} enableShootingStars={true} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-surface-border px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
        {/* Brand & Date */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-foreground hover:text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>BackToYourDay</span>
          </button>
          <span className="hidden sm:inline text-foreground-dim text-xs">&bull;</span>
          <span className="hidden sm:inline text-xs font-mono text-foreground-muted">
            {formattedDate}
          </span>
        </div>

        {/* Scene Progress & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-foreground-muted font-mono flex items-center gap-2"
            >
              <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[11px] text-accent font-semibold">
                {String(activeScene + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline text-foreground font-sans font-medium text-xs">
                {SCENE_NAMES[activeScene]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-raised text-foreground-muted hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title={audioActive ? "Mute audio effects" : "Enable tactile sound effects"}
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline text-accent">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-foreground-dim" />
                <span className="hidden sm:inline text-foreground-dim">Audio Off</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-raised text-foreground-muted hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title="Try another birthday"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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
      <main className="flex-1 w-full h-full relative pt-16 flex items-center justify-center overflow-hidden z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: direction > 0 ? 25 : -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -25 : 25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto"
          >
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
          </motion.div>
        </AnimatePresence>
      </main>

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

      {/* Arrow Controls (Floating Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
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
