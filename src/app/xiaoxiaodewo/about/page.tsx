"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import FluidCursor from "@/src/components/FluidCursor";
import MagneticButton from "@/src/components/MagneticButton";
import { XIAOXIAODEWO_ARTICLES } from "@/src/lib/data";

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

const MARQUEE_WORDS = ["小小的我", "易烊千玺", "刘春和", "杨荔钠", "苔花如米小", "也学牡丹开", "脑瘫少年", "尊严", "看见", "治愈", "现实主义", "LITTLE ME", "蒋勤勤"];
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

const TAGS = [
  { text: "看见", size: "text-4xl md:text-6xl" },
  { text: "苔花", size: "text-2xl md:text-4xl" },
  { text: "尊严", size: "text-5xl md:text-7xl" },
  { text: "2024", size: "text-3xl md:text-5xl font-mono" },
  { text: "勇敢", size: "text-6xl md:text-8xl" },
  { text: "平视", size: "text-2xl md:text-3xl" },
  { text: "生命", size: "text-3xl md:text-4xl" },
  { text: "春和", size: "text-xl md:text-2xl font-mono" },
  { text: "治愈", size: "text-4xl md:text-5xl" },
];

export default function XiaoxiaodewoAboutPage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"synopsis" | "theme" | "impact">("synopsis");
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const tabs = {
    synopsis: {
      title: "剧情梗概",
      content: "患有脑瘫的少年刘春和（易烊千玺 饰）在高考后的一个夏天，努力想要证明自己可以像普通人一样被世界\u201C看见\u201D。他笨拙又坚定地去培训班应聘老师，照顾年迈的外婆，尝试修补与母亲之间尴尬又深刻的隔阂。在这一连串关于勇气、尊严与和解的故事中，春和不仅圆了外婆的梦，也找到了属于自己生命的出口。"
    },
    theme: {
      title: "主题解读",
      content: "\u201C苔花如米小，也学牡丹开。\u201D影片借用袁枚的这首诗，深刻探讨了边缘个体的生存状态与生命尊严。它不仅是在讲述一个身体有缺憾的少年的故事，更是在拷问整个社会：我们是否拥有一种\u201C平视\u201D的力量，去看见那些被忽视的生命，并承认他们追求幸福与尊严的平等权利？"
    },
    impact: {
      title: "社会价值",
      content: "影片由杨荔钠执导，延续了其\u201C女性三部曲\u201D之后对弱势群体生存状况的深切人文关怀。易烊千玺通过极具挑战性的形体表演，将刘春和这一角色的挣扎与坚韧演绎得入木三分。影片公映后，发起了\u201C无障碍观影\u201D及\u201C苔花公约\u201D等公益活动，极大地推动了社会对脑瘫群体及无障碍环境建设的关注。"
    }
  };

  const previewArticles = XIAOXIAODEWO_ARTICLES.slice(0, 4);

  return (
    <main ref={containerRef} className="relative bg-void text-paper selection:bg-paper selection:text-void overflow-x-hidden">
      <FluidCursor />

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-24 py-4 md:py-6 flex flex-wrap justify-between items-center gap-2 text-xs font-mono tracking-widest uppercase bg-void/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <MagneticButton href="/xiaoxiaodewo">[ 返回 ]</MagneticButton>
        <div className="flex flex-wrap gap-3 md:gap-8 opacity-60">
          <MagneticButton href="/">[ 主页 ]</MagneticButton>
          <MagneticButton href="/xiaoxiaodewo/archive">[ 影评库 ]</MagneticButton>
        </div>
      </nav>

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
            LITTLE ME // 小小的我 // 2024
          </motion.div>
          <motion.h1 className="text-[min(16vw,6.5rem)] md:text-[12vw] font-black uppercase tracking-tighter leading-none mb-4"
            initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 }}>
            <span className="block">小小</span>
            <span className="block text-paper/20">的我</span>
          </motion.h1>
          <motion.div className="flex flex-wrap gap-3 items-center mt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            {["2024", "现实主义 · 剧情", "杨荔钠 导演", "易烊千玺 主演"].map((tag) => (
              <span key={tag} className="font-mono text-sm text-paper/40 tracking-wider border border-paper/10 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </motion.div>
          <motion.p className="mt-8 text-base md:text-xl font-light leading-relaxed text-paper/60 max-w-2xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7 }}>
            每个人都是&ldquo;小小的我&rdquo;，<br />但即使渺小如苔花，也有权利开出属于自己的尊严。
          </motion.p>
          <motion.div className="mt-8 flex items-center gap-3 text-paper/20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
            <span className="font-mono text-xs tracking-widest">向下滚动探索</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
          </motion.div>
        </motion.div>
      </section>

      <Marquee />

      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-paper/10">
        <RevealText className="font-mono text-xs tracking-[0.4em] text-paper/40 uppercase mb-8">FILM DATA // 影片信息</RevealText>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="上映年份" value="2024" delay={0} />
          <StatBox label="类型" value="剧情 现实主义" delay={0.1} />
          <StatBox label="导演" value="杨荔钠" delay={0.2} />
          <StatBox label="领衔主演" value="易烊千玺" delay={0.3} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 max-w-xs">
          <StatBox label="主演" value="蒋勤勤" delay={0.4} />
          <StatBox label="时长" value="126min" delay={0.5} />
        </div>
      </section>

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

      <section className="px-6 md:px-24 py-12 md:py-16 border-y border-paper/10">
        <RevealText className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-none">主要人物</h2>
          <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-3">CAST & CHARACTERS</p>
        </RevealText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-5">
            <CharCard name="刘春和" actor="易烊千玺" role="患有脑瘫的少年，身体摇晃却内心坚毅。他不愿向命运低头，努力追求普通人应有的尊严与被看见的权利。" delay={0} />
            <CharCard name="外婆" actor="艾丽娅" role="春和成长的坚实后盾，给予了他最纯粹的爱与尊重，是春和人生中最温暖的引路人。" delay={0.15} />
          </div>
          <div className="space-y-5">
            <CharCard name="母亲" actor="蒋勤勤" role="春和的母亲，在爱与自责中挣扎，代表了特殊家庭中亲情最复杂而真实的一面。" delay={0.3} />
            <CharCard name="雅雅" actor="周雨彤" role="与春和命运交织的女性角色，她的出现为春和的世界带来了一抹温柔的亮色。" delay={0.45} />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-24 py-12 md:py-16 border-b border-paper/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <RevealText>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 leading-tight text-paper">杨荔钠</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mb-5">DIRECTOR</p>
            <p className="text-base leading-loose text-paper/70 font-light">导演杨荔钠以极具共情能力的视角，捕捉到了残障个体在日常生活中那些细微却深刻的瞬间。她拒绝卖惨与刻意煽情，用&ldquo;平视&rdquo;镜头展现了刘春和作为人的尊严与渴望。这种克制而深刻的表达，让《小小的我》成为一部能够真正触及灵魂的现实主义佳作。</p>
          </RevealText>
          <RevealText delay={0.2}>
            <div className="space-y-4">
              {[
                { role: "导演", name: "杨荔钠", note: "关注边缘群体，细腻现实主义叙事" },
                { role: "主演", name: "易烊千玺", note: "极具挑战性的形体与心理表演" },
                { role: "出品方", name: "联瑞影业", note: "深耕温暖现实主义题材" },
                { role: "关键词", name: "平视生命", note: "尊重差异，拒绝偏见与施舍" },
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

      <section className="px-6 md:px-24 py-12 md:py-16 border-b border-paper/10">
        <RevealText className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-none">
            创作背景 <span className="text-paper/20">CONTEXT</span>
          </h2>
        </RevealText>
        <div className="max-w-2xl mx-auto space-y-5">
          <TimelineBlock year="题材" event="脑瘫患者这一群体在银幕上往往被简化或边缘化，影片试图打破这种局面，还原他们真实且多元的人生诉求。" />
          <TimelineBlock year="表演" event="易烊千玺为了进入刘春和的状态，进行了长期的形体训练与生活观察，力求在细微动作中呈现出角色的生命力。" />
          <TimelineBlock year="2024" event="影片在全国范围内引起强烈反响，不仅是一次成功的艺术创作，更成为一场推动社会平权意识提升的公益行动。" />
        </div>
      </section>

      <Marquee reverse />

      <section className="px-6 md:px-24 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <RevealText className="mb-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-paper leading-tight">为何值得一看</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-3">WHY IT MATTERS</p>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "平视的力量", body: "影片教我们如何真正去\u201C看\u201D一个人，不是同情的、俯视的，而是作为同类的、尊重的\u201C看\u201D。" },
              { num: "02", title: "形体与灵魂", body: "易烊千玺通过极度自律的身体控制，完美契合了刘春和摇晃却执着的灵魂。这是演技的又一次飞跃。" },
              { num: "03", title: "社会之镜", body: "通过刘春和对公交公司的投诉、对职场偏见的对抗，映射出社会在包容性建设上仍需走过的长路。" }
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

      <section className="px-6 md:px-24 py-12 md:py-16 border-t border-paper/10">
        <RevealText className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-paper">精选影评预览</h2>
            <p className="font-mono text-xs tracking-[0.3em] text-paper/40 uppercase mt-2">FEATURED REVIEWS</p>
          </div>
          <MagneticButton href="/xiaoxiaodewo/archive">[ 全部 →]</MagneticButton>
        </RevealText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewArticles.map((art, i) => (
            <Link key={art.id} href={`/xiaoxiaodewo/archive/${art.id}`} className="block h-full cursor-none">
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

      <section className="px-6 md:px-24 py-16 md:py-20 border-t border-paper/10">
        <RevealText className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6 text-paper">苔花如米小，也学牡丹开</h2>
          <p className="text-base md:text-lg text-paper/60 font-light mb-8 leading-relaxed">
            看完电影，听听这些在无声世界或不便身体中同样奋力生长的&ldquo;小小的我&rdquo;们，<br />通过他们的笔触，感受那份破土而出的生命力量。
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href="/xiaoxiaodewo/archive">[ 进入影评库 →]</MagneticButton>
            <MagneticButton href="/xiaoxiaodewo">[ 优秀影评 ]</MagneticButton>
          </div>
        </RevealText>
      </section>
    </main>
  );
}
