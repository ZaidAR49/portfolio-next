"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate } from "framer-motion";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

interface CursorSpotlightProps {
  /** Size of the primary spotlight in pixels (default: 650) */
  size?: number;
  /** Whether to show a secondary inner core glow (default: true) */
  showCore?: boolean;
  /** Custom class names */
  className?: string;
}

export default function CursorSpotlight({
  size = 650,
  showCore = true,
  className = "",
}: CursorSpotlightProps) {
  const [mounted, setMounted] = useState(false);
  const { smoothX, smoothY, isInside, isTouchDevice } = useMousePosition({
    damping: 28,
    stiffness: 180,
    mass: 0.6,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wide ambient glow gradient template
  const ambientBackground = useMotionTemplate`
    radial-gradient(
      ${size}px circle at ${smoothX}px ${smoothY}px,
      var(--primary-glow, rgba(56, 189, 248, 0.12)),
      rgba(56, 189, 248, 0.03) 40%,
      transparent 75%
    )
  `;

  // Tighter, subtle concentrated core highlight
  const coreBackground = useMotionTemplate`
    radial-gradient(
      ${Math.round(size * 0.4)}px circle at ${smoothX}px ${smoothY}px,
      rgba(56, 189, 248, 0.15),
      rgba(14, 165, 233, 0.05) 50%,
      transparent 80%
    )
  `;

  // Subtle interactive point
  const pointBackground = useMotionTemplate`
    radial-gradient(
      120px circle at ${smoothX}px ${smoothY}px,
      rgba(255, 255, 255, 0.08),
      transparent 70%
    )
  `;

  if (!mounted || isTouchDevice) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 overflow-hidden select-none transition-opacity duration-500 ease-out ${
        isInside ? "opacity-100" : "opacity-0"
      } ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Wide Ambient Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none will-change-[background]"
        style={{
          background: ambientBackground,
        }}
      />

      {/* Layer 2: Focused Core Highlight */}
      {showCore && (
        <motion.div
          className="absolute inset-0 pointer-events-none will-change-[background] mix-blend-screen dark:mix-blend-screen"
          style={{
            background: coreBackground,
          }}
        />
      )}

      {/* Layer 3: Micro Center Accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none will-change-[background] hidden dark:block"
        style={{
          background: pointBackground,
        }}
      />
    </div>
  );
}
