"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

export default function MagneticButton({ children, href, target = "_self", theme = "paper" }: { children: React.ReactNode, href: string, target?: string, theme?: "paper" | "ink" | "mix" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    x.set(middleX * 0.3); 
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const baseClass = theme === "paper" 
    ? `border-paper/20 ${isHovered ? "text-void" : "text-paper"}`
    : theme === "ink"
    ? `border-ink/20 ${isHovered ? "text-paper" : "text-ink"}`
    : `border-white/30 ${isHovered ? "text-black" : "text-white"}`;

  const fillClass = theme === "mix" ? "bg-white" : (theme === "paper" ? "bg-paper" : "bg-ink");

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="relative z-50 inline-block"
    >
      <Link href={href} target={target}
        className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-full overflow-hidden border transition-colors duration-500 ${baseClass}`}
      >
        <motion.div
          className={`absolute inset-0 z-0 ${fillClass}`}
          initial={{ y: "100%", borderRadius: "50% 50% 0 0" }}
          animate={{ y: isHovered? "0%" : "100%", borderRadius: isHovered? "0% 0% 0 0" : "50% 50% 0 0" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] as const }}
        />
        <span className="relative z-10 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase pointer-events-none">
          {children}
        </span>
      </Link>
    </motion.div>
  );
}