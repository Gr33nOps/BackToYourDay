import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoricalWeather } from "@/lib/weather";
import { sound } from "@/lib/sound";

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
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const icon = weather.iconType;

    // Weather-driven particles
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; maxLife: number };
    let particles: Particle[] = [];

    const spawnParticle = (): Particle => {
      if (icon === "rain" || icon === "heavy-rain") {
        return { x: Math.random() * w, y: -10, vx: (Math.random() - 0.5) * 1, vy: Math.random() * 8 + 6,
          r: 0.8 + Math.random() * 0.8, alpha: 0.4 + Math.random() * 0.3, life: 0, maxLife: h / 7 };
      } else if (icon === "snow") {
        return { x: Math.random() * w, y: -10, vx: Math.sin(Math.random() * 10) * 1.5, vy: Math.random() * 1.5 + 0.5,
          r: Math.random() * 4 + 1, alpha: 0.5 + Math.random() * 0.3, life: 0, maxLife: h };
      } else if (icon === "thunder") {
        return { x: Math.random() * w, y: -10, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 12 + 8,
          r: 0.5, alpha: 0.7, life: 0, maxLife: h / 9 };
      } else {
        // Clear / partly cloudy: drifting motes
        return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: -(Math.random() * 0.4 + 0.1),
          r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.2 + 0.05, life: 0, maxLife: 400 + Math.random() * 400 };
      }
    };

    for (let i = 0; i < 120; i++) particles.push(spawnParticle());

    // Lightning flash state
    let flashTimer = 0;
    let flashActive = false;

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // Weather backdrop glow
      let bgColor = "rgba(229,169,60,0.04)"; // clear
      if (icon === "rain" || icon === "heavy-rain") bgColor = "rgba(80,120,200,0.05)";
      else if (icon === "snow") bgColor = "rgba(200,220,255,0.04)";
      else if (icon === "thunder") bgColor = "rgba(100,80,160,0.05)";
      else if (icon === "fog") bgColor = "rgba(180,180,180,0.04)";

      const grd = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, Math.max(w, h));
      grd.addColorStop(0, bgColor); grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);

      // Lightning flash
      if (icon === "thunder") {
        flashTimer--;
        if (flashTimer <= 0 && !flashActive) { flashTimer = 80 + Math.random() * 120; flashActive = true; }
        if (flashActive) {
          ctx.fillStyle = `rgba(180,160,255,${0.06 * Math.random()})`;
          ctx.fillRect(0, 0, w, h);
          if (Math.random() > 0.7) flashActive = false;
        }
      }

      // Particles
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
        const a = icon === "clear-sun" || icon === "partly-cloudy" || icon === "cloudy"
          ? Math.sin(lf * Math.PI) * p.alpha
          : p.alpha;
        ctx.fillStyle = icon === "snow"
          ? `rgba(220,235,255,${a})`
          : icon === "rain" || icon === "heavy-rain"
          ? `rgba(140,180,220,${a})`
          : icon === "thunder"
          ? `rgba(160,140,220,${a})`
          : `rgba(255,220,150,${a})`;
        if (icon === "rain" || icon === "heavy-rain" || icon === "thunder") {
          ctx.fillRect(p.x, p.y, p.r * 0.7, p.r * 6);
        } else if (icon === "snow") {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, [weather.iconType]);

  const handleUnitChange = (u: "C" | "F") => {
    if (u !== unit) { sound.playTick(); setUnit(u); }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Temperature — massive center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${unit}-${temp}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="font-display font-black text-white leading-none tabular-nums"
            style={{
              fontSize: "clamp(6rem, 28vw, 24rem)",
              textShadow: "0 0 120px rgba(229,169,60,0.2)",
            }}
          >
            {temp}
            <span className="text-accent/60" style={{ fontSize: "0.3em" }}>°{unit}</span>
          </motion.div>
        </AnimatePresence>

        <div className="font-display text-white/50 font-bold mt-2" style={{ fontSize: "clamp(1rem, 4vw, 3rem)" }}>
          {weather.condition}
        </div>
      </motion.div>

      {/* Sunrise — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-8 sm:bottom-12 left-8 sm:left-14 z-20"
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/20">Sunrise</div>
        <div className="font-mono text-sm text-white/50 mt-0.5">{weather.sunriseTime}</div>
      </motion.div>

      {/* Sunset — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 sm:bottom-12 right-8 sm:right-14 z-20 text-right"
      >
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/20">Sunset</div>
        <div className="font-mono text-sm text-white/50 mt-0.5">{weather.sunsetTime}</div>
      </motion.div>

      {/* Unit toggle — top right */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-14 z-20 flex gap-1">
        {(["C", "F"] as const).map(u => (
          <button
            key={u}
            type="button"
            onClick={() => handleUnitChange(u)}
            className={`px-2 py-1 font-mono text-[10px] font-bold cursor-pointer transition-all ${
              unit === u ? "text-accent" : "text-white/20 hover:text-white/40"
            }`}
            style={{ background: "none", border: "none" }}
          >
            °{u}
          </button>
        ))}
      </div>
    </div>
  );
}
