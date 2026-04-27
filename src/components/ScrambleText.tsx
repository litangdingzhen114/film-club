"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/{}—=+*^?#";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;
    if (isHovered) {
      interval = setInterval(() => {
        setDisplayText(() =>
          text.split("").map((letter, index) => {
            if (index < iteration) return text[index];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join("")
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3; 
      }, 35);
    } else {
      setTimeout(() => setDisplayText(text), 0);
    }
    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <motion.span className={`inline-block ${className}`} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      {displayText}
    </motion.span>
  );
}