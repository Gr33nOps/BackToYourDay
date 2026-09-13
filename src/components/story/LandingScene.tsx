import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SimpleDatePicker } from "@/components/ui/SimpleDatePicker";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { sound } from "@/lib/sound";

interface LandingSceneProps {
  initialDate?: Date;
  onSubmit: (date: Date) => void;
}

export function LandingScene({ initialDate, onSubmit }: LandingSceneProps) {
  const [date, setDate] = useState<Date>(initialDate || new Date(1996, 5, 15));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formattedDate = useMemo(() => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);

  // Constellation / nebula canvas
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

    // Drifting nebula particles
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: number; life: number; maxLife: number };
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.5 + 0.5,
      hue: Math.random() > 0.6 ? 40 : Math.random() > 0.5 ? 195 : 270,
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 200,
    }));

    // Constellation star nodes
    const nodes = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      ox: 0,
      oy: 0,
    })).map(n => ({ ...n, ox: n.x, oy: n.y }));
    // Edges between nearby nodes
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < w * 0.22) {
          edges.push([i, j]);
        }
      }
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // Draw slow constellation lines with animated draw progress
      const progress = Math.min(1, t / 240);
      ctx.lineWidth = 0.4;
      for (const [a, b] of edges) {
        const na = nodes[a];
        const nb = nodes[b];
        ctx.strokeStyle = `rgba(229,169,60,${0.08 * progress})`;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      // Node stars
      for (const n of nodes) {
        n.x = n.ox + Math.sin(t / 90 + n.ox) * 8;
        n.y = n.oy + Math.cos(t / 110 + n.oy) * 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${0.4 * progress})`;
        ctx.fill();
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
          p.maxLife = 200 + Math.random() * 200;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const lf = p.life / p.maxLife;
        const alpha = Math.sin(lf * Math.PI) * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleSubmit = () => {
    sound.playTick();
    onSubmit(date);
  };

  return (
    <div className="min-h-[100dvh] relative w-full flex flex-col items-center justify-center overflow-hidden bg-[#050507]">
      {/* Nebula canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 w-full h-full"
      />

      {/* Starfield */}
      <StarfieldBackground starCount={140} enableShootingStars={true} />

      {/* Ambient aurora blobs */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div
          className="absolute animate-amb-pulse"
          style={{
            width: "60vw", height: "60vw",
            top: "10%", left: "-10%",
            background: "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
            animationDuration: "7s",
          }}
        />
        <div
          className="absolute animate-amb-pulse"
          style={{
            width: "50vw", height: "50vw",
            bottom: "5%", right: "-8%",
            background: "radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
            animationDuration: "9s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute animate-amb-pulse"
          style={{
            width: "40vw", height: "40vw",
            top: "40%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(ellipse, rgba(229,169,60,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            animationDuration: "11s",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Top brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 left-0 right-0 z-20 flex items-center justify-center"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            BACKTOYOURDAY
          </span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">
        {/* Giant headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-[0.88] tracking-tight text-white mb-4 select-none"
          style={{ fontSize: "clamp(3.5rem, 14vw, 10rem)" }}
        >
          Your
          <br />
          <span className="text-accent scene-text-shadow">Day.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/25 mb-12"
        >
          1920 — present
        </motion.p>

        {/* Date picker card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            className="w-full p-6 sm:p-8 space-y-5"
            style={{
              background: "rgba(13,14,20,0.85)",
              border: "1px solid rgba(229,169,60,0.15)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 60px rgba(229,169,60,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Selected date display */}
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/25 mb-1">
                selected date
              </div>
              <motion.div
                key={formattedDate}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl sm:text-3xl font-bold text-white"
              >
                {formattedDate}
              </motion.div>
            </div>

            <SimpleDatePicker value={date} onChange={setDate} />

            {/* CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full relative overflow-hidden group cursor-pointer"
              style={{
                padding: "14px 24px",
                background: "rgba(229,169,60,0.12)",
                border: "1px solid rgba(229,169,60,0.4)",
                color: "#e5a93c",
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: "700",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.22)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(229,169,60,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.12)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              Explore This Day →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/15">
          Astronomical · Meteorological · Cultural
        </span>
      </motion.div>
    </div>
  );
}
