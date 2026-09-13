import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import { prefersReducedMotion } from "@/utils/motion";

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
  const displayYearRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chromatic aberration tunnel canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const cx = width / 2;
    const cy = height / 2;

    // Warp stars
    const warpStars = Array.from({ length: 320 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80 + 5;
      return {
        angle,
        dist,
        speed: Math.random() * 10 + 7,
        r: Math.random() * 255 | 0,
        g: Math.random() * 255 | 0,
        b: Math.random() * 255 | 0,
      };
    });

    if (prefersReducedMotion()) {
      ctx.fillStyle = "#050507";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      return () => window.removeEventListener("resize", handleResize);
    }

    const render = () => {
      t++;
      ctx.fillStyle = "rgba(5, 5, 7, 0.22)";
      ctx.fillRect(0, 0, width, height);

      for (const s of warpStars) {
        s.dist += s.speed;
        s.speed *= 1.02;

        const prevX = cx + Math.cos(s.angle) * (s.dist - s.speed * 1.5);
        const prevY = cy + Math.sin(s.angle) * (s.dist - s.speed * 1.5);
        const curX = cx + Math.cos(s.angle) * s.dist;
        const curY = cy + Math.sin(s.angle) * s.dist;

        if (curX < -80 || curX > width + 80 || curY < -80 || curY > height + 80) {
          s.dist = Math.random() * 30 + 5;
          s.speed = Math.random() * 10 + 7;
          s.angle = Math.random() * Math.PI * 2;
          continue;
        }

        const alpha = Math.min(1, s.dist / 100);
        // RGB chromatic split
        const offset = Math.min(3, s.dist / 80);
        ctx.strokeStyle = `rgba(255,80,80,${alpha * 0.6})`;
        ctx.lineWidth = Math.min(2.5, s.dist / 120);
        ctx.beginPath();
        ctx.moveTo(prevX - offset, prevY);
        ctx.lineTo(curX - offset, curY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(80,180,255,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(prevX + offset, prevY);
        ctx.lineTo(curX + offset, curY);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = Math.min(1.5, s.dist / 180);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
      }

      // Horizontal scanline sweep
      const scanY = ((t * 3) % (height + 60)) - 30;
      const scanGrad = ctx.createLinearGradient(0, scanY - 4, 0, scanY + 4);
      scanGrad.addColorStop(0, "rgba(255,255,255,0)");
      scanGrad.addColorStop(0.5, "rgba(255,255,255,0.04)");
      scanGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 4, width, 8);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Rapid year countdown with DOM direct update for speed
  useEffect(() => {
    sound.playWarp();
    if (prefersReducedMotion()) {
      if (displayYearRef.current) {
        displayYearRef.current.textContent = String(targetYear);
      }
      return;
    }

    const steps = 28;
    const diff = currentYear - targetYear;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = Math.pow(progress, 1.6);
      const currentVal = Math.round(currentYear - diff * eased);
      if (displayYearRef.current) {
        displayYearRef.current.textContent = String(currentVal);
      }
      if (step >= steps) {
        clearInterval(interval);
        if (displayYearRef.current) {
          displayYearRef.current.textContent = String(targetYear);
        }
      }
    }, 32);

    return () => clearInterval(interval);
  }, [currentYear, targetYear]);

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] flex items-center justify-center bg-[#050507] overflow-hidden select-none">
      {/* Chromatic tunnel canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.85) 100%)" }}
      />

      {/* Year — full viewport scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center select-none px-4"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6">
          TRAVERSING TIME
        </div>

        {/* Massive year counter — responsive clamp to fit 4 digits */}
        <div
          className="font-display font-black tracking-tighter leading-none tabular-nums select-none animate-rgb-split"
          style={{
            fontSize: "clamp(4.2rem, 24vw, 20rem)",
            color: "#ffffff",
            lineHeight: 0.88,
          }}
        >
          <span ref={displayYearRef}>{currentYear}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-white/60 font-mono text-xs sm:text-sm tracking-widest uppercase"
        >
          {targetMonthName} {targetDay}, {targetYear}
        </motion.div>

        {/* Thin amber progress line */}
        <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-[1px] bg-white/15 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
            className="h-full bg-accent"
          />
        </div>
      </motion.div>
    </div>
  );
}
