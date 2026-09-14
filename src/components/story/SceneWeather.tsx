import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalWeather } from "@/lib/weather";
import { sound } from "@/lib/sound";
import { prefersReducedMotion } from "@/utils/motion";
import { CloudSun } from "lucide-react";

interface SceneWeatherProps {
  weather: HistoricalWeather;
}

export function SceneWeather({ weather }: SceneWeatherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const temp = unit === "C" ? Math.round(weather.maxTempC) : Math.round(weather.maxTempF);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const icon = weather.iconType;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      life: number;
      maxLife: number;
    };
    let particles: Particle[] = [];

    const spawnParticle = (): Particle => {
      if (icon === "rain" || icon === "heavy-rain") {
        return {
          x: Math.random() * w,
          y: -10,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 8 + 6,
          r: 0.8 + Math.random() * 0.8,
          alpha: 0.4 + Math.random() * 0.3,
          life: 0,
          maxLife: h / 7,
        };
      } else if (icon === "snow") {
        return {
          x: Math.random() * w,
          y: -10,
          vx: Math.sin(Math.random() * 10) * 1.5,
          vy: Math.random() * 1.5 + 0.5,
          r: Math.random() * 4 + 1,
          alpha: 0.5 + Math.random() * 0.3,
          life: 0,
          maxLife: h,
        };
      } else if (icon === "thunder") {
        return {
          x: Math.random() * w,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 12 + 8,
          r: 0.5,
          alpha: 0.7,
          life: 0,
          maxLife: h / 9,
        };
      } else {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.4 + 0.1),
          r: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.2 + 0.05,
          life: 0,
          maxLife: 400 + Math.random() * 400,
        };
      }
    };

    for (let i = 0; i < 110; i++) particles.push(spawnParticle());

    let flashTimer = 0;
    let flashActive = false;

    if (prefersReducedMotion()) {
      const grd = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, Math.max(w, h));
      grd.addColorStop(0, "rgba(229,169,60,0.04)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      let bgColor = "rgba(229,169,60,0.04)";
      if (icon === "rain" || icon === "heavy-rain") bgColor = "rgba(80,120,200,0.05)";
      else if (icon === "snow") bgColor = "rgba(200,220,255,0.04)";
      else if (icon === "thunder") bgColor = "rgba(100,80,160,0.05)";

      const grd = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, Math.max(w, h));
      grd.addColorStop(0, bgColor);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      if (icon === "thunder") {
        flashTimer--;
        if (flashTimer <= 0 && !flashActive) {
          flashTimer = 80 + Math.random() * 120;
          flashActive = true;
        }
        if (flashActive) {
          ctx.fillStyle = `rgba(180,160,255,${0.06 * Math.random()})`;
          ctx.fillRect(0, 0, w, h);
          if (Math.random() > 0.7) flashActive = false;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + (icon === "snow" ? Math.sin(t / 30 + p.y / 50) * 0.5 : 0);
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.y > h + 20 || p.x < -20 || p.x > w + 20) {
          particles[i] = spawnParticle();
          continue;
        }
        const lf = p.life / p.maxLife;
        const a =
          icon === "clear-sun" || icon === "partly-cloudy" || icon === "cloudy"
            ? Math.sin(lf * Math.PI) * p.alpha
            : p.alpha;
        ctx.fillStyle =
          icon === "snow"
            ? `rgba(220,235,255,${a})`
            : icon === "rain" || icon === "heavy-rain"
            ? `rgba(140,180,220,${a})`
            : icon === "thunder"
            ? `rgba(160,140,220,${a})`
            : `rgba(255,220,150,${a})`;
        if (icon === "rain" || icon === "heavy-rain" || icon === "thunder") {
          ctx.fillRect(p.x, p.y, p.r * 0.7, p.r * 6);
        } else if (icon === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [weather.iconType]);

  const handleUnitChange = (u: "C" | "F") => {
    if (u !== unit) {
      sound.playTick();
      setUnit(u);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <CloudSun className="w-3 h-3 text-accent" />
          <span>Act V · The Weather</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 max-w-xl w-full"
        >
          {/* Temperature Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${unit}-${temp}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="font-display font-black text-white leading-none tabular-nums"
              style={{
                fontSize: "clamp(5rem, 20vw, 13rem)",
                textShadow: "0 0 80px rgba(229,169,60,0.22)",
              }}
            >
              {temp}
              <span className="text-accent/60" style={{ fontSize: "0.38em" }}>
                °{unit}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Condition */}
          <div
            className="font-serif text-white/80 font-bold tracking-tight text-2xl sm:text-4xl md:text-5xl"
          >
            {weather.condition}
          </div>

          {/* Sunrise and Sunset Center Aligned */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm text-white/60 uppercase tracking-widest">
            <span>Sunrise {weather.sunriseTime}</span>
            <span className="text-accent/50">·</span>
            <span>Sunset {weather.sunsetTime}</span>
          </div>

          {/* Unit toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mt-2">
            {(["C", "F"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => handleUnitChange(u)}
                className={`px-3 py-1 font-mono text-xs font-bold cursor-pointer transition-all rounded-full ${
                  unit === u
                    ? "text-black bg-accent shadow-[0_0_10px_rgba(229,169,60,0.5)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom spacer for clearance above HUD */}
      <div className="shrink-0 mb-12 sm:mb-14" />
    </div>
  );
}
