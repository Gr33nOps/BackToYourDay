import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SongItem } from "@/lib/culture";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneMusicProps {
  songs: SongItem[];
  year: number;
}

export function SceneMusic({ songs, year }: SceneMusicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  if (!songs || songs.length === 0) return null;
  const topSong = songs[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const numBars = Math.floor(w / 6);
    const bars = Array.from({ length: numBars }, (_, i) => ({
      phase: (i / numBars) * Math.PI * 8 + Math.random() * Math.PI * 2,
      speed: 0.04 + Math.random() * 0.06,
      amp: 0.4 + Math.random() * 0.6,
    }));

    // Static waveform snapshot for reduced-motion users
    if (prefersReducedMotion()) {
      const barW = w / numBars;
      const centerY = h * 0.6;
      const maxH = h * 0.38;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const hue = 30 + (i / numBars) * 30;
        ctx.fillStyle = `hsla(${hue},80%,65%,0.18)`;
        ctx.fillRect(i * barW, centerY - height, barW - 1, height * 2);
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const barW = w / numBars;
      const centerY = h * 0.6;
      const maxH = h * 0.38;
      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        b.phase += b.speed;
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const hue = 30 + (i / numBars) * 30;
        const alpha = 0.12 + Math.abs(Math.sin(b.phase)) * 0.22;
        ctx.fillStyle = `hsla(${hue},80%,65%,${alpha})`;
        ctx.fillRect(i * barW, centerY - height, barW - 1, height * 2);
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Album art blurred background */}
      {topSong.albumArt && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${topSong.albumArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.18) saturate(0.5)",
            transform: "scale(1.2)",
          }}
        />
      )}

      {/* Waveform canvas */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-[1]" />

      {/* Left-aligned layout — asymmetric, not centered */}
      <div className="absolute inset-0 z-20 flex items-center px-8 sm:px-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 w-full">

          {/* Album art — fixed size, no float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
            style={{
              width: "clamp(100px, 16vw, 200px)",
              aspectRatio: "1",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            <img
              src={topSong.albumArt}
              alt={topSong.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Song info — primary reveal */}
          <div className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 mb-3"
            >
              Airwaves · {year} · #1
            </motion.div>

            {/* Static title — readable, not scrolling. Rule #55. */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-white leading-[0.9] break-words"
              style={{ fontSize: "clamp(2rem, 7vw, 6rem)" }}
            >
              {topSong.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-mono text-white/55 uppercase tracking-widest mt-3"
              style={{ fontSize: "clamp(0.7rem, 1.8vw, 1rem)" }}
            >
              {topSong.artist}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Runner-ups — bottom right, secondary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-10 right-8 sm:right-14 z-20 flex flex-col gap-2"
      >
        {songs.slice(1, 4).map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-2 px-3 py-2"
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(8px)",
              maxWidth: "180px",
            }}
          >
            <img src={s.albumArt} alt={s.title} className="w-6 h-6 object-cover shrink-0" />
            <span className="font-mono text-[10px] text-white/55 truncate">{s.title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
