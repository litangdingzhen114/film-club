"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("theme-inverted");
    } else {
      root.classList.remove("theme-inverted");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/40 flex items-center justify-center mix-blend-difference hover:scale-110 transition-all duration-500 group backdrop-blur-sm"
      aria-label="Toggle Theme"
      style={{ cursor: "pointer" }}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full font-mono text-[8px] md:text-xs tracking-[0.2em] text-white">
        <motion.span
          initial={false}
          animate={{ y: isDark? -30 : 0, opacity: isDark? 0 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute"
        >
          DAY
        </motion.span>
        <motion.span
          initial={false}
          animate={{ y: isDark? 0 : 30, opacity: isDark? 1 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute"
        >
          NHT
        </motion.span>
      </div>
    </button>
  );
}