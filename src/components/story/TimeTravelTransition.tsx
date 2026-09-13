import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { sound } from "@/lib/sound";

interface TimeTravelTransitionProps {
  targetYear: number;
  targetMonthName: string;
  targetDay: number;
}

export function TimeTravelTransition({
  targetYear,
  targetMonthName,
  targetDay,
}: TimeTravelTransitionProps) {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState(currentYear);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hyperspace warp canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Warp stars radiating from center
    const cx = width / 2;
    const cy = height / 2;
    const count = 250;
    const warpStars = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (width / 2);
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        angle,
        speed: Math.random() * 8 + 6,
        length: Math.random() * 40 + 20,
        dist,
        color: "rgba(255, 255, 255, ",
      };
    });

    const render = () => {
      ctx.fillStyle = "rgba(9, 10, 12, 0.28)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const s = warpStars[i];
        s.dist += s.speed;
        s.speed *= 1.025; // accelerate

        const prevX = cx + Math.cos(s.angle) * (s.dist - s.length);
        const prevY = cy + Math.sin(s.angle) * (s.dist - s.length);
        const curX = cx + Math.cos(s.angle) * s.dist;
        const curY = cy + Math.sin(s.angle) * s.dist;

        // Wrap around when off screen
        if (
          curX < -50 ||
          curX > width + 50 ||
          curY < -50 ||
          curY > height + 50
        ) {
          s.dist = Math.random() * 60 + 10;
          s.speed = Math.random() * 8 + 6;
          s.angle = Math.random() * Math.PI * 2;
          continue;
        }

        const alpha = Math.min(1, s.dist / 120);
        ctx.strokeStyle = `${s.color}${alpha})`;
        ctx.lineWidth = Math.min(2, s.dist / 150);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Rapid countdown of years
  useEffect(() => {
    sound.playWarp();
    const steps = 22;
    const diff = currentYear - targetYear;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = Math.pow(progress, 1.4);
      const currentVal = Math.round(currentYear - diff * eased);
      setDisplayYear(currentVal);

      if (step >= steps) {
        clearInterval(interval);
        setDisplayYear(targetYear);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [currentYear, targetYear]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas text-foreground px-4 select-none overflow-hidden">
      {/* Hyperspace canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Main Temporal Countdown Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center w-full relative z-10 space-y-4"
      >
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Retrieving Historical Archive</span>
        </div>

        <div className="font-display text-8xl sm:text-9xl md:text-[11rem] font-extrabold tracking-tighter tabular-nums leading-none text-white">
          {displayYear}
        </div>

        <p className="text-foreground-muted text-sm sm:text-base font-mono">
          Target Date: <span className="text-white font-semibold">{targetMonthName} {targetDay}, {targetYear}</span>
        </p>
      </motion.div>

      {/* Amber hairline progress bar at screen bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-surface-border overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.95, ease: "easeInOut" }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}
