"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  projectName,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      positionRef.current = { x: 0, y: 0 };
    }
  }, [isOpen, initialIndex]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    positionRef.current = { x: 0, y: 0 };
  }, []);

  // Only allow next/prev if not zoomed in
  const handleNext = useCallback(() => {
    if (images.length <= 1 || scale > 1) return;
    resetZoom();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, scale, resetZoom]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1 || scale > 1) return;
    resetZoom();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, scale, resetZoom]);

  // Click image to toggle 1x / 2x zoom
  const toggleZoom = useCallback(() => {
    setScale((prev) => {
      if (prev > 1) {
        setPosition({ x: 0, y: 0 });
        positionRef.current = { x: 0, y: 0 };
        return 1;
      } else {
        return 2;
      }
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Mouse pan handling when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    positionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !mounted || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-4 md:p-6 select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Prominent Floating Close Button (Top Right) */}
        <button
          type="button"
          onClick={onClose}
          className="fixed top-5 right-5 z-[10000] flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/35 active:scale-95 text-white border border-red-500/40 backdrop-blur-xl shadow-2xl transition-all cursor-pointer group"
          title="Exit Zoom Mode (Esc)"
          aria-label="Exit Zoom Mode"
        >
          <FaTimes size={16} className="text-red-300 group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-200">Close</span>
        </button>

        {/* Top Header Bar - Clean and Simple */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 px-2 py-2 pr-28">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm md:text-lg tracking-wide line-clamp-1">
              {projectName}
            </span>
            {images.length > 1 && (
              <span className="bg-white/10 text-white/90 border border-white/15 px-3 py-1 rounded-full text-xs font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
        </div>

        {/* Main Image Stage */}
        <div
          className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center overflow-hidden my-3"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor:
              scale > 1
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "zoom-in",
          }}
          onClick={(e) => {
            if (!isDragging) {
              toggleZoom();
            }
          }}
        >
          {/* Previous Button (hidden when zoomed in to allow free inspection) */}
          {images.length > 1 && scale === 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 md:left-4 z-30 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 cursor-pointer"
              aria-label="Previous image"
              title="Previous image (Left Arrow)"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          {/* Active Image */}
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full max-h-[78vh] flex items-center justify-center"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt={`${projectName} - full view ${currentIndex + 1}`}
                fill
                sizes="(max-width: 1200px) 100vw, 1600px"
                className="object-contain"
                priority
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Next Button (hidden when zoomed in to allow free inspection) */}
          {images.length > 1 && scale === 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 md:right-4 z-30 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md shadow-2xl transition-all transform hover:scale-110 cursor-pointer"
              aria-label="Next image"
              title="Next image (Right Arrow)"
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip (if multiple images) */}
        {images.length > 1 ? (
          <div className="w-full max-w-2xl mx-auto z-20 flex items-center justify-center gap-2.5 overflow-x-auto py-2 px-4 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  resetZoom();
                  setCurrentIndex(idx);
                }}
                className={`relative w-16 h-11 md:w-20 md:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 cursor-pointer ${
                  idx === currentIndex
                    ? "border-primary scale-105 shadow-[0_0_15px_var(--primary-glow)] ring-2 ring-primary/40"
                    : "border-white/10 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-xs text-center py-2 font-medium">
            Click image to zoom in/out • Drag to pan • Esc to exit
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
