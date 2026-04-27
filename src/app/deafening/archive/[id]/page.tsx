"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { DEAFENING_ARTICLES } from "@/src/lib/data";

export default function DeafeningArticleDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const article = DEAFENING_ARTICLES.find((a) => a.id === id);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reading progress scroll tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!article) {
    return (
      <main className="relative min-h-screen bg-void text-paper flex items-center justify-center">
        <p className="font-mono text-sm opacity-40">ARTICLE NOT FOUND // 404</p>
      </main>
    );
  }

  // Find next article for footer navigation
  const nextArticle = DEAFENING_ARTICLES.find(a => a.id > id) || DEAFENING_ARTICLES[0];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-void text-paper selection:bg-paper selection:text-void pb-32 overflow-x-hidden transition-colors duration-700">
      <FluidCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-paper origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Background Decor - Visual noise grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.08) 60px, rgba(255,255,255,0.08) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.08) 60px, rgba(255,255,255,0.08) 61px)" }} />

      <div className="relative z-10 p-6 md:p-24 max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="relative z-50 mb-16 md:mb-24 flex justify-between items-center text-xs font-mono tracking-widest uppercase opacity-60">
          <MagneticButton href="/deafening/archive">[ 返回影评库 / Back ]</MagneticButton>
          <div className="flex gap-4 md:gap-8">
            <MagneticButton href="/deafening">[ 优秀影评 ]</MagneticButton>
            <MagneticButton href="/">[ 主页 ]</MagneticButton>
          </div>
        </nav>

        {/* Article Header */}
        <motion.header
          className="mb-16 md:mb-28 max-w-5xl border-l-[6px] border-[#e0e0e0]/10 pl-8 md:pl-16 mt-12 md:mt-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-paper/30 uppercase mb-8 flex flex-wrap gap-6 items-center">
            <span className="text-paper/80 font-bold text-sm md:text-base tracking-widest">{article.author}</span>
            <span className="w-8 h-px bg-paper/10" />
            <span>{article.classInfo}</span>
            <span className="w-8 h-px bg-paper/10" />
            <span>DEAFENING // ARCHIVE</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12 text-paper">
            {article.title}
          </h1>
          
          <div className="max-w-3xl">
            <p className="text-base md:text-xl text-paper/60 leading-relaxed font-light font-mono tracking-wide">
              {article.excerpt}
            </p>
          </div>
        </motion.header>

        {/* Article Body */}
        <motion.article
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {/* Keywords / Tags */}
          <div className="flex flex-wrap gap-3 mb-16 border-b border-paper/10 pb-8">
            {article.tags.map(tag => (
              <span key={tag} className="px-5 py-2 bg-paper/5 border border-paper/10 rounded-lg text-xs font-mono tracking-[0.3em] uppercase text-paper/60 hover:bg-paper/10 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {/* Main content area */}
          <div className="prose prose-invert max-w-none text-lg md:text-xl leading-[1.8] text-paper/80 space-y-10 font-sans tracking-wide">
            {article.content.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="mb-6">{para.trim()}</p>
            ))}
          </div>
        </motion.article>

        {/* Footer Navigation - Next Article Preview */}
        <motion.footer
          className="mt-32 pt-16 border-t border-paper/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <Link href={`/deafening/archive/${nextArticle.id}`} className="max-w-md group border-l-2 border-transparent hover:border-paper/40 pl-6 transition-all">
              <p className="font-mono text-[10px] tracking-widest text-paper/30 uppercase mb-4">下一篇评论 // STACK RECOVERY</p>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-paper group-hover:tracking-normal transition-all duration-500">
                {nextArticle.title}
              </h3>
              <p className="mt-4 text-sm text-paper/40 font-mono line-clamp-2">{nextArticle.excerpt}</p>
            </Link>
            
            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
              <MagneticButton href="/deafening/archive">
                [ 返回影评库 / Archive ]
              </MagneticButton>
              <p className="font-mono text-[10px] text-paper/10 tracking-[0.4em] uppercase">
                DEAFENING // SILENCE IS LOUD
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
