import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingScene } from "@/components/story/LandingScene";
import { TimeTravelTransition } from "@/components/story/TimeTravelTransition";
import { StoryContainer } from "@/components/story/StoryContainer";
import { ErrorBox } from "@/components/ErrorBox";
import { readStoryDate } from "@/lib/date";

import {
  getBirthdayIdentity,
  MONTH_NAMES,
  type BirthdayIdentity,
} from "@/lib/almanac";
import { getMoonPhase, type MoonPhaseInfo } from "@/lib/astronomy";
import {
  fetchHistoricalWeather,
  getDefaultLocation,
  type HistoricalWeather,
} from "@/lib/weather";
import {
  fetchNasaApod,
  fetchCinemaForYear,
  fetchMusicForYear,
  type NasaApodData,
  type MovieItem,
  type SongItem,
} from "@/lib/culture";

type AppView = "hero" | "transition" | "story" | "error";

export default function App() {
  const [view, setView] = useState<AppView>("hero");
  const [date, setDate] = useState<Date>(new Date(1996, 5, 15));

  // Loaded story assets
  const [identity, setIdentity] = useState<BirthdayIdentity | null>(null);
  const [moon, setMoon] = useState<MoonPhaseInfo | null>(null);
  const [weather, setWeather] = useState<HistoricalWeather | null>(null);
  const [sky, setSky] = useState<NasaApodData | null>(null);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [songs, setSongs] = useState<SongItem[]>([]);

  const travelToDate = useCallback(
    async (targetDate: Date, updateUrl: boolean = true) => {
      setDate(targetDate);
      setView("transition");

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("day", String(day));
        url.searchParams.set("month", String(month));
        url.searchParams.set("year", String(year));
        url.searchParams.delete("city"); // Ensure no legacy city parameter persists
        window.history.pushState({}, "", url.toString());
      }

      // Snappy hyperspace transition animation duration
      const minAnimationPromise = new Promise((resolve) => setTimeout(resolve, 950));

      try {
        const defaultLoc = getDefaultLocation();
        const isSouthern = defaultLoc.latitude < 0;
        const computedIdentity = getBirthdayIdentity(year, month, day, isSouthern);
        const computedMoon = getMoonPhase(year, month, day);

        // Fetch asynchronous real-world APIs concurrently with independent fallbacks
        const [weatherRes, skyRes, moviesRes, songsRes] = await Promise.all([
          fetchHistoricalWeather(defaultLoc, year, month, day),
          fetchNasaApod(year, month, day),
          fetchCinemaForYear(year),
          fetchMusicForYear(year),
          minAnimationPromise,
        ]);

        setIdentity(computedIdentity);
        setMoon(computedMoon);
        setWeather(weatherRes);
        setSky(skyRes);
        setMovies(moviesRes);
        setSongs(songsRes);

        setView("story");
      } catch (err) {
        console.error("Failed to load time capsule:", err);
        setView("error");
      }
    },
    []
  );

  // Check URL query parameters on initial page load
  useEffect(() => {
    try {
      const sharedDate = readStoryDate(window.location.search);
      if (sharedDate) travelToDate(sharedDate, false);
    } catch {
      // ignore
    }
  }, [travelToDate]);

  const handleResetToHero = () => {
    setView("hero");
    const url = new URL(window.location.origin + window.location.pathname);
    window.history.pushState({}, "", url.toString());
  };

  const monthName = MONTH_NAMES[date.getMonth()] || "January";

  return (
    <div className="min-h-screen bg-canvas text-foreground selection:bg-accent selection:text-black font-sans antialiased">
      <AnimatePresence mode="wait">
        {/* VIEW 1: HERO LANDING SCENE */}
        {view === "hero" && (
          <motion.div
            key="hero-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LandingScene
              initialDate={date}
              onSubmit={(d) => travelToDate(d, true)}
            />
          </motion.div>
        )}

        {/* VIEW 2: TIME TRAVEL TRANSITION */}
        {view === "transition" && (
          <motion.div
            key="transition-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TimeTravelTransition
              targetYear={date.getFullYear()}
              targetMonthName={monthName}
              targetDay={date.getDate()}
            />
          </motion.div>
        )}

        {/* VIEW 3: ERROR BOX */}
        {view === "error" && (
          <motion.div
            key="error-scene"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <ErrorBox onRetry={() => travelToDate(date, false)} />
          </motion.div>
        )}

        {/* VIEW 4: STORY SLIDESHOW EXPERIENCE */}
        {view === "story" && identity && moon && weather && sky && history && (
          <motion.div
            key="story-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StoryContainer
              date={date}
              identity={identity}
              moon={moon}
              weather={weather}
              sky={sky}
              movies={movies}
              songs={songs}
              onReset={handleResetToHero}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
