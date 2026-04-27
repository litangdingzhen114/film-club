"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { DEAFENING_ARTICLES } from "@/src/lib/data";

function RevealText({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

function StatBox({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.92 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="border border-paper/15 bg-paper/5 p-5 rounded-xl hover:border-paper/40 hover:bg-paper/10 transition-all duration-500">
      <p className="font-mono text-[9px] tracking-[0.3em] text-paper/40 uppercase mb-2">{label}</p>
      <p className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight text-paper">{value}</p>
    </motion.div>
  );
}

function CharCard({ name, actor, role, delay = 0 }: { name: string; actor: string; role: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: 16 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex gap-5 items-start group border-b border-paper/10 pb-5 last:border-0 last:pb-0">
      <div className="w-10 h-10 shrink-0 rounded-full bg-paper/10 flex items-center justify-center font-black text-base text-paper group-hover:bg-paper/20 transition-colors">{name[0]}</div>
      <div>
        <p className="font-black text-base text-paper">{name}</p>
        <p className="font-mono text-[10px] text-paper/50 tracking-wider mt-1">饰 / {actor}</p>
        <p className="text-sm text-paper/60 mt-1.5 leading-relaxed">{role}</p>
      </div>
    </motion.div>
  );
}

function TimelineBlock({ year, event }: { year: string; event: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex gap-5 border-b border-paper/10 pb-5 last:border-0 last:pb-0">
      <span className="font-mono text-[10px] text-paper/30 tracking-widest w-14 shrink-0 pt-0.5">{year}</span>
      <p className="text-sm text-paper/70 leading-relaxed">{event}</p>
    </motion.div>
  );
}

/* ─── Infinite Marquee ─────────────────────────────────── */
const MARQUEE_WORDS = ["震耳欲聋", "2025", "聋人权益", "万力", "檀健次", "SOUND OF SILENCE", "法律援助", "饶晓志", "社会议题", "兰西雅", "无声的呐喊", "犯罪剧情", "手语"];
function Marquee({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="overflow-hidden flex whitespace-nowrap py-4 border-y border-paper/10 select-none">
      <motion.div className="flex gap-8 shrink-0"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}>
        {doubled.map((w, i) => (
          <span key={i} className="font-mono text-xs tracking-[0.3em] uppercase text-paper/25 shrink-0">
            {w} <span className="text-paper/20 mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Thematic Tags ────────────────────────────────────── */
const TAGS = [
  { text: "无声", size: "text-4xl md:text-6xl" },
  { text: "法律", size: "text-2xl md:text-4xl" },
  { text: "聋人", size: "text-5xl md:text-7xl" },
  { text: "2025", size: "text-3xl md:text-5xl font-mono" },
  { text: "呐喊", size: "text-6xl md:text-8xl" },
  { text: "正义", size: "text-2xl md:text-3xl" },
  { text: "手语", size: "text-3xl md:text-4xl" },
  { text: "万力", size: "text-xl md:text-2xl font-mono" },
  { text: "震耳", size: "text-4xl md:text-5xl" },
];

export default function DeafeningAboutPage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"synopsis" | "theme" | "impact">("synopsis");
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const tabs = {
    synopsis: {
      title: "剧情梗概",
      content: "出身于聋人家庭、能够使用手语的律师李淇（檀健次）因为自己特殊的背景，被卷入一起复杂的针对聋人群体的诈骗案件。案件初期，李淇试图借此出名，但随着调查深入，他发现整个案件远比表面复杂——背后涉及信息不对称、系统性剥削以及聋人群体长期被忽视的生存困境。最终，在欲望与良知之间挣扎的李淇选择站在弱势群体一边，用法律武器为他们发声。"
    },
    theme: {
      title: "主题解读",
      content: "《震耳欲聋》的片名本身即是一个悖论：电影讲述的是听障者的世界，却以「震耳欲聋」为名。这不是反讽，而是宣言——那些被世界遗忘的无声呼喊，其实比任何噪音都更能穿透灵魂。影片借法律叙事外壳探讨的核心问题是：当一个群体长期活在社会的声音盲区，正义的耳膜是否还能感知他们的震动？"
    },
    impact: {
      title: "社会影响",
      content: "影片取材于上海律师张琪的真实从业经历，将聋障群体在法律系统中的真实遭遇搬上银幕，引发广泛社会讨论。饶晓志作为监制的参与保证了影片在商业性与社会议题之间的平衡。万力以这部首作建立了自己独特的「社会切片式」叙事风格——没有宏大的英雄主义，只有真实的困境与不得不做出的选择。"
    }
  };

  const previewArticles = DEAFENING_ARTICLES.slice(0, 4);

  return (
    <main ref={containerRef} className="relative bg-void text-paper selection:bg-paper selection:text-void overflow-x-hidden">
      <FluidCursor />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-24 py-4 md:py-6 flex flex-wrap justify-between items-center gap-2 text-xs font-mono tracking-widest uppercase bg-void/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <MagneticButton href="/deafening">[ 返回 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8 opacity-60">
          <MagneticButton href="/">[ 主页 ]</MagneticButton>
          <MagneticButton href="/deafening/archive">[ 影评库 ]</MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-end p-6 md:p-24 pt-28 overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-paper/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-paper/5 rounded-full blur-[100px] translate-y-1/3" />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.08) 60px, rgba(255,255,255,0.08) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.08) 60px, rgba(255,255,255,0.08) 61px)" }} />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }}>
          <motion.div className="font-mono text-xs tracking-[0.5em] text-paper/30 uppercase mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 1.5, delay: 0.2 }}>
            DEAFENING // 震耳欲聋 // 2025
          </motion.div>
          <motion.h1 className="text-[min(16vw,6.5rem)] md:text-[12vw] font-black uppercase tracking-tighter leading-none mb-4"
            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }}>
            <span className="block">震耳</span>
            <span className="block text-paper/20">欲聋</span>
          </motion.h1>
          <motion.div className="flex flex-wrap gap-3 items-center mt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            {["2025", "犯罪 · 剧情", "万力 导演", "檀健次 主演"].map((tag) => (
              <span key={tag} className="font-mono text-sm text-paper/40 tracking-wider border border-paper/10 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </motion.div>
          <motion.p className="mt-8 text-base md:text-xl font-light leading-relaxed text-paper/60 max-w-2xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }}>
            当一个群体长期活在社会的声音盲区，<br />法律的耳膜，是否还能感知他们震耳欲聋的呼喊？
          </motion.p>
          <motion.div className="mt-8 flex items-center gap-3 text-paper/20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
            <span className="font-mono text-xs tracking-widest">向下滚动探索</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee 1 ── */}
      <Marquee />

      {/* ── Film Stats ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-paper/10">
        <RevealText className="font-mono text-xs tracking-[0.4em] text-paper/40 uppercase mb-8">FILM DATA // 影片信息</RevealText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="上映年份" value="2025" delay={0} />
          <StatBox label="类型" value="犯罪 剧情" delay={0.1} />
          <StatBox label="导演" value="万力" delay={0.2} />
          <StatBox label="监制" value="饶晓志" delay={0.3} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 max-w-xs">
          <StatBox label="主演" value="檀健次" delay={0.4} />
          <StatBox label="联合主演" value="兰西雅" delay={0.5} />
        </div>
      </section>

      {/* ── Keyword Tag Cloud ── */}
      <section className="px-6 md:px-24 py-10 md:py-14 border-t border-paper/10">
        <RevealText className="font-mono text-xs tracking-[0.4em] text-paper/30 uppercase mb-8">THEMES // 主题词云</RevealText>
        <div className="flex flex-wrap gap-4 md:gap-6 items-baseline leading-tight">
          {TAGS.map((tag, i) => (
            <RevealText key={tag.text} delay={i * 0.04}>
              <span className={`${tag.size} font-black uppercase tracking-tighter text-paper/${i % 3 === 0 ? "80" : i % 3 === 1 ? "30" : "15"} leading-none`}>
                {tag.text}
              </span>
            </RevealText>
          ))}
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-paper/10">
        <RevealText className="mb-8">
          <div className="flex gap-0 border border-paper/10 rounded-xl overflow-hidden w-fit">
            {(["synopsis", "theme", "impact"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? "bg-paper text-void" : "text-paper/40 hover:text-paper/70"}`}>
                {tabs[tab].title}
              </button>
            ))}
          </div>
        </RevealText>
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-5 leading-tight text-paper">{tabs[activeTab].title}</h2>
          <p className="text-base md:text-lg leading-loose text-paper/70 font-light">{tabs[activeTab].content}</p>
        </motion.div>
      </section>

      {/* ── Characters ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-y border-paper/10">
        <RevealText className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-none">主要人物</h2>
          <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-3">CAST & CHARACTERS</p>
        </RevealText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-5">
            <CharCard name="李淇" actor="檀健次" role="出身聋人家庭的律师，能熟练使用手语。被卷入聋人反诈案后，他在名利与良知之间挣扎，最终选择站在弱势群体一边。" delay={0} />
            <CharCard name="兰西雅饰角色" actor="兰西雅" role="案件中的关键女性角色，在故事发展中成为李淇改变立场的重要情感锚点。" delay={0.15} />
          </div>
          <div className="space-y-5">
            <CharCard name="张琪（原型）" actor="真实人物" role="上海律师，影片主角的真实原型。他长期为聋人群体提供法律援助，其从业经历为影片提供了核心叙事基础。" delay={0.3} />
            <CharCard name="聋人受害者群体" actor="群像演员" role="影片花费了大量笔墨于这一群像，用手语、表情和肢体语言，呈现了他们面对不公时无声而震耳的抵抗。" delay={0.45} />
          </div>
        </div>
      </section>

      {/* ── Director ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-b border-paper/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <RevealText>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 leading-tight text-paper">万力 × 饶晓志</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mb-5">DIRECTOR × PRODUCER</p>
            <p className="text-base leading-loose text-paper/70 font-light">这是万力的首部执导长片。以一部处女作便敢于正面触碰社会议题、聚焦边缘群体，需要相当的勇气。监制饶晓志凭借在商业院线类型片上的丰富经验，帮助影片在艺术表达与市场可及性之间找到了精准的平衡点。两人的组合，让《震耳欲聋》既有独立电影的深度，又拥有大众传播的力量。</p>
          </RevealText>
          <RevealText delay={0.2}>
            <div className="space-y-4">
              {[
                { role: "导演", name: "万力", note: "首部长片，社会切片式叙事风格" },
                { role: "监制", name: "饶晓志", note: "商业院线类型片资深监制" },
                { role: "主演", name: "檀健次", note: "兼具偶像与实力的内地男演员" },
                { role: "联合主演", name: "兰西雅", note: "新生代演员，强情感张力" },
                { role: "素材原型", name: "张琪律师", note: "上海聋人权益法律援助实践者" },
              ].map((item, i) => (
                <RevealText key={item.role} delay={i * 0.07}>
                  <div className="flex gap-5 border-b border-paper/10 pb-4 last:border-0 last:pb-0">
                    <span className="font-mono text-[9px] tracking-widest text-paper/30 uppercase w-16 shrink-0 pt-1">{item.role}</span>
                    <div>
                      <p className="font-black text-sm text-paper">{item.name}</p>
                      <p className="font-mono text-[10px] text-paper/40 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
          </RevealText>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-b border-paper/10">
        <RevealText className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-none">
            创作背景 <span className="text-paper/20">CONTEXT</span>
          </h2>
        </RevealText>
        <div className="max-w-2xl mx-auto space-y-5">
          <TimelineBlock year="现实" event="聋人群体在中国长期面临信息不对称困境：法律文书难以获取、庭审缺乏手语翻译、法律权益讨索渠道不畅，成为沉默已久的系统性问题。" />
          <TimelineBlock year="原型" event="上海律师张琪出于个人经历关注聋人群体法律需求，长期提供援助，其案例积累构成了影片核心故事的现实基础。" />
          <TimelineBlock year="创作" event="导演万力与监制饶晓志决定将这一现实议题搬上银幕，以犯罪悬疑类型片包裹社会批判内核，使其具有更广泛的观众可及性。" />
          <TimelineBlock year="2025" event="《震耳欲聋》公映，引发观众对聋人群体法律权益及社会结构性不平等问题的广泛讨论。" />
        </div>
      </section>

      {/* ── Marquee 2 (reverse) ── */}
      <Marquee reverse />

      {/* ── Why It Matters ── */}
      <section className="px-6 md:px-24 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <RevealText className="mb-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-tight">为何值得一看</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-3">WHY IT MATTERS</p>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "无声的震耳", body: "影片用手语、表情、眼神代替对白，用无声语言证明：当一个群体不得不保持沉默，那种沉默本身就是对世界最震耳欲聋的控诉。" },
              { num: "02", title: "法律叙事的温度", body: "很少有国产院线电影能够在犯罪类型片框架内保持如此细腻的人文关怀。万力证明了商业性与社会性可以共存。" },
              { num: "03", title: "檀健次的突破", body: "从偶像路线出发，在这部影片中交出了一份真正有质感的表演，证明了演员与角色之间化学反应的不可替代性。" }
            ].map((item) => (
              <RevealText key={item.num} delay={Number(item.num) * 0.1}>
                <div className="border border-paper/10 rounded-2xl p-6 h-full bg-paper/5 hover:border-paper/30 hover:bg-paper/10 transition-all duration-500 group">
                  <p className="font-mono text-4xl font-black text-paper/10 mb-4 group-hover:text-paper/20 transition-colors">{item.num}</p>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-paper">{item.title}</h3>
                  <p className="text-sm text-paper/60 leading-relaxed">{item.body}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ── Article Preview Strip ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-paper/10">
        <RevealText className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-paper">精选影评预览</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-2">FEATURED REVIEWS</p>
          </div>
          <MagneticButton href="/deafening/archive">[ 全部 →]</MagneticButton>
        </RevealText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewArticles.map((art, i) => (
            <Link key={art.id} href={`/deafening/archive/${art.id}`} className="block h-full cursor-none">
              <RevealText delay={i * 0.08} className="h-full">
                <div className="border border-paper/10 rounded-xl p-6 bg-paper/5 hover:border-paper/25 hover:bg-paper/10 transition-all duration-400 h-full flex flex-col group">
                  <p className="font-mono text-[10px] tracking-widest text-paper/40 uppercase mb-4">{art.classInfo} · {art.author}</p>
                  <h3 className="text-lg md:text-xl font-black text-paper leading-snug mb-4 line-clamp-2 group-hover:text-paper transition-colors">{art.title}</h3>
                  <p className="text-sm text-paper/60 leading-relaxed line-clamp-4 mt-auto">{art.excerpt}</p>
                </div>
              </RevealText>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="px-6 md:px-24 py-16 md:py-20 border-t border-paper/10">
        <RevealText className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6 text-paper">读同学们的影评</h2>
          <p className="text-base md:text-lg text-paper/60 font-light mb-8 leading-relaxed">
            来自浙江特殊教育职业学院的同学们写下了他们对这部影片最真实的感受——<br />作为聋人群体最近的守望者，他们的视角格外珍贵。
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="/deafening/archive">[ 进入影评库 →]</MagneticButton>
            <MagneticButton href="/deafening">[ 优秀影评 ]</MagneticButton>
          </div>
        </RevealText>
      </section>
    </main>
  );
}
