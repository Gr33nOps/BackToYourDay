import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SimpleDatePicker } from "@/components/ui/SimpleDatePicker";
import { StarfieldBackground } from "@/components/effects/StarfieldBackground";
import { sound } from "@/lib/sound";
import { prefersReducedMotion } from "@/utils/motion";

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
    <div className="min-h-[100dvh] relative w-full flex flex-col items-center justify-center overflow-hidden bg-[#050507]">
      {/* Constellation canvas — the only ambient layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 w-full h-full"
      />

      {/* Starfield */}
      <StarfieldBackground starCount={140} enableShootingStars={true} />

      {/* Top brand — static, no animation */}
      <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Static dot — not a live status, so not pulsing */}
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            BACKTOYOURDAY
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">
        {/* Giant headline — primary reveal gets the entrance animation */}
        <motion.h1
          initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-[0.88] tracking-tight text-white mb-3 select-none"
          style={{ fontSize: "clamp(3.5rem, 14vw, 10rem)" }}
        >
          Your
          <br />
          {/* Accent on "Day." — the product name moment, no glow text-shadow */}
          <span className="text-accent">Day.</span>
        </motion.h1>

        {/* Date range — plain opacity, no y-shift */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45 mb-10"
        >
          1920 — present
        </motion.p>

        {/* Date picker card — opacity + slight scale, no y on card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            className="w-full p-6 sm:p-8 space-y-5"
            style={{
              background: "rgba(13,14,20,0.88)",
              border: "1px solid rgba(229,169,60,0.14)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Selected date display */}
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">
                selected date
              </div>
              <motion.div
                key={formattedDate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-display text-2xl sm:text-3xl font-bold text-white"
              >
                {formattedDate}
              </motion.div>
            </div>

            <SimpleDatePicker value={date} onChange={setDate} />

            {/* CTA — specific action label, not "Get Started" */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full relative cursor-pointer transition-colors"
              style={{
                padding: "14px 24px",
                background: "rgba(229,169,60,0.10)",
                border: "1px solid rgba(229,169,60,0.38)",
                color: "#e5a93c",
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: "700",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.10)";
              }}
            >
              Reveal This Day →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom — readable size, readable contrast */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/35">
          Astronomy · Weather · Culture
        </span>
      </motion.div>
    </div>
  );
}
