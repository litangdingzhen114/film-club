"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { LEIFENG_ARTICLES } from "@/src/lib/data";

export default function LeifengArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = LEIFENG_ARTICLES.filter((art) => {
    const query = searchQuery.toLowerCase();
    return art.title.toLowerCase().includes(query) || art.excerpt.toLowerCase().includes(query);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.8 },
    },
  };

  return (
    <main className="relative min-h-screen bg-paper text-ink p-6 md:p-24 theme-warm selection:bg-ink selection:text-paper pb-32">
      <FluidCursor />

      <nav className="relative z-50 mb-8 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs font-mono tracking-widest uppercase opacity-60">
        <MagneticButton href="/leifeng" theme="ink">[ 返回 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8">
          <MagneticButton href="/" theme="ink">[ 主页 ]</MagneticButton>
          <MagneticButton href="/leifeng/about" theme="ink">[ 关于雷锋 ]</MagneticButton>
        </div>
      </nav>

      <header className="mb-12 max-w-4xl">
        <motion.h1
          className="text-4xl sm:text-6xl md:text-8xl font-serif tracking-tight mb-6 md:mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }}
        >
          影评库
        </motion.h1>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="mb-12 max-w-3xl">
        <input
          type="text"
          placeholder="SEARCH ARTICLES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-void/5 border border-void/20 rounded-full px-6 py-3 text-sm font-mono text-void placeholder-void/30 focus:outline-none focus:border-void/50 transition-colors uppercase tracking-widest"
        />
        <p className="mt-4 font-mono text-xs opacity-50 uppercase tracking-widest">
          ARCHIVE DATA /// {filteredArticles.length} RECORDS RETRIEVED.
        </p>
      </motion.div>

      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredArticles.map((item, i) => {
          return (
            <Link key={item.id} href={`/leifeng/archive/${item.id}`} className="cursor-none">
              <motion.article
                variants={itemVariants}
                className="group relative border border-ink/10 bg-void/5 p-8 rounded-2xl h-[20rem] flex flex-col justify-between transition-all duration-500 hover:border-ink/30 hover:shadow-2xl overflow-hidden"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink opacity-40 uppercase mb-4 flex justify-between border-b border-ink/10 pb-2">
                  <span></span>
                  <span className="text-right">
                    {item.classInfo}
                    <br />
                    {item.author}
                  </span>
                </div>
                <div className="relative z-10 flex-1 flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-snug group-hover:translate-x-1 transition-transform line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm opacity-70 leading-relaxed line-clamp-3 mt-auto">
                    {item.excerpt}
                  </p>
                </div>
                
                {/* Design Polish: Subtle number index and background flare */}
                <span className="absolute top-6 left-6 font-mono text-[9px] opacity-20 group-hover:opacity-40 transition-opacity">
                  #{String(i + 1).padStart(3, '0')}
                </span>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-ash/20 rounded-full blur-3xl group-hover:bg-ash/40 transition-colors" />
              </motion.article>
            </Link>
          );
        })}
      </motion.section>
    </main>
  );
}
