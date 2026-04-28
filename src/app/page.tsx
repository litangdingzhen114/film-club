"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import ScrambleText from "@/src/components/ScrambleText";

/* ─── Film Data ─── */
const FILMS = [
  { id: "deafening",    title: "DEAFENING", sub: "震耳欲聋", num: "01", desc: "17 篇影评 · Cinematic Silence",  dark: true  },
  { id: "leifeng",      title: "LEIFENG",   sub: "传承雷锋", num: "02", desc: "Chronicles of Warmth",          dark: false },
  { id: "xiaoxiaodewo", title: "LITTLE ME",  sub: "小小的我", num: "03", desc: "20 篇影评 · Moss Flower",        dark: true  },
];

const LOOP = 12;
const STRIP = Array.from({ length: LOOP }, () => FILMS).flat();
const SPROCKETS_DESKTOP = 8;
const SPROCKETS_MOBILE = 5;

/* ─── 响应式参数 ─── */
function getParams(vw: number) {
  const mobile = vw < 768;
  return {
    frameVW: mobile ? 80 : 48,
    marginR: mobile ? "-4vw" : "-1.5vw",
    sprockets: mobile ? SPROCKETS_MOBILE : SPROCKETS_DESKTOP,
    rotateScale: mobile ? 35 : 50,
    tzScale: mobile ? 120 : 250,
    scaleMin: mobile ? 0.7 : 0.65,
    scaleFade: mobile ? 0.15 : 0.18,
    brightFade: mobile ? 0.35 : 0.45,
    blurMax: mobile ? 2 : 3.5,
    stripHeight: mobile ? "50vh" : "62vh",
    sensitivity: mobile ? 1.8 : 1.2,
  };
}

/* ─── 主页面 ─── */
export default function InfiniteFilmStrip() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [transitioningTo, setTransitioningTo] = useState<string | null>(null);
  const [activeFilm, setActiveFilm] = useState(FILMS[0]);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const posRef = useRef(0);
  const targetRef = useRef(0);
  const groupWRef = useRef(0);
  const paramsRef = useRef(getParams(typeof window !== "undefined" ? window.innerWidth : 1200));
  const touchRef = useRef({ startY: 0, lastY: 0 });

  // 计算尺寸
  useEffect(() => {
    const calc = () => {
      const p = getParams(window.innerWidth);
      paramsRef.current = p;
      const marginVW = parseFloat(p.marginR);
      groupWRef.current = ((p.frameVW + marginVW) / 100) * window.innerWidth * FILMS.length;
      setIsMobile(window.innerWidth < 768);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  /* 主题 */
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setIsDark(html.classList.contains("theme-inverted"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* Wheel (桌面) */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += e.deltaY * paramsRef.current.sensitivity;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /* Touch (手机) */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchRef.current.startY = e.touches[0].clientY;
      touchRef.current.lastY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = touchRef.current.lastY - y;
      touchRef.current.lastY = y;
      targetRef.current += delta * paramsRef.current.sensitivity * 2;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  /* 隐藏滚动条 */
  useEffect(() => {
    document.documentElement.classList.add("film-strip-active");
    document.body.classList.add("film-strip-active");
    return () => {
      document.documentElement.classList.remove("film-strip-active");
      document.body.classList.remove("film-strip-active");
    };
  }, []);

  /* rAF 主循环 */
  const loop = useCallback(() => {
    const vw = window.innerWidth;
    const cx = vw / 2;
    const gw = groupWRef.current;
    const p = paramsRef.current;

    posRef.current += (targetRef.current - posRef.current) * 0.08;

    if (gw > 0) {
      // 保持坐标始终在克隆数组的正中间（第5~6组之间），确保左右各有庞大的 DOM 缓冲池
      const minTarget = gw * 5;
      const maxTarget = gw * 6;
      while (targetRef.current < minTarget) { targetRef.current += gw; posRef.current += gw; }
      while (targetRef.current >= maxTarget) { targetRef.current -= gw; posRef.current -= gw; }
    }

    const track = trackRef.current;
    if (track) {
      track.style.transform = `translateX(${-posRef.current}px)`;

      const children = track.children;
      let closestDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const inner = child.querySelector("[data-3d]") as HTMLElement;
        if (!inner) continue;

        const rect = child.getBoundingClientRect();
        const fCenter = rect.left + rect.width / 2;
        const off = (fCenter - cx) / vw;

        const ry = off * -p.rotateScale;
        const tz = -Math.abs(off) * p.tzScale;
        const sc = Math.max(1 - Math.abs(off) * p.scaleFade, p.scaleMin);
        const br = Math.max(1 - Math.abs(off) * p.brightFade, 0.35);
        const bl = Math.min(Math.abs(off) * 2, p.blurMax);

        inner.style.transform = `perspective(1200px) rotateY(${ry}deg) translateZ(${tz}px) scale(${sc})`;
        inner.style.filter = `brightness(${br}) blur(${bl}px)`;
        child.style.zIndex = `${100 - Math.round(Math.abs(off) * 50)}`;

        const dist = Math.abs(fCenter - cx);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      }

      const newActive = FILMS[closestIdx % FILMS.length];
      setActiveFilm(prev => prev.id === newActive.id ? prev : newActive);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  /* 导航 */
  const handleNav = (id: string) => {
    if (transitioningTo) return;
    setTransitioningTo(id);
    setTimeout(() => {
      document.documentElement.classList.remove("film-strip-active");
      document.body.classList.remove("film-strip-active");
      router.push(`/${id}`);
    }, 900);
  };

  const nudge = (dir: number) => {
    const marginVW = parseFloat(paramsRef.current.marginR);
    targetRef.current += dir * ((paramsRef.current.frameVW + marginVW) / 100) * window.innerWidth;
  };

  /* ─── 主题色 ─── */
  const getBgGrad = () => {
    // 统一使用经典银色/纯粹黑色的3D感作为背景氛围灯
    return isDark
      ? "radial-gradient(ellipse 80% 60% at 50% 45%, #e8e8e8 0%, #f5f5f5 50%, #fafafa 100%)"
      : "radial-gradient(ellipse 80% 60% at 50% 45%, #1f1f1f 0%, #0a0a0a 50%, #000000 100%)";
  };
  const bgGrad = getBgGrad();
  const filmBase = isDark ? "#e0ddd5" : "#1c1c22";
  const filmBorder = isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
  const holeColor = isDark ? "#c8c4bc" : "#111";
  const holeBorder = isDark ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const titleColor = isDark ? "text-black" : "text-white";
  const subColor = isDark ? "text-black/40" : "text-white/40";
  const divColor = isDark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";

  const getFC = (filmDark: boolean) => {
    if (isDark) return { bg: filmDark ? "#fafaf8" : "#f0ece4", text: "#111111" };
    return { bg: filmDark ? "#0a0a0a" : "#f5f0e8", text: filmDark ? "#ffffff" : "#111111" };
  };

  const p = paramsRef.current;

  return (
    <main className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: isDark ? "#f0eef5" : "#080810" }}>
      <FluidCursor />
      <style jsx global>{`
        .film-strip-active { overflow: hidden !important; scrollbar-width: none !important; }
        .film-strip-active::-webkit-scrollbar { display: none !important; }
      `}</style>

      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute inset-0 z-0 transition-all duration-1000" style={{ background: bgGrad }} />

        {/* 标题 */}
        <div className="absolute top-[16vh] md:top-[12vh] left-0 right-0 z-30 text-center pointer-events-none px-4">
          <AnimatePresence mode="wait">
            <motion.h2 key={activeFilm.id}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
              className={`text-3xl sm:text-4xl md:text-7xl font-serif font-light tracking-tight leading-none ${titleColor} transition-colors duration-700`}>
              {activeFilm.sub}
            </motion.h2>
          </AnimatePresence>
          <motion.div key={activeFilm.id + "-m"}
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 md:mt-4 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
            <span className={`font-mono text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase ${subColor} transition-colors duration-700`}>{activeFilm.desc}</span>
            <span className={`hidden md:inline ${isDark ? "text-void/30" : "text-white/30"}`}>·</span>
            <span className={`font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase cursor-pointer transition-colors pointer-events-auto ${isDark ? "text-black/50 hover:text-black/80" : "text-white/50 hover:text-white/80"}`}
              onClick={() => handleNav(activeFilm.id)}>View project →</span>
          </motion.div>
        </div>

        {/* ─── 3D 胶卷带 ─── */}
        <div className="absolute left-0 w-full" style={{ top: "50%", transform: "translateY(-50%)" }}>
          <div ref={trackRef} className="flex" style={{ willChange: "transform" }}>
            {STRIP.map((film, i) => {
              const c = getFC(film.dark);
              const sprocketCount = isMobile ? SPROCKETS_MOBILE : SPROCKETS_DESKTOP;
              const frameW = isMobile ? 80 : 48;
              const mR = isMobile ? "-4vw" : "-1.5vw";
              const stripH = isMobile ? "50vh" : "62vh";
              return (
                <div key={`s-${i}`} className="shrink-0 relative cursor-pointer group"
                  style={{ width: `${frameW}vw`, marginRight: mR, height: stripH }}
                  onClick={() => handleNav(film.id)}>

                  <div data-3d="" className="absolute inset-0 flex flex-col pointer-events-none"
                    style={{ willChange: "transform, filter", transformOrigin: "center center" }}>

                    {/* 上齿孔 */}
                    <div className="shrink-0 flex items-center justify-around px-1 transition-colors duration-700"
                      style={{ height: isMobile ? 24 : 32, backgroundColor: filmBase, borderTop: `1px solid ${filmBorder}`, borderBottom: `1px solid ${filmBorder}` }}>
                      {Array.from({ length: sprocketCount }).map((_, j) => (
                        <div key={j} className="rounded-[2px] transition-colors duration-700"
                          style={{ width: isMobile ? 8 : 12, height: isMobile ? 12 : 16, backgroundColor: holeColor, border: `1px solid ${holeBorder}` }} />
                      ))}
                    </div>

                    {/* 帧主体 */}
                    <div className="flex-1 relative overflow-hidden transition-colors duration-700" style={{ backgroundColor: c.bg }}>
                      <div className="absolute top-0 bottom-0 left-0 w-[1px] transition-colors duration-700" style={{ backgroundColor: divColor }} />
                      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

                      <div className="absolute top-3 md:top-4 left-3 md:left-5 font-mono text-[8px] md:text-[10px] tracking-[0.4em] uppercase" style={{ color: `${c.text}30` }}>FRM_{film.num}</div>
                      <div className="absolute top-1 md:top-2 right-3 md:right-5 font-mono text-4xl md:text-7xl font-black" style={{ color: `${c.text}06` }}>{film.num}</div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center">
                        <h3 className="text-[12vw] md:text-[5.5vw] font-black uppercase tracking-tighter leading-[0.85] group-hover:tracking-normal transition-all duration-500"
                          style={{ color: c.text }}>{film.title}</h3>
                        <div className="mt-2 md:mt-4 flex items-center gap-2 md:gap-4">
                          <div className="w-4 md:w-8 h-[1px]" style={{ backgroundColor: `${c.text}25` }} />
                          <span className="font-mono text-xs md:text-base tracking-[0.2em] md:tracking-[0.3em]" style={{ color: `${c.text}50` }}>{film.sub}</span>
                          <div className="w-4 md:w-8 h-[1px]" style={{ backgroundColor: `${c.text}25` }} />
                        </div>
                        <p className="mt-2 md:mt-3 font-mono text-[8px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-30 group-hover:opacity-60 transition-opacity"
                          style={{ color: c.text }}>{film.desc}</p>
                        <div className="hidden md:block mt-6 px-8 py-3 border rounded-full font-mono text-xs tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                          style={{ borderColor: `${c.text}20`, color: `${c.text}60` }}>[ Enter → ]</div>
                      </div>

                      <div className="absolute bottom-2 md:bottom-4 left-3 md:left-5 right-3 md:right-5 flex justify-between">
                        <span className="font-mono text-[7px] md:text-[9px] tracking-widest uppercase" style={{ color: `${c.text}15` }}>TC 00:{film.num}:00:00</span>
                        <span className="font-mono text-[7px] md:text-[9px] tracking-widest uppercase" style={{ color: `${c.text}15` }}>35MM KODAK</span>
                      </div>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />
                    </div>

                    {/* 下齿孔 */}
                    <div className="shrink-0 flex items-center justify-around px-1 transition-colors duration-700"
                      style={{ height: isMobile ? 24 : 32, backgroundColor: filmBase, borderTop: `1px solid ${filmBorder}`, borderBottom: `1px solid ${filmBorder}` }}>
                      {Array.from({ length: sprocketCount }).map((_, j) => (
                        <div key={j} className="rounded-[2px] transition-colors duration-700"
                          style={{ width: isMobile ? 8 : 12, height: isMobile ? 12 : 16, backgroundColor: holeColor, border: `1px solid ${holeBorder}` }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部导航控制器 (居中，避免挡住右下角的昼夜开关) */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 md:gap-8">
          <button className={`w-8 h-8 md:w-12 md:h-12 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-colors text-xs md:text-base pointer-events-auto ${isDark ? "bg-white/60 border-black/10 text-black hover:bg-black/10" : "bg-black/60 border-white/10 text-white hover:bg-white/10"}`}
            onClick={() => nudge(-1)}>←</button>
          
          <span className={`font-mono text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase pointer-events-none whitespace-nowrap ${isDark ? "text-black/30" : "text-white/25"}`}>
            {isMobile ? "← Swipe →" : "☝ Scroll to Explore ☝"}
          </span>

          <button className={`w-8 h-8 md:w-12 md:h-12 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-colors text-xs md:text-base pointer-events-auto ${isDark ? "bg-white/60 border-black/10 text-black hover:bg-black/10" : "bg-black/60 border-white/10 text-white hover:bg-white/10"}`}
            onClick={() => nudge(1)}>→</button>
        </div>
      </div>

      {/* 导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 md:py-5 flex justify-between items-center pointer-events-none">
        <div className="group cursor-pointer flex items-center gap-3 md:gap-4 pointer-events-auto">
          {/* 高级动态 Logo 图形 */}
          <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
            <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite] transition-colors duration-700 ${isDark ? "text-black/80" : "text-white/80"}`}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="20 10" className="opacity-50" />
            </svg>
            <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse] transition-colors duration-700 ${isDark ? "text-black/60" : "text-white/60"}`}>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
            </svg>
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 group-hover:scale-150 ${isDark ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]" : "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"}`} />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-base md:text-xl font-black tracking-widest transition-colors duration-700 ${titleColor}`}>
              <ScrambleText text="影评社" />
            </h1>
            <span className={`font-mono text-[7px] md:text-[8px] tracking-[0.3em] md:tracking-[0.4em] uppercase transition-colors duration-700 ${isDark ? "text-black/40" : "text-white/30"}`}>Film Review Society</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
          <span className={`font-mono text-[9px] tracking-[0.3em] uppercase hidden md:block transition-colors duration-700 ${isDark ? "text-black/40" : "text-white/30"}`}>Selected Work</span>
          <MagneticButton href="https://user.qzone.qq.com/3467086016" target="_blank" theme="mix">[ Contact ]</MagneticButton>
        </div>
      </nav>

      {/* 转场蒙版 */}
      <AnimatePresence>
        {transitioningTo && (
          <motion.div className="fixed inset-0 z-[100] pointer-events-none"
            style={{ backgroundColor: transitioningTo === "leifeng" ? "#f5f0e8" : "#050505" }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }} />
        )}
      </AnimatePresence>
    </main>
  );
}