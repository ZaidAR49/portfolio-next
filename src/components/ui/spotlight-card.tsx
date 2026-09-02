"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  borderSpotlight?: boolean;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "var(--primary-glow, rgba(56, 189, 248, 0.15))",
  spotlightSize = 350,
  borderSpotlight = true,
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const surfaceGlow = useMotionTemplate`
    radial-gradient(
      ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `;

  const borderGlow = useMotionTemplate`
    radial-gradient(
      ${Math.round(spotlightSize * 0.65)}px circle at ${mouseX}px ${mouseY}px,
      rgba(56, 189, 248, 0.35),
      transparent 70%
    )
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-[2rem] border border-border bg-surface/60 backdrop-blur-md transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Surface Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: surfaceGlow,
        }}
      />

      {/* Border Spotlight Glow */}
      {borderSpotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-primary/40"
          style={{
            background: borderGlow,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
