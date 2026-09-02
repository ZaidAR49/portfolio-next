"use client";

import React from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

interface GlowButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function GlowButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  target,
  rel,
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm gap-2",
    md: "px-8 py-4 text-base gap-3",
    lg: "px-10 py-5 text-lg gap-4",
  }[size];

  const defaultIcon = <FaArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />;

  const isPrimary = variant === "primary";
  const isGlass = variant === "glass" || variant === "secondary";

  const buttonContent = (
    <div className={`relative group inline-flex items-center justify-center ${className}`}>
      {/* 1. Ambient Background Pulse Glow */}
      <div
        className={`absolute -inset-1 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
          isPrimary
            ? "bg-gradient-to-r from-sky-400 via-primary to-indigo-500 opacity-60 group-hover:opacity-100 group-hover:blur-2xl group-hover:scale-110"
            : "bg-gradient-to-r from-sky-400/20 via-primary/30 to-indigo-500/20 opacity-40 group-hover:opacity-80 group-hover:blur-xl group-hover:scale-105"
        }`}
      />

      {/* 2. Outer Gradient Border Ring */}
      <div
        className={`relative p-[1.5px] rounded-full overflow-hidden transition-all duration-300 ease-out shadow-2xl ${
          isPrimary
            ? "bg-gradient-to-r from-sky-300 via-primary to-indigo-400 group-hover:shadow-[0_0_35px_rgba(56,189,248,0.6)]"
            : "bg-gradient-to-r from-border via-primary/40 to-border group-hover:from-primary/60 group-hover:via-sky-400 group-hover:to-indigo-400 group-hover:shadow-[0_0_30px_var(--primary-glow)]"
        }`}
      >
        {/* Continuous rotating beam reflection */}
        <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(255,255,255,0.7)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* 3. Inner Interactive Body */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`relative z-10 flex items-center justify-center font-bold tracking-wide rounded-full overflow-hidden transition-all duration-300 ${sizeClasses} ${
            isPrimary
              ? "bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#6366f1] dark:from-[#0369a1] dark:via-[#0ea5e9] dark:to-[#4f46e5] text-white shadow-inner"
              : "bg-surface/90 dark:bg-[#0f172a]/90 backdrop-blur-xl text-foreground hover:text-white dark:hover:text-white group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-800"
          }`}
        >
          {/* Shimmer Light Reflection Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {/* Label Text */}
          <span className="relative z-10 font-bold drop-shadow-sm">{children}</span>

          {/* Arrow / Icon Badge with circular pill background */}
          <span
            className={`relative z-10 flex items-center justify-center rounded-full p-1.5 transition-all duration-300 ${
              isPrimary
                ? "bg-white/20 text-white group-hover:bg-white group-hover:text-sky-600 shadow-sm"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white shadow-sm"
            }`}
          >
            {icon || defaultIcon}
          </span>
        </motion.div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} target={target} rel={rel} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block bg-transparent border-0 p-0 cursor-pointer">
      {buttonContent}
    </button>
  );
}
