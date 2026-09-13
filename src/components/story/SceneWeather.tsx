import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalWeather } from "@/lib/weather";
import { TiltPlate } from "@/components/ui/TiltPlate";
import { sound } from "@/lib/sound";
import {
  Sun,
  CloudRain,
  Snowflake,
  CloudFog,
  CloudLightning,
  CloudSun,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SceneWeatherProps {
  weather: HistoricalWeather;
}

export function SceneWeather({ weather }: SceneWeatherProps) {
  const [unit, setUnit] = useState<"C" | "F">("C");

  const handleUnitChange = (newUnit: "C" | "F") => {
    if (newUnit !== unit) {
      sound.playTick();
      setUnit(newUnit);
    }
  };

  const temp = unit === "C" ? Math.round(weather.maxTempC) : Math.round(weather.maxTempF);
  const minTemp = unit === "C" ? Math.round(weather.minTempC) : Math.round(weather.minTempF);

  const WeatherIcon = (() => {
    switch (weather.iconType) {
      case "clear-sun":
        return Sun;
      case "rain":
      case "heavy-rain":
        return CloudRain;
      case "snow":
        return Snowflake;
      case "fog":
        return CloudFog;
      case "thunder":
        return CloudLightning;
      case "cloudy":
      case "partly-cloudy":
      default:
        return CloudSun;
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto select-none px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Massive Temperature & Observation Hero */}
        <div className="md:col-span-6 text-left space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
            ATMOSPHERIC RECORD
          </span>

          <div className="flex items-baseline gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${unit}-${temp}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-white tabular-nums leading-none"
              >
                <NumberTicker value={temp} delay={0.15} />
              </motion.span>
            </AnimatePresence>

            {/* Clean Unit Toggle */}
            <div className="flex rounded border border-surface-border bg-surface p-0.5 self-start">
              <button
                type="button"
                onClick={() => handleUnitChange("C")}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                  unit === "C"
                    ? "bg-white text-canvas"
                    : "text-foreground-muted hover:text-white"
                }`}
              >
                &deg;C
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange("F")}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                  unit === "F"
                    ? "bg-white text-canvas"
                    : "text-foreground-muted hover:text-white"
                }`}
              >
                &deg;F
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {weather.condition}
            </h2>
            <p className="text-foreground-muted text-sm sm:text-base leading-relaxed font-sans max-w-md">
              On this calendar date, historical meteorological records registered a peak daytime reading of {temp}&deg;{unit} with {weather.summary.replace(/\.$/, "").toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Right Column: Observation Log Sheet with 3D Tilt */}
        <div className="md:col-span-6">
          <TiltPlate>
            <div className="border border-surface-border bg-surface/70 p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-dim">
                  METEOROLOGICAL STATION LOG
                </span>
                <WeatherIcon className="w-5 h-5 text-accent stroke-[1.5]" />
              </div>

              <div className="divide-y divide-surface-border text-xs font-mono">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-foreground-dim uppercase">Diurnal Range</span>
                  <span className="text-white font-medium">
                    {minTemp}&deg; &ndash; {temp}&deg;{unit}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-foreground-dim uppercase">Sunrise Recorded</span>
                  <span className="text-white font-medium">{weather.sunriseTime}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-foreground-dim uppercase">Sunset Recorded</span>
                  <span className="text-white font-medium">{weather.sunsetTime}</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-foreground-dim uppercase">Precipitation Accumulation</span>
                  <span className="text-white font-medium">{weather.precipitationMm} mm</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-foreground-dim uppercase">Daylight Duration</span>
                  <span className="text-white font-medium">{weather.daylightHours} hrs</span>
                </div>
              </div>
            </div>
          </TiltPlate>
        </div>
      </div>
    </motion.div>
  );
}

