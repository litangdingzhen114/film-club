"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import TiltCard from "@/src/components/TiltCard";
import MagneticButton from "@/src/components/MagneticButton";
import { XIAOXIAODEWO_ARTICLES, XIAOXIAODEWO_FEATURED_IDS } from "@/src/lib/data";

export default function XiaoxiaodewoFeaturedPage() {
  const featuredArticles = XIAOXIAODEWO_ARTICLES.filter(art => XIAOXIAODEWO_FEATURED_IDS.includes(art.id));

  return (
    <main className="relative min-h-screen bg-void text-paper p-6 md:p-24 selection:bg-paper selection:text-void pb-32">
      <FluidCursor />

      <nav className="relative z-50 mb-8 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs font-mono tracking-widest uppercase opacity-60">
        <MagneticButton href="/">[ 主页 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8">
          <MagneticButton href="/xiaoxiaodewo/archive">[ 影评库 ]</MagneticButton>
          <MagneticButton href="/xiaoxiaodewo/about">[ 关于小小的我 ]</MagneticButton>
        </div>
      </nav>

      <header className="mb-16 flex flex-col items-start gap-4">
        <motion.h1
          className="text-4xl md:text-6xl font-black tracking-tight mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }}
        >
          优秀文章
        </motion.h1>
        <motion.p
          className="opacity-40 font-mono text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          Featured Editorial // Little Me
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredArticles.map((art, index) => (
          <motion.div 
            key={art.id} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} 
            className="h-full"
          >
            <Link href={`/xiaoxiaodewo/archive/${art.id}`} className="block h-full cursor-none">
              <TiltCard className="h-full">
                <article className="bg-paper/5 border border-paper/10 p-8 h-full flex flex-col hover:bg-paper/10 transition-all duration-500 group shadow-lg rounded-xl">
                  <div className="font-mono text-xs opacity-40 mb-8 tracking-widest border-b border-paper/10 pb-4 flex justify-between">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{art.classInfo} · {art.author}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-paper transition-colors leading-tight">{art.title}</h3>
                  <p className="text-lg md:text-xl opacity-70 leading-relaxed line-clamp-5 mt-auto">{art.excerpt}</p>
                </article>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
