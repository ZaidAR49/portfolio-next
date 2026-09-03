"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionTemplate } from "framer-motion";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

interface CursorSpotlightProps {
  /** Size of the primary spotlight in pixels (default: 380) */
  size?: number;
  /** Whether to show a secondary inner core glow (default: true) */
  showCore?: boolean;
  /** Custom class names */
  className?: string;
}

const CONTAINER_SELECTORS = [
  // Explicitly marked components & sections
  "[data-spotlight-ignore]",
  "[data-container]",
  "[data-card]",
  ".project-card",
  // Specific sections mentioned by user
  "#projects",
  "#contact",
  "footer",
  "form",
  // Structural component tags
  "article",
  "aside",
  "header",
  "nav",
  "dialog",
  "[role='dialog']",
  // Styled card surfaces & panels across the portfolio
  "[class*='bg-surface']",
  "[class*='bg-elevated']",
  "[class*='rounded-2xl']",
  "[class*='rounded-3xl']",
  "[class*='rounded-[2rem]']",
  "[class*='rounded-[2.5rem]']",
  "[class*='rounded-[1.5rem]']",
  "[class*='backdrop-blur']",
  // Interactive controls
  "button",
  "input",
  "textarea",
  "select",
  "a",
  "[role='button']",
].join(", ");

export default function CursorSpotlight({
  size = 380,
  showCore = true,
  className = "",
}: CursorSpotlightProps) {
  const [mounted, setMounted] = useState(false);
  const [isOverContainer, setIsOverContainer] = useState(false);
  const isOverContainerRef = useRef(false);
  const lastCoords = useRef({ x: -1, y: -1 });

  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const { smoothX, smoothY, isInside, isTouchDevice } = useMousePosition({
    damping: 30,
    stiffness: 200,
    mass: 0.5,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isTouchDevice || isDashboard) return;

    const checkElement = (target: EventTarget | null) => {
      const element =
        target instanceof Element
          ? target
          : target && "parentElement" in (target as Node)
          ? ((target as Node).parentElement as Element | null)
          : null;

      const over = Boolean(element?.closest(CONTAINER_SELECTORS));
      if (over !== isOverContainerRef.current) {
        isOverContainerRef.current = over;
        setIsOverContainer(over);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      lastCoords.current = { x: e.clientX, y: e.clientY };
      checkElement(e.target);
    };

    const handleScroll = () => {
      if (lastCoords.current.x < 0 || lastCoords.current.y < 0) return;
      const el = document.elementFromPoint(lastCoords.current.x, lastCoords.current.y);
      checkElement(el);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted, isTouchDevice, isDashboard]);

  // Wide ambient glow gradient template - softer & subtler
  const ambientBackground = useMotionTemplate`
    radial-gradient(
      ${size}px circle at ${smoothX}px ${smoothY}px,
      rgba(56, 189, 248, 0.05),
      rgba(56, 189, 248, 0.015) 35%,
      transparent 70%
    )
  `;

  // Gentle soft core highlight - no harsh blend modes, low opacity
  const coreBackground = useMotionTemplate`
    radial-gradient(
      ${Math.round(size * 0.45)}px circle at ${smoothX}px ${smoothY}px,
      rgba(56, 189, 248, 0.04),
      rgba(14, 165, 233, 0.012) 50%,
      transparent 75%
    )
  `;

  // Very faint micro point
  const pointBackground = useMotionTemplate`
    radial-gradient(
      70px circle at ${smoothX}px ${smoothY}px,
      rgba(255, 255, 255, 0.03),
      transparent 70%
    )
  `;

  if (!mounted || isTouchDevice || isDashboard) {
    return null;
  }

  const isVisible = isInside && !isOverContainer;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 overflow-hidden select-none transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
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
          className="absolute inset-0 pointer-events-none will-change-[background]"
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

