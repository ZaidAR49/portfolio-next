"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

export interface MousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  isInside: boolean;
  isTouchDevice: boolean;
}

export function useMousePosition(springConfig = { damping: 25, stiffness: 200, mass: 0.5 }): MousePosition {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const [isInside, setIsInside] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device is a touch/mobile device with coarse pointer
    const touchCheck = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(touchCheck.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    touchCheck.addEventListener("change", handleTouchChange);

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsInside(true);
    };

    const handleMouseEnter = () => {
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      touchCheck.removeEventListener("change", handleTouchChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y]);

  return {
    x,
    y,
    smoothX,
    smoothY,
    isInside,
    isTouchDevice,
  };
}
