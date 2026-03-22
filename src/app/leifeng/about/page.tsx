"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { LEIFENG_ARTICLES } from "@/src/lib/data";

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
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="border border-ink/15 bg-void/5 p-5 rounded-xl hover:border-ink/30 hover:bg-void/10 transition-all duration-500">
      <p className="font-mono text-[9px] tracking-[0.3em] opacity-40 uppercase mb-2">{label}</p>
      <p className="text-xl md:text-2xl font-serif font-bold leading-tight">{value}</p>
    </motion.div>
  );
}

function CharCard({ name, actor, role, delay = 0 }: { name: string; actor: string; role: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -16 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex gap-5 items-start group border-b border-ink/10 pb-5 last:border-0 last:pb-0">
      <div className="w-10 h-10 shrink-0 rounded-full bg-ink/10 flex items-center justify-center font-serif text-lg font-bold group-hover:bg-ink/20 transition-colors">{name[0]}</div>
      <div>
        <p className="font-bold text-base leading-tight">{name}</p>
        <p className="font-mono text-[10px] opacity-50 tracking-wider mt-1">饰 / {actor}</p>
        <p className="text-sm opacity-60 mt-1.5 leading-relaxed">{role}</p>
      </div>
    </motion.div>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.blockquote ref={ref} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9 }} className="border-l-4 border-ink/40 pl-6 md:pl-8 py-3">
      <p className="text-xl md:text-2xl font-serif font-light leading-relaxed italic opacity-80">"{text}"</p>
      <cite className="block mt-3 font-mono text-xs tracking-widest opacity-40 not-italic uppercase">— {attribution}</cite>
    </motion.blockquote>
  );
}

/* ─── Infinite Marquee ─────────────────────────────────── */
const MARQUEE_WORDS = ["奉献精神", "雷锋", "1964", "为人民服务", "八一电影制片厂", "黑白影像", "董兆琪", "善意", "日常英雄主义", "白描叙事", "普通战士", "六十年", "浙特教院"];
function Marquee({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="overflow-hidden flex whitespace-nowrap py-4 border-y border-ink/10 select-none">
      <motion.div
        className="flex gap-8 shrink-0"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {doubled.map((w, i) => (
          <span key={i} className="font-mono text-xs tracking-[0.3em] uppercase opacity-30 shrink-0">
            {w} <span className="opacity-40 mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Thematic Tags ────────────────────────────────────── */
const TAGS = [
  { text: "现实主义", size: "text-3xl md:text-5xl" },
  { text: "黑白", size: "text-xl md:text-3xl" },
  { text: "平凡善意", size: "text-4xl md:text-6xl" },
  { text: "1964", size: "text-5xl md:text-7xl font-mono" },
  { text: "奉献", size: "text-2xl md:text-4xl" },
  { text: "日常英雄", size: "text-3xl md:text-5xl" },
  { text: "人民", size: "text-xl md:text-2xl" },
  { text: "八一厂", size: "text-2xl md:text-3xl font-mono" },
  { text: "60年", size: "text-3xl md:text-4xl" },
  { text: "学雷锋", size: "text-4xl md:text-5xl" },
];

export default function LeifengAboutPage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"synopsis" | "theme" | "context">("synopsis");
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const tabs = {
    synopsis: {
      title: "剧情梗概",
      content: "电影以二十世纪五六十年代为背景，国家正处于困难时期。雷锋从湖南农村走来，一个失去父母、备受苦难的孤儿，在党的培育下成长为中国人民解放军的一名普通士兵。影片通过数个朴实无华的生活片段——风雨中护送老大娘回家、为抗洪捐出全部积蓄、替战友往家里悄悄汇款、出差途中帮助困难旅客……展现了一个年轻生命在短短二十二年里，如何将「把有限的生命投入到无限的为人民服务中去」从誓言变为日常，从日常铸就永恒。"
    },
    theme: {
      title: "主题解读",
      content: "《雷锋》不是一部英雄主义的神话史诗，而是一首工笔白描的日常颂歌。导演董兆琪刻意选取最不起眼的行动——缝补破旧的袜子、冒雨修建工地、默默帮助陌生人——正是要说明，伟大不需要舞台，善意不需要旁观者。影片的黑白影像语言反而成为其力量所在：没有色彩的喧哗，唯有光影的对比，像一本素描本，将时代的褶皱和人性的温度，同时刻进同一帧画面里。"
    },
    context: {
      title: "历史背景",
      content: "1963年3月5日，毛泽东发表题词「向雷锋同志学习」，由此开启了延续至今的「学雷锋」运动。而这部1964年出品的同名电影，正是在这一政治文化背景下，对雷锋精神进行的第一次系统性银幕诠释。影片在特定历史语境中诞生，却并未因此失去人道温度——它记录的，是一个真实存在过的年轻人对世界发出的真实善意，这种善意跨越了时代，在当下仍然引发共鸣。"
    }
  };

  const previewArticles = LEIFENG_ARTICLES.slice(0, 4);

  return (
    <main ref={containerRef} className="relative bg-paper text-ink theme-warm selection:bg-ink selection:text-paper overflow-x-hidden">
      <FluidCursor />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-24 py-4 md:py-6 flex flex-wrap justify-between items-center gap-2 text-xs font-mono tracking-widest uppercase bg-paper/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <MagneticButton href="/leifeng" theme="ink">[ 返回 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8 opacity-60">
          <MagneticButton href="/" theme="ink">[ 主页 ]</MagneticButton>
          <MagneticButton href="/leifeng/archive" theme="ink">[ 影评库 ]</MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-end p-6 md:p-24 pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-ash/40 rounded-full blur-[120px] translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] bg-ash/20 rounded-full blur-[100px] translate-y-1/2" />
        </div>
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div className="font-mono text-xs tracking-[0.4em] opacity-40 uppercase mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ duration: 1.5, delay: 0.2 }}>
            LEIFENG // 八一电影制片厂 // 1964
          </motion.div>
          <motion.h1 className="text-[min(18vw,7rem)] md:text-[14vw] font-serif font-bold leading-none tracking-tight mb-4"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }}>
            雷锋
          </motion.h1>
          <motion.div className="flex flex-wrap gap-4 items-center mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            {["1964", "故事片", "黑白", "导演 董兆琪"].map(t => (
              <span key={t} className="font-mono text-sm opacity-40 tracking-wider border border-ink/10 px-3 py-1 rounded-full">{t}</span>
            ))}
          </motion.div>
          <motion.p className="text-base md:text-xl font-light leading-relaxed opacity-60 max-w-2xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }}>
            把有限的生命，投入到无限的为人民服务中去。
            <br /><span className="font-mono text-sm tracking-widest opacity-60">— 雷锋</span>
          </motion.p>
          <motion.div className="mt-8 flex items-center gap-3 opacity-30"
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 1, delay: 1 }}>
            <span className="font-mono text-xs tracking-widest">向下滚动探索</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee 1 ── */}
      <Marquee />

      {/* ── Film Stats ── */}
      <section className="px-6 md:px-24 py-12 md:py-16">
        <RevealText className="font-mono text-xs tracking-[0.4em] opacity-40 uppercase mb-8">FILM DATA // 影片信息</RevealText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="上映年份" value="1964" delay={0} />
          <StatBox label="制片单位" value="八一电影制片厂" delay={0.1} />
          <StatBox label="影片格式" value="黑白故事片" delay={0.2} />
          <StatBox label="导演" value="董兆琪" delay={0.3} />
        </div>
      </section>

      {/* ── Keyword Tag Cloud ── */}
      <section className="px-6 md:px-24 py-10 md:py-14 border-t border-ink/10">
        <RevealText className="font-mono text-xs tracking-[0.4em] opacity-40 uppercase mb-8">THEMES // 主题词云</RevealText>
        <div className="flex flex-wrap gap-4 md:gap-6 items-baseline leading-tight">
          {TAGS.map((tag, i) => (
            <RevealText key={tag.text} delay={i * 0.04}>
              <span className={`${tag.size} font-serif font-bold opacity-${i % 3 === 0 ? "90" : i % 3 === 1 ? "40" : "20"} leading-none`}>
                {tag.text}
              </span>
            </RevealText>
          ))}
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-ink/10">
        <RevealText className="mb-8">
          <div className="flex gap-0 border border-ink/10 rounded-xl overflow-hidden w-fit">
            {(["synopsis", "theme", "context"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? "bg-ink text-paper" : "text-ink/40 hover:text-ink/70"}`}>
                {tabs[tab].title}
              </button>
            ))}
          </div>
        </RevealText>
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-5 leading-tight">{tabs[activeTab].title}</h2>
          <p className="text-base md:text-lg leading-loose opacity-70 font-light">{tabs[activeTab].content}</p>
        </motion.div>
      </section>

      {/* ── Characters ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 bg-ash/30 border-y border-ink/10">
        <RevealText className="mb-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">主要人物</h2>
          <p className="font-mono text-xs tracking-[0.3em] opacity-40 uppercase mt-3">CAST & CHARACTERS</p>
        </RevealText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-6">
            <CharCard name="雷锋" actor="董金棠" role="故事主角。湖南农村出身的孤儿，在党的培育下成长为解放军战士，以平凡行动书写极致温情。" delay={0} />
            <CharCard name="王大力" actor="杨贵发" role="雷锋的战友，见证并参与了雷锋日常无私服务人民的点滴瞬间。" delay={0.1} />
            <CharCard name="吴奎" actor="党同义" role="营地中的另一位辅助角色，以对比的方式衬托出雷锋精神的可贵。" delay={0.2} />
          </div>
          <div className="space-y-6">
            <CharCard name="大粗" actor="杨秦华" role="连队战友，参与了影片中几个重要的集体场景，代表着普通战士群像。" delay={0.3} />
            <CharCard name="指导员" actor="于纯绵" role="雷锋所在连队的政治指导员，在精神引领上给予了雷锋重要的支持与肯定。" delay={0.4} />
            <CharCard name="梁主任" actor="苏友邻" role="工厂领导，在抗洪救灾场景中出现，亲历了雷锋义无反顾的奉献精神。" delay={0.5} />
          </div>
        </div>
      </section>

      {/* ── Director ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-b border-ink/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <RevealText>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3 leading-tight">董兆琪</h2>
            <p className="font-mono text-xs tracking-[0.3em] opacity-40 uppercase mb-5">DIRECTOR // 导演</p>
            <p className="text-base leading-loose opacity-70 font-light">八一电影制片厂导演，以严谨克制的现实主义风格著称。拍摄《雷锋》时，董兆琪刻意回避了宏大叙事的路径，选择以平视镜头和日常场景切入，力求让观众感受到真实的人，而不是偶像化的符号。这种叙事选择在当时格外难得，也令这部影片历经六十年仍有打动人心的力量。</p>
          </RevealText>
          <RevealText delay={0.2}>
            <div className="border border-ink/10 rounded-2xl p-6 bg-void/5 space-y-4">
              {[
                { k: "制片机构", v: "八一电影制片厂" },
                { k: "影像风格", v: "黑白现实主义" },
                { k: "叙事手法", v: "白描式 · 生活片段剪辑" },
                { k: "首映年份", v: "1964年" },
              ].map(row => (
                <div key={row.k} className="border-b border-ink/8 pb-4 last:border-0 last:pb-0">
                  <p className="font-mono text-[9px] tracking-[0.4em] opacity-40 uppercase mb-1">{row.k}</p>
                  <p className="text-lg font-bold">{row.v}</p>
                </div>
              ))}
            </div>
          </RevealText>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="px-6 md:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <QuoteBlock text="人的生命是有限的，可是，为人民服务是无限的，我要把有限的生命，投入到无限的为人民服务之中去。" attribution="雷锋 日记" />
        </div>
      </section>

      {/* ── Marquee 2 (reverse) ── */}
      <Marquee reverse />

      {/* ── Cultural Significance ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 bg-ash/30 border-t border-ink/10">
        <div className="max-w-5xl mx-auto">
          <RevealText className="mb-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">文化意义</h2>
            <p className="font-mono text-xs tracking-[0.3em] opacity-40 uppercase mt-3">CULTURAL SIGNIFICANCE</p>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "政治符号的人性化还原", body: "影片在政治运动的背景下诞生，却成功将政治符号还原为有血肉的个体，令「学雷锋」不再是口号，而是可以落实的日常行动标准。" },
              { num: "02", title: "黑白美学的永恒性", body: "黑白影像强迫观者专注于人物本身，去除了色彩带来的时代感，反而赋予了影片某种跨越时代的普世温度与纪实力量。" },
              { num: "03", title: "当代回响", body: "六十年后，雷锋精神在一批特殊教育院校的学生影评中重新被唤醒，证明善意本身无惧岁月，只要有人愿意看见，它就永远在场。" }
            ].map((item) => (
              <RevealText key={item.num} delay={Number(item.num) * 0.1} className="group">
                <div className="border border-ink/10 rounded-2xl p-6 h-full bg-void/5 hover:border-ink/30 hover:bg-void/10 transition-all duration-500">
                  <p className="font-mono text-4xl font-black opacity-10 mb-4 group-hover:opacity-20 transition-opacity">{item.num}</p>
                  <h3 className="text-lg font-bold mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed">{item.body}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ── Article Preview Strip ── */}
      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-ink/10">
        <RevealText className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">精选影评预览</h2>
            <p className="font-mono text-xs tracking-[0.3em] opacity-40 uppercase mt-2">FEATURED REVIEWS</p>
          </div>
          <MagneticButton href="/leifeng/archive" theme="ink">[ 全部 →]</MagneticButton>
        </RevealText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewArticles.map((art, i) => (
            <Link key={art.id} href={`/leifeng/archive/${art.id}`} className="block h-full cursor-none">
              <RevealText delay={i * 0.08} className="h-full">
                <div className="border border-ink/10 rounded-xl p-6 bg-void/5 hover:border-ink/25 hover:bg-void/10 transition-all duration-400 h-full flex flex-col group">
                  <p className="font-mono text-[10px] tracking-widest opacity-40 uppercase mb-4 text-ink">{art.classInfo} · {art.author}</p>
                  <h3 className="text-lg md:text-xl font-bold leading-snug mb-4 line-clamp-2 group-hover:text-ink transition-colors">{art.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed line-clamp-4 mt-auto">{art.excerpt}</p>
                </div>
              </RevealText>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="px-6 md:px-24 py-16 md:py-20 border-t border-ink/10">
        <RevealText className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-serif font-bold leading-tight mb-6">读同学们怎么说</h2>
          <p className="text-base md:text-lg opacity-60 font-light mb-8 leading-relaxed">
            来自浙江特殊教育职业学院各班同学的真实文字，记录下雷锋精神在特教校园里的真实温度。
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="/leifeng/archive" theme="ink">[ 进入影评库 →]</MagneticButton>
            <MagneticButton href="/leifeng" theme="ink">[ 优秀影评 ]</MagneticButton>
          </div>
        </RevealText>
      </section>
    </main>
  );
}
