import { memo } from "react";

/**
 * FilmGrain overlay
 * Procedural SVG fractal noise giving the deep black OLED canvas an archival,
 * museum-grade paper/film texture without any external assets or network requests.
 */
export const FilmGrain = memo(function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none opacity-[0.038] mix-blend-screen"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="archival-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#archival-noise)"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
});
