import React, { useRef, useState, useCallback } from "react";

interface TiltPlateProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

/**
 * TiltPlate
 * Interactive 3D perspective tilt container for museum specimen plates.
 * Follows mouse coordinates with dynamic lighting glare and smooth spring-back.
 */
export function TiltPlate({
  children,
  className = "",
  maxTilt = 6.5,
  glare = true,
}: TiltPlateProps) {
  const plateRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = plateRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width - 0.5) * 2; // -1 to 1
      const normY = (clientY / rect.height - 0.5) * 2; // -1 to 1

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`);
      if (glare) {
        setGlarePos({
          x: (clientX / rect.width) * 100,
          y: (clientY / rect.height) * 100,
          opacity: 0.1,
        });
      }
    },
    [maxTilt, glare]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={plateRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Glare */}
      {glare && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 70%)`,
            transition: isHovered ? "opacity 0.15s ease-out" : "opacity 0.6s ease-out",
          }}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        />
      )}
    </div>
  );
}
