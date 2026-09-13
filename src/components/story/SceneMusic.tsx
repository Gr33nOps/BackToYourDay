import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SongItem } from "@/lib/culture";

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
    let t = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Simulated waveform bars
    const numBars = Math.floor(w / 6);
    const bars = Array.from({ length: numBars }, (_, i) => ({
      phase: (i / numBars) * Math.PI * 8 + Math.random() * Math.PI * 2,
      speed: 0.04 + Math.random() * 0.06,
      amp: 0.4 + Math.random() * 0.6,
    }));

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      const barW = w / numBars;
      const centerY = h * 0.6;
      const maxH = h * 0.38;

      for (let i = 0; i < numBars; i++) {
        const b = bars[i];
        b.phase += b.speed;
        const height = Math.abs(Math.sin(b.phase) * b.amp) * maxH + 2;
        const x = i * barW;
        const frac = i / numBars;

        // Gradient bar color
        const hue = 30 + frac * 30; // amber range
        const alpha = 0.15 + Math.abs(Math.sin(b.phase)) * 0.25;
        ctx.fillStyle = `hsla(${hue},80%,65%,${alpha})`;
        ctx.fillRect(x, centerY - height, barW - 1, height * 2);
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Album art blurred background */}
      {topSong.albumArt && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${topSong.albumArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.2) saturate(0.5)",
            transform: "scale(1.2)",
          }}
        />
      )}

      {/* Waveform canvas */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-[1]" />

      {/* Top label */}
      <div className="absolute top-8 sm:top-12 left-8 sm:left-14 z-20">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
          Airwaves · {year}
        </div>
      </div>

      {/* #1 badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
        className="absolute top-8 sm:top-12 right-8 sm:right-14 z-20"
      >
        <div
          className="font-mono text-[10px] uppercase tracking-widest text-accent px-2 py-1"
          style={{ border: "1px solid rgba(229,169,60,0.3)", background: "rgba(229,169,60,0.05)" }}
        >
          #1
        </div>
      </motion.div>

      {/* Main centered content */}
      <div className="relative z-20 text-center px-8 w-full max-w-3xl">
        {/* Album art */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-6 sm:mb-8 animate-float-y"
          style={{
            width: "clamp(100px, 18vw, 200px)",
            aspectRatio: "1",
            boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(229,169,60,0.1)",
          }}
        >
          <img
            src={topSong.albumArt}
            alt={topSong.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Marquee title */}
        <div className="overflow-hidden w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display font-black text-white whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 8vw, 7rem)" }}
          >
            <span className="inline-block animate-marquee">
              {topSong.title}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{topSong.title}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
            </span>
          </motion.div>
        </div>

        {/* Artist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-mono text-white/40 uppercase tracking-widest mt-3"
          style={{ fontSize: "clamp(0.7rem, 2vw, 1.1rem)" }}
        >
          {topSong.artist}
        </motion.div>
      </div>

      {/* Runner-ups — bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-10 left-8 sm:left-14 right-8 sm:right-14 z-20 flex gap-3 justify-center"
      >
        {songs.slice(1, 4).map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              maxWidth: "160px",
            }}
          >
            <img src={s.albumArt} alt={s.title} className="w-6 h-6 object-cover shrink-0" />
            <span className="font-mono text-[9px] text-white/40 truncate">{s.title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
