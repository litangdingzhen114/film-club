"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { DEAFENING_ARTICLES } from "@/src/lib/data";

export default function DeafeningArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = DEAFENING_ARTICLES.filter((art) => {
    const query = searchQuery.toLowerCase();
    return art.title.toLowerCase().includes(query) || art.excerpt.toLowerCase().includes(query);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "grayscale(100%) blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "grayscale(0%) blur(0px)",
      transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const },
    },
  };

  return (
    <main className="relative min-h-screen bg-void text-paper p-6 md:p-24 selection:bg-paper selection:text-void pb-32">
      <FluidCursor />

      <nav className="relative z-50 mb-8 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs font-mono tracking-widest uppercase opacity-60">
        <MagneticButton href="/deafening">[ 返回 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8">
          <MagneticButton href="/">[ 主页 ]</MagneticButton>
          <MagneticButton href="/deafening/about">[ 关于震耳欲聋 ]</MagneticButton>
        </div>
      </nav>

      <header className="mb-20 max-w-5xl border-l-4 border-paper/20 pl-6 md:pl-10">
        <motion.h1
          className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter mb-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] as const }}
        >
          影评库
        </motion.h1>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mb-12 max-w-5xl pl-6 md:pl-10">
        <input
          type="text"
          placeholder="SEARCH ARTICLES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-paper/5 border border-paper/20 rounded-full px-6 py-3 text-sm font-mono text-paper placeholder-paper/30 focus:outline-none focus:border-paper/50 transition-colors uppercase tracking-widest"
        />
        <p className="mt-4 font-mono text-xs opacity-50 uppercase tracking-widest">
          ARCHIVE DATA /// {filteredArticles.length} RECORDS RETRIEVED.
        </p>
      </motion.div>

      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredArticles.map((item, i) => {
          return (
            <Link key={item.id} href={`/deafening/archive/${item.id}`} className="cursor-none">
              <motion.article
                variants={itemVariants}
                className="group relative border border-paper/10 bg-ash p-8 rounded-2xl h-[20rem] flex flex-col justify-between transition-all duration-500 hover:border-paper/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden text-paper"
              >
                <div className="font-mono text-[10px] tracking-widest text-paper/40 uppercase mb-4 flex justify-between border-b border-paper/10 pb-2">
                  <span></span>
                  <span className="text-right">
                    {item.classInfo}
                    <br />
                    {item.author}
                  </span>
                </div>
                <div className="relative z-10 mt-auto">
                  <h2 className="text-3xl md:text-4xl font-black mb-5 leading-tight group-hover:translate-x-1 transition-transform">
                    {item.title}
                  </h2>
                  <p className="text-sm md:text-base text-paper/70 leading-relaxed line-clamp-5">
                    {item.excerpt}
                  </p>
                </div>
                
                {/* Design Polish: Subtle metadata layout */}
                <span className="absolute top-6 left-6 font-mono text-[9px] opacity-20 group-hover:opacity-40 transition-opacity">
                  REC_{String(i + 1).padStart(3, '0')}
                </span>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-paper/5 rounded-full blur-3xl group-hover:bg-paper/10 transition-colors" />
              </motion.article>
            </Link>
          );
        })}
      </motion.section>
    </main>
  );
}
