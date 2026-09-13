import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/motion";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number;
  r: number; g: number; b: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

// Star color palette — mostly white/warm, with occasional teal & violet
const STAR_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [255, 255, 255],
  [255, 255, 255],
  [255, 248, 225],
  [255, 230, 160],
  [229, 169, 60],
  [110, 215, 245],
  [185, 145, 255],
];

export function StarfieldBackground({
  starCount = 180,
  enableShootingStars = true,
  className = "",
}: {
  starCount?: number;
  enableShootingStars?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + 1500;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const layer = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
        const size = layer === 1 ? Math.random() * 1.0 + 0.4 : layer === 2 ? Math.random() * 1.5 + 0.8 : Math.random() * 2.2 + 1.2;
        const baseAlpha = layer === 1 ? Math.random() * 0.4 + 0.2 : layer === 2 ? Math.random() * 0.5 + 0.35 : Math.random() * 0.4 + 0.5;
        const [r, g, b] = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size, baseAlpha, alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          layer, r, g, b,
        });
      }
    };

    const spawnShootingStar = () => {
      const startFromTop = Math.random() < 0.7;
      const x = startFromTop ? Math.random() * width * 0.8 + width * 0.1 : width + 20;
      const y = startFromTop ? -20 : Math.random() * height * 0.4;
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1);
      shootingStars.push({ x, y, length: Math.random() * 110 + 70, speed: Math.random() * 14 + 10, angle, alpha: 1, active: true });
    };

    initStars();

    if (prefersReducedMotion()) {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${star.baseAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
        const a = Math.max(0.05, Math.min(1, star.alpha));

        const parallaxOffset = star.layer * 14;
        const drawX = star.x + mouseRef.current.x * parallaxOffset;
        const drawY = star.y + mouseRef.current.y * parallaxOffset;

        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${a})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo for brighter stars
        if (star.layer === 3 || (star.layer === 2 && star.size > 1.8)) {
          const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 3.5);
          grd.addColorStop(0, `rgba(${star.r}, ${star.g}, ${star.b}, ${a * 0.3})`);
          grd.addColorStop(1, "transparent");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (enableShootingStars) {
        const now = Date.now();
        if (now > nextShootingStarTime) {
          spawnShootingStar();
          nextShootingStarTime = now + Math.random() * 4500 + 2500;
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          if (!s.active) continue;

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.alpha -= delta * 0.85;

          if (s.alpha <= 0 || s.x < -100 || s.x > width + 100 || s.y > height + 100) {
            s.active = false;
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
          gradient.addColorStop(0.65, `rgba(229, 190, 80, ${s.alpha * 0.4})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount, enableShootingStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
