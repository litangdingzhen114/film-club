"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import TiltCard from "@/src/components/TiltCard";
import MagneticButton from "@/src/components/MagneticButton";
import { LEIFENG_ARTICLES, LEIFENG_FEATURED_IDS } from "@/src/lib/data";

export default function LeifengFeaturedPage() {
  const featuredArticles = LEIFENG_ARTICLES.filter(art => LEIFENG_FEATURED_IDS.includes(art.id));

  return (
    <main className="relative min-h-screen bg-paper text-ink p-6 md:p-24 theme-warm selection:bg-ink selection:text-paper pb-32">
      <FluidCursor />

      <nav className="relative z-50 mb-8 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs font-mono tracking-widest uppercase opacity-60">
        <MagneticButton href="/" theme="ink">[ 主页 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8">
          <MagneticButton href="/leifeng/archive" theme="ink">[ 影评库 ]</MagneticButton>
          <MagneticButton href="/leifeng/about" theme="ink">[ 关于雷锋 ]</MagneticButton>
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
          Featured Editorial
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredArticles.map((art, index) => (
          <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} className="h-full">
            <Link href={`/leifeng/archive/${art.id}`} className="block h-full cursor-none">
              <TiltCard className="h-full">
                <article className="bg-void/5 border border-ink/10 p-8 h-full flex flex-col hover:bg-void/10 transition-all duration-500 group shadow-lg rounded-xl">
                  <div className="font-mono text-xs opacity-40 mb-8 tracking-widest border-b border-ink/10 pb-4 flex justify-between">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{art.classInfo} · {art.author}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-void transition-colors leading-tight">{art.title}</h3>
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
