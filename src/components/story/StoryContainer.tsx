import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import type { NasaApodData, MovieItem, SongItem } from "@/lib/culture";
import { MONTH_NAMES } from "@/lib/almanac";
import { sound } from "@/lib/sound";
import { clampScene, sceneProgress } from "@/lib/story";

import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { FilmGrain } from "@/components/effects/FilmGrain";

import { SceneDateReveal } from "./SceneDateReveal";
import { SceneMoon } from "./SceneMoon";
import { SceneZodiac } from "./SceneZodiac";
import { SceneApod } from "./SceneApod";
import { SceneWeather } from "./SceneWeather";
import { SceneCinema } from "./SceneCinema";
import { SceneMusic } from "./SceneMusic";
import { SceneDaysLived } from "./SceneDaysLived";
import { SceneShareEnding } from "./SceneShareEnding";

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

const ACT_INFO = [
  { roman: "ACT I", name: "The Threshold" },
  { roman: "ACT II", name: "The Moon Phase" },
  { roman: "ACT III", name: "The Zodiac" },
  { roman: "ACT IV", name: "The Cosmos" },
  { roman: "ACT V", name: "The Weather" },
  { roman: "ACT VI", name: "The Cinema" },
  { roman: "ACT VII", name: "The Anthem" },
  { roman: "ACT VIII", name: "Life in Days" },
  { roman: "EPILOGUE", name: "The Time Capsule" },
];

const TOTAL_SCENES = ACT_INFO.length;

// Transition styles cycling across scenes
type TransitionStyle = "iris" | "curtain" | "horizon" | "depth";

function getTransitionVariants(style: TransitionStyle, dir: 1 | -1) {
  switch (style) {
    case "iris":
      return {
        initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0, scale: 0.94 },
        animate: { clipPath: "circle(150% at 50% 50%)", opacity: 1, scale: 1 },
        exit: { clipPath: "circle(0% at 50% 50%)", opacity: 0, scale: 1.05 },
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
      };
    case "curtain":
      return {
        initial: { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        animate: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        exit: { clipPath: "inset(100% 0 0% 0)", opacity: 1 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      };
    case "horizon":
      return {
        initial: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        animate: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
        exit: { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      };
    default: // depth
      return {
        initial: { opacity: 0, y: dir > 0 ? 70 : -70, scale: 0.94, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, y: dir > 0 ? -70 : 70, scale: 1.05, filter: "blur(10px)" },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      };
  }
}

function cycleStyle(scene: number): TransitionStyle {
  const styles: TransitionStyle[] = [
    "iris",
    "depth",
    "curtain",
    "horizon",
    "depth",
    "iris",
    "curtain",
    "depth",
    "horizon",
  ];
  return styles[scene % styles.length] ?? "depth";
}

export function StoryContainer({
  date,
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

  const monthName = MONTH_NAMES[date.getMonth()] || "January";
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const handleToggleAudio = () => {
    const next = sound.toggle();
    setAudioActive(next);
  };

  const goToScene = useCallback(
    (index: number) => {
      if (index === activeScene || isTransitioning.current) return;
      if (index === clampScene(index, TOTAL_SCENES)) {
        isTransitioning.current = true;
        setDirection(index > activeScene ? 1 : -1);
        setActiveScene(index);
        sound.playShutter();
        if (index === TOTAL_SCENES - 1) {
          setTimeout(() => sound.playChime(), 400);
        }
        setTimeout(() => {
          isTransitioning.current = false;
        }, 700);
      }
    },
    [activeScene]
  );

  const nextScene = useCallback(() => {
    if (activeScene < TOTAL_SCENES - 1) goToScene(activeScene + 1);
  }, [activeScene, goToScene]);

  const prevScene = useCallback(() => {
    if (activeScene > 0) goToScene(activeScene - 1);
  }, [activeScene, goToScene]);

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        nextScene();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
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

  // Smooth scroll wheel handling with inertia debounce
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = performance.now();
    if (now - lastWheelTime.current < 650) return;
    if (Math.abs(e.deltaY) > 22) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) nextScene();
      else prevScene();
    }
  };

  // Touch swipe support
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) nextScene();
      else prevScene();
    } else if (Math.abs(diffY) > 55 && Math.abs(diffY) > Math.abs(diffX) * 1.3) {
      if (diffY > 0) nextScene();
      else prevScene();
    }
  };

  const style = cycleStyle(activeScene);
  const vars = getTransitionVariants(style, direction);

  const renderActiveScene = () => {
    switch (activeScene) {
      case 0:
        return (
          <SceneDateReveal
            monthName={monthName}
            day={date.getDate()}
            year={date.getFullYear()}
            weekday={identity.metrics.weekdayBorn}
            identity={identity}
          />
        );
      case 1:
        return <SceneMoon moon={moon} />;
      case 2:
        return <SceneZodiac zodiac={identity.western} />;
      case 3:
        return <SceneApod sky={sky} formattedDate={dateLabel} />;
      case 4:
        return <SceneWeather weather={weather} />;
      case 5:
        return <SceneCinema movies={movies} year={date.getFullYear()} />;
      case 6:
        return <SceneMusic songs={songs} year={date.getFullYear()} />;
      case 7:
        return (
          <SceneDaysLived
            daysLived={identity.metrics.daysLived}
            identity={identity}
          />
        );
      case 8:
      default:
        return (
          <SceneShareEnding
            day={date.getDate()}
            monthName={monthName}
            year={date.getFullYear()}
            identity={identity}
            moon={moon}
            weather={weather}
            onReset={onReset}
          />
        );
    }
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#060608] text-foreground select-none flex flex-col overscroll-contain"
    >
      <StarfieldBackground starCount={90} enableShootingStars={true} />

      {/* Top Header Controls */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-4 sm:px-8 pointer-events-none">
        {/* Brand */}
        <button
          type="button"
          onClick={onReset}
          className="pointer-events-auto flex items-center gap-2 cursor-pointer group"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(229,169,60,0.8)]" />
          <span className="font-serif text-xs font-bold uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors">
            BACKTOYOURDAY
          </span>
        </button>

        {/* Audio and Reset Controls */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={audioActive ? "Mute sound effects" : "Enable sound effects"}
            className="cursor-pointer p-2 rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-accent hover:border-accent/40 transition-colors"
          >
            {audioActive ? (
              <Volume2 className="w-3.5 h-3.5 text-accent" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Pick another date"
            className="cursor-pointer p-2 rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Progress Line at Top */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-white/[0.08]">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-accent"
          animate={{ width: `${sceneProgress(activeScene, TOTAL_SCENES)}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Bottom Floating Luxury HUD Pill Navigation */}
      <nav
        aria-label="Chapter navigation"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full border border-white/15 bg-[#0a0c12]/90 px-3 py-2 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)]"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevScene}
          disabled={activeScene === 0}
          aria-label="Previous chapter"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Chapter Scrub Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {ACT_INFO.map((act, idx) => {
            const isActive = idx === activeScene;
            return (
              <button
                key={act.roman}
                type="button"
                onClick={() => goToScene(idx)}
                aria-label={`Jump to ${act.roman}: ${act.name}`}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  isActive
                    ? "w-6 h-2 bg-accent shadow-[0_0_10px_rgba(229,169,60,0.8)]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>

        {/* Fraction Label */}
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/60 tabular-nums px-1">
          {String(activeScene + 1).padStart(2, "0")} / {String(TOTAL_SCENES).padStart(2, "0")}
        </span>

        {/* Next / Finish Button */}
        {activeScene < TOTAL_SCENES - 1 ? (
          <button
            type="button"
            onClick={nextScene}
            aria-label="Next chapter"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(229,169,60,0.25)] transition-all hover:bg-amber-500/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            aria-label="Start over"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </nav>

      {/* Main Full-Screen Act Container */}
      <main className="relative z-10 h-full w-full flex-1 overflow-hidden pt-16 pb-24 sm:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={vars.initial}
            animate={vars.animate}
            exit={vars.exit}
            transition={vars.transition}
            className="absolute inset-0 w-full h-full"
          >
            <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
              {renderActiveScene()}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <FilmGrain />
    </div>
  );
}
