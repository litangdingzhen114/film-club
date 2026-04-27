"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { LEIFENG_ARTICLES } from "@/src/lib/data";

export default function LeifengArticleDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const article = LEIFENG_ARTICLES.find((a) => a.id === id);
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
      <main className="relative min-h-screen bg-paper text-ink flex items-center justify-center theme-warm">
        <p className="font-mono text-sm opacity-40">ARTICLE NOT FOUND // 404</p>
      </main>
    );
  }

  // Find next article for footer navigation
  const nextArticle = LEIFENG_ARTICLES.find(a => a.id > id) || LEIFENG_ARTICLES[0];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-paper text-ink theme-warm selection:bg-ink selection:text-paper pb-32 overflow-x-hidden transition-colors duration-700">
      <FluidCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ink origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Background Decor - Large faint character */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-center opacity-[0.03]">
        <span className="text-[60vw] font-serif leading-none select-none">義</span>
      </div>

      <div className="relative z-10 p-6 md:p-24 max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="relative z-50 mb-16 md:mb-24 flex justify-between items-center text-xs font-mono tracking-widest uppercase opacity-60">
          <MagneticButton href="/leifeng/archive" theme="ink">[ 返回影评库 / Back ]</MagneticButton>
          <div className="flex gap-4 md:gap-8">
            <MagneticButton href="/leifeng" theme="ink">[ 优秀影评 ]</MagneticButton>
            <MagneticButton href="/" theme="ink">[ 主页 ]</MagneticButton>
          </div>
        </nav>

        {/* Article Header */}
        <motion.header
          className="mb-16 md:mb-28 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] opacity-40 uppercase mb-8 flex flex-wrap gap-4 md:gap-8 items-center">
            <span className="border border-ink/20 px-4 py-1.5 rounded-full text-sm md:text-base font-bold">{article.author}</span>
            <span className="opacity-20">/</span>
            <span>{article.classInfo}</span>
            <span className="opacity-20">/</span>
            <span>LEIFENG // ARCHIVE</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-12 tracking-tight">
            {article.title}
          </h1>
          
          <div className="flex gap-8 items-start">
            <div className="w-12 h-px bg-ink/20 mt-4 shrink-0 hidden sm:block" />
            <p className="text-xl md:text-3xl opacity-60 leading-relaxed font-light italic">
              {article.excerpt}
            </p>
          </div>
        </motion.header>

        {/* Article Body */}
        <motion.article
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {/* Keywords / Tags */}
          <div className="flex flex-wrap gap-3 mb-12">
            {article.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 bg-ink/5 border border-ink/10 rounded-full text-xs font-mono tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                # {tag}
              </span>
            ))}
          </div>

          {/* Main content area */}
          <div className="prose prose-serif max-w-none text-lg md:text-xl leading-[2] text-ink/90 space-y-8 font-serif">
            {article.content.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="indent-8">{para.trim()}</p>
            ))}
          </div>
        </motion.article>

        {/* Footer Navigation - Next Article Preview */}
        <motion.footer
          className="mt-32 pt-16 border-t border-ink/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <Link href={`/leifeng/archive/${nextArticle.id}`} className="max-w-md group">
              <p className="font-mono text-[10px] tracking-widest opacity-40 uppercase mb-6">阅读下一篇 // NEXT ARTICLE</p>
              <h3 className="text-2xl md:text-4xl font-serif font-bold group-hover:underline underline-offset-8 transition-all">
                {nextArticle.title}
              </h3>
              <p className="mt-4 text-sm opacity-50 line-clamp-2 italic">{nextArticle.excerpt}</p>
            </Link>
            
            <div className="flex flex-col items-end gap-6 w-full md:w-auto">
              <MagneticButton href="/leifeng/archive" theme="ink">
                [ 返回影评库 / Archive ]
              </MagneticButton>
              <p className="font-mono text-[10px] opacity-20 tracking-widest uppercase">
                © {new Date().getFullYear()} LEIFENG REVIEW ARCHIVE
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
