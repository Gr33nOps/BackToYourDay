import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SimpleDatePicker } from "@/components/ui/SimpleDatePicker";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { sound } from "@/lib/sound";
import { prefersReducedMotion } from "@/utils/motion";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

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

  // Constellation canvas — reduced motion: static render only
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

    // Constellation star nodes — placed once, drift slowly
    const nodes = Array.from({ length: 16 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      ox: 0, oy: 0,
    })).map(n => ({ ...n, ox: n.x, oy: n.y }));

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

    // Render static frame for reduced-motion users
    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.4;
      for (const [a, b] of edges) {
        ctx.strokeStyle = "rgba(229,169,60,0.07)";
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229,169,60,0.35)";
        ctx.fill();
      }
    };

    if (prefersReducedMotion()) {
      renderStatic();
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      const progress = Math.min(1, t / 240);

      ctx.lineWidth = 0.4;
      for (const [a, b] of edges) {
        ctx.strokeStyle = `rgba(229,169,60,${0.07 * progress})`;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }

      for (const n of nodes) {
        n.x = n.ox + Math.sin(t / 90 + n.ox) * 7;
        n.y = n.oy + Math.cos(t / 110 + n.oy) * 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${0.38 * progress})`;
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
    <div className="min-h-[100dvh] h-full relative w-full flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden bg-[#050507] py-6 sm:py-10 px-4">
      {/* Constellation canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 w-full h-full"
      />

      {/* Starfield */}
      <StarfieldBackground starCount={140} enableShootingStars={true} />

      {/* Top brand */}
      <header className="relative z-20 flex items-center justify-center w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            BACKTOYOURDAY
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-2 sm:px-6 w-full max-w-md my-auto py-6">
        {/* Giant headline — responsive scale */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-[0.88] tracking-tight text-white mb-2 select-none"
          style={{ fontSize: "clamp(2.8rem, 13vw, 8rem)" }}
        >
          Your
          <br />
          <span className="text-accent">Day.</span>
        </motion.h1>

        {/* Date range */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 mb-6 sm:mb-8"
        >
          1920 — present
        </motion.p>

        {/* Date picker card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            className="w-full p-5 sm:p-7 space-y-4 sm:space-y-5 rounded-2xl border border-white/10"
            style={{
              background: "rgba(13,14,20,0.85)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Selected date display */}
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/45 mb-1">
                selected date
              </div>
              <motion.div
                key={formattedDate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight"
              >
                {formattedDate}
              </motion.div>
            </div>

            <SimpleDatePicker value={date} onChange={setDate} />

            {/* CTA (21st MCP modern shimmer button) */}
            <ShimmerButton
              onClick={handleSubmit}
              className="w-full text-center justify-center py-3.5 sm:py-4"
            >
              Reveal This Day →
            </ShimmerButton>
          </div>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <footer className="relative z-20 flex items-center justify-center w-full shrink-0 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 text-center">
          Astronomy · Weather · Culture
        </span>
      </footer>
    </div>
  );
}
