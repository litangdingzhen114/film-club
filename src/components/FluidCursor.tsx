"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function FluidCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const timeoutId = setTimeout(() => setIsVisible(true), 0);
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id="fluid-distortion" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise_map" />
            <feDisplacementMap in="SourceGraphic" in2="noise_map" scale="45" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full flex items-center justify-center will-change-transform hidden md:flex"
        style={{ width: "54px", height: "54px", x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%", backdropFilter: "url(#fluid-distortion) blur(3px)", mixBlendMode: "difference", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 30px rgba(255,255,255,0.05)" }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
      </motion.div>
    </>
  );
}