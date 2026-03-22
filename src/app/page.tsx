"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import ScrambleText from "@/src/components/ScrambleText";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";

export default function HubPage() {
  const router = useRouter();
  const [transitioningTo, setTransitioningTo] = useState<"deafening" | "leifeng" | null>(null);

  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { damping: 40, stiffness: 300, mass: 0.8 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Accrue deltaY to progress (normalize depending on mouse wheel or trackpad)
      const delta = e.deltaY * 0.0008; 
      let newProgress = progress.get() + delta;
      if (newProgress < 0) newProgress = 0;
      if (newProgress > 1) newProgress = 1;
      progress.set(newProgress);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * 0.002;
      touchStartY = touchY;
      let newProgress = progress.get() + delta;
      if (newProgress < 0) newProgress = 0;
      if (newProgress > 1) newProgress = 1;
      progress.set(newProgress);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [progress]);

  const handleNavigation = (destination: "deafening" | "leifeng") => {
    if (transitioningTo) return;
    setTransitioningTo(destination);
    setTimeout(() => { router.push(`/${destination}`); }, 900);
  };

  const maskVariants = {
    initial: { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" },
    animate: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", transition: { duration: 0.9, ease: [0.85, 0, 0.15, 1] as const } }
  };

  // --- Virtual Wheel Animations ---
  const moveX1 = useTransform(smoothProgress, [0, 1], ["0vw", "100vw"]);
  const moveY1 = useTransform(smoothProgress, [0, 1], ["0vh", "100vh"]);
  
  const moveX2 = useTransform(smoothProgress, [0, 1], ["0vw", "-100vw"]);
  const moveY2 = useTransform(smoothProgress, [0, 1], ["0vh", "-100vh"]);

  const rotate1 = useTransform(smoothProgress, [0, 0.5, 1], [0, 10, 30]);
  const rotate2 = useTransform(smoothProgress, [0, 0.5, 1], [0, -10, -30]);

  const scaleDoors = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 0.8]);
  const filterDoors = useTransform(smoothProgress, [0, 0.5, 1], ["brightness(1) blur(0px)", "brightness(1.5) blur(4px)", "brightness(0.5) blur(10px)"]);

  const lineOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  const textOpacity = useTransform(smoothProgress, [0.4, 0.9], [0, 1]);
  const textScale = useTransform(smoothProgress, [0.4, 1], [0.7, 1]);
  const textY = useTransform(smoothProgress, [0.4, 1], ["50px", "0px"]);
  const textBlur = useTransform(smoothProgress, [0.4, 0.9], ["blur(10px)", "blur(0px)"]);

  return (
    <main className="relative w-full h-screen overflow-hidden select-none bg-void text-paper">
      <FluidCursor />

      {/* 随滚动留在视口内的粘性容器 */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* High-end Editorial Space (Behind the doors) */}
        <div className="absolute inset-0 bg-ash flex flex-col items-center justify-center z-0 overflow-hidden">
          
          <motion.div 
            style={{ opacity: textOpacity, scale: textScale, y: textY, filter: textBlur }}
            className="relative flex flex-col items-center justify-center w-full px-6 text-center"
          >
            <span className="mb-6 md:mb-12 font-mono text-[9px] md:text-xs tracking-[0.5em] text-paper/40 uppercase ml-[0.5em]">
              Digital Repository
            </span>

            <h2 className="text-[14vw] md:text-[11vw] font-serif font-light tracking-tighter leading-none text-paper whitespace-nowrap">
              影评<span className="italic text-paper/40">社</span>
            </h2>

            <div className="mt-10 md:mt-16 flex flex-col items-center gap-4">
              <span className="text-xs md:text-sm tracking-[1.2em] text-paper/70 font-light ml-[1.2em]">
                主题网站
              </span>
              <span className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] text-paper/30 uppercase">
                Curated Reviews // Cinematic Chronicles
              </span>
            </div>
          </motion.div>
          
          {/* Subtle background grain or glow (optional embellishment) */}
          <div className="absolute inset-0 bg-paper/5 mix-blend-overlay pointer-events-none rounded-[50%] blur-[120px] scale-150 opacity-20" />
        </div>

        {/* The Doors Container */}
        <div className="absolute inset-0 flex flex-col md:flex-row z-10 pointer-events-none">
          {/* Left / Top Door */}
          <motion.section 
            style={{ x: moveX1, y: moveY1, rotateZ: rotate1, scale: scaleDoors, filter: filterDoors }}
            className="relative w-full h-1/2 md:w-1/2 md:h-full flex flex-col items-center justify-center bg-void text-paper border-b md:border-b-0 md:border-r border-paper/5 md:cursor-none group overflow-hidden shadow-2xl origin-bottom-right pointer-events-auto" 
            onClick={() => handleNavigation("deafening")}
          >
            <div className="absolute inset-0 bg-paper/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay" />
            <h1 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter mix-blend-difference leading-none"><ScrambleText text="DEAFENING" /></h1>
            <p className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-[10px] md:text-xs font-mono tracking-[0.2em] opacity-40 uppercase mix-blend-difference">[ 影评库 ] 包含所有17篇记录</p>
          </motion.section>

          {/* Right / Bottom Door */}
          <motion.section 
            style={{ x: moveX2, y: moveY2, rotateZ: rotate2, scale: scaleDoors, filter: filterDoors }}
            className="relative w-full h-1/2 md:w-1/2 md:h-full flex items-center justify-center bg-paper text-void md:cursor-none group overflow-hidden shadow-2xl origin-top-left pointer-events-auto" 
            onClick={() => handleNavigation("leifeng")}
          >
            <div className="absolute inset-0 bg-void/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay" />
            <h1 className="text-[12vw] md:text-[8vw] font-light tracking-tight mix-blend-difference leading-none"><ScrambleText text="LEIFENG" /></h1>
            <p className="absolute bottom-6 right-6 md:bottom-12 md:right-12 text-[10px] md:text-xs font-mono tracking-[0.2em] opacity-40 uppercase mix-blend-difference">[ 关于雷锋 ] Chronicles of warmth</p>
          </motion.section>
          
          {/* Center Lines */}
          <motion.div style={{ opacity: lineOpacity }} className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-paper/10 mix-blend-difference pointer-events-none" />
          <motion.div style={{ opacity: lineOpacity }} className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-paper/30 rounded-full mix-blend-difference pointer-events-none" />
        </div>

        {/* 顶层磁吸悬浮导航 */}
        <nav className="absolute top-6 md:top-10 left-6 right-6 md:left-12 md:right-12 z-40 flex justify-between items-center pointer-events-none mix-blend-difference">
          <div className="pointer-events-auto">
            <MagneticButton href="/" theme="mix">[ Home ]</MagneticButton>
          </div>
          <div className="pointer-events-auto">
            <MagneticButton href="https://user.qzone.qq.com/3467086016" target="_blank" theme="mix">
              [ 与开发者联系 ]
            </MagneticButton>
          </div>
        </nav>

        {/* 转场蒙版 */}
        <AnimatePresence>
          {transitioningTo && (
            <motion.div className="absolute inset-0 z-50 pointer-events-none" style={{ backgroundColor: transitioningTo === "deafening"? "var(--color-void)" : "var(--color-paper)" }} variants={maskVariants} initial="initial" animate="animate" exit="initial" />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}