import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  spotlightColor?: string;
}

export function GlassCard({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-surface-border bg-surface/75 backdrop-blur-sm transition-colors duration-200",
        "hover:border-foreground-dim/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
