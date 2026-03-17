import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowUpRight, MoveUpRight, Minus, Plus, RotateCcw } from "lucide-react";

import flywheelV2Png from "@/assets/flywheel-v2.png";
import openclawHiresJpg from "@/assets/openclaw-hires.jpg";

import malouHeadHeroPng from "@/assets/malou-head-hero.png";
import malouWhyUsPng from "@/assets/malou-rocket.png";
import malouAskPng from "@/assets/malou-ask.png";

interface HomeProps {
  targetSection?: string;
}

type SectionId =
  | "home"
  | "problem"
  | "why-big"
  | "why-now"
  | "why-us"
  | "how"
  | "team"
  | "ask";

const SECTIONS: Array<{ id: SectionId; label: string; kicker?: string }> = [
  { id: "home", label: "Home", kicker: "一句话概括" },
  { id: "problem", label: "The problem", kicker: "问题" },
  { id: "why-big", label: "Why big", kicker: "市场有多大" },
  { id: "why-now", label: "Why now", kicker: "为什么是现在" },
  { id: "why-us", label: "Why us", kicker: "我们为什么能成" },
  { id: "how", label: "How", kicker: "怎么做到" },
  { id: "team", label: "Team", kicker: "团队" },
  { id: "ask", label: "The Ask", kicker: "融资" },
];

function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "home");
  const last = useRef(activeId);

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        const next = visible[0]?.target?.id;
        if (!next) return;
        if (next === last.current) return;
        last.current = next;
        setActiveId(next);
      },
      {
        root: null,
        // bias towards “currently reading” rather than “just entered”
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0.02, 0.08, 0.2],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds]);

  return activeId;
}

function SectionShell({
  id,
  title,
  kicker,
  ornament,
  children,
}: {
  id: SectionId;
  title: string;
  kicker?: string;
  ornament?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mx-auto w-full max-w-[980px] px-5 sm:px-8">
        <div className="mb-6 sm:mb-8 relative z-20 pr-16 sm:pr-24">
          {kicker ? (
            <div className="mb-3 text-kicker text-muted-foreground">
              {kicker}
            </div>
          ) : null}
          <h2 className="font-display text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[42px]">
            {title}
          </h2>
          {ornament ? ornament : null}
        </div>

        <div className="text-[15px] leading-7 text-foreground/90 sm:text-[16px] sm:leading-8">
          {children}
        </div>
      </div>
    </section>
  );
}

function InlineList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-[0.62rem] h-[5px] w-[5px] shrink-0 rounded-full bg-primary" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function HoverBulletList({
  items,
}: {
  items: Array<{ key: string; short: string; detail: string }>;
}) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((it) => (
        <li key={it.key} className="flex gap-3">
          <span className="mt-[0.62rem] h-[5px] w-[5px] shrink-0 rounded-full bg-primary" />
          <HoverCard openDelay={120} closeDelay={80}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="text-left text-foreground/90 underline decoration-border/70 underline-offset-4 transition hover:text-foreground hover:decoration-primary/60"
              >
                {it.short}
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              side="top"
              className="panel glow w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-border/70 bg-card/40 p-4 text-sm leading-7 text-muted-foreground backdrop-blur"
            >
              {it.detail}
            </HoverCardContent>
          </HoverCard>
        </li>
      ))}
    </ul>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card className="panel glow lift rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur">
      <div className="text-kicker text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-[26px] leading-none tracking-[-0.02em]">{value}</div>
      {note ? <div className="mt-2 text-sm text-muted-foreground">{note}</div> : null}
    </Card>
  );
}

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const clamp = (v: number) => Math.max(1, Math.min(5, v));

  return (
    <div className="relative">
      <div className="panel glow overflow-auto rounded-2xl border border-border/70 bg-card/40 p-2 backdrop-blur">
        <div className="flex max-h-[72vh] min-h-[240px] items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-h-[72vh] w-auto max-w-full select-none object-contain"
            style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
            draggable={false}
          />
        </div>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/50 text-foreground/90 backdrop-blur transition hover:bg-background/70"
          onClick={() => setScale((s) => clamp(s - 0.25))}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/50 text-foreground/90 backdrop-blur transition hover:bg-background/70"
          onClick={() => setScale((s) => clamp(s + 0.25))}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/50 text-foreground/90 backdrop-blur transition hover:bg-background/70"
          onClick={() => setScale(1)}
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
        提示：滚动查看全图；右上角可继续放大（最高 5x）。
      </div>
    </div>
  );
}

export default function Home({ targetSection }: HomeProps) {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useScrollSpy(ids);
  const prefersReducedMotion = useReducedMotion();

  // Scroll to target section when route changes (e.g., /#/why-us → scroll to #why-us)
  useEffect(() => {
    if (!targetSection) return;
    const safe = ids.includes(targetSection as SectionId) ? targetSection : null;
    if (!safe) return;
    document.getElementById(safe)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ids, targetSection]);

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      {/* Top rail */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/55 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-[148px]">
            <div className="relative">
                <div className="font-display text-[18px] leading-none tracking-[-0.02em]">MaLou</div>
            </div>
            <div className="mt-1 text-kicker text-muted-foreground">
              Investor pitch
            </div>
          </div>

          <nav className="-mx-2 flex flex-1 items-center overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1">
              {SECTIONS.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <Link key={s.id} href={`/${s.id}`}>
                    <span
                      className={cn(
                        "cursor-pointer select-none rounded-full px-3 py-2 text-[12px] tracking-[0.14em] uppercase font-mono transition",
                        "hover:bg-accent",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_38%,transparent),0_12px_40px_-18px_color-mix(in_oklab,var(--primary)_35%,transparent)] hover:bg-primary/92"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {s.label}
                    </span>
                  </Link>
                );
              })}


            </div>
          </nav>

          <Link href="/blog">
            <span
              className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[12px] tracking-[0.14em] uppercase font-mono text-foreground/90 backdrop-blur transition hover:bg-card/55/55 sm:flex cursor-pointer"
            >
              Blog <MoveUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section id="home" className="scroll-mt-28">
          <div className="mx-auto relative max-w-[1120px] px-5 pt-20 pb-10 sm:px-8 sm:pt-28 sm:pb-14">
            {/* Hero mascot (big head) */}
            <motion.div
              className="pointer-events-none absolute right-0 top-2 z-0 block translate-x-[22%] sm:translate-x-[16%]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <motion.img
                src={malouHeadHeroPng}
                alt="MaLou 大脑袋"
                className="h-[220px] w-[220px] select-none sm:h-[360px] sm:w-[360px] lg:h-[460px] lg:w-[460px]"
                style={{
                  filter:
                    "drop-shadow(0 28px 70px rgba(0,0,0,.55)) drop-shadow(0 0 48px color-mix(in oklab, var(--primary) 22%, transparent))",
                  willChange: "transform",
                }}

                initial={{ rotate: -4, y: 6 }}
                animate={
                  prefersReducedMotion
                    ? { rotate: -4, y: 0 }
                    : { rotate: [-4, 2, -4], y: [6, -10, 6] }
                }
                transition={{ duration: 5.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                loading="lazy"
                draggable={false}
              />
            </motion.div>

            <div className="relative z-10 grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[12px] text-muted-foreground backdrop-blur">
                  <span className="text-foreground/80">🐒</span>
                  <span className="font-mono tracking-[0.18em] uppercase">马喽 (MaLou)</span>
                  <span className="text-muted-foreground/70">— Investor Pitch</span>
                </div>

                <h1 className="mt-6 font-display text-[44px] leading-[0.98] tracking-[-0.04em] sm:text-[66px]">
                  马喽 (Malou)
                </h1>

                <p className="mt-6 max-w-[46rem] text-[16px] leading-8 text-foreground/85 sm:text-[18px]">
                  国内首个安全自主可控的消费级 Agent 生态平台，让每个中小经营者都能拥有能帮自己干活、能帮自己赚钱的 AI“马喽”。
                </p>

                <p className="mt-4 max-w-[46rem] text-[15px] leading-8 text-muted-foreground">
                  → 底层采用清华实验室联合研发的安全自主 Agent 框架，上层做技能交易市场 + 虚拟 IP 养成，让普通用户不用懂技术也能部署 + 售卖属于自己的执行体 AI。
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#problem"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:bg-primary/90"
                  >
                    开始阅读 <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#ask"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm text-foreground/90 backdrop-blur transition hover:bg-card/55"
                  >
                    直接看融资 <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right rail: reserved whitespace for mascot on wide screens */}
              <div className="hidden lg:block" aria-hidden="true" />

              {/* Vision card spans wider on large screens */}
              <div className="mt-10 lg:col-span-2">
                <Card className="panel glow overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
                  <div className="border-b border-border/70 p-4">
                    <div className="text-kicker text-muted-foreground">终局愿景</div>
                    <div className="mt-2 font-display text-[22px] leading-[1.1]">
                      成为 Agent 时代的“安全认证 + 应用商店”双基础设施
                    </div>
                  </div>
                  <div className="space-y-4 p-4 text-sm leading-7 text-foreground/85">
                    <p>不管哪款 Agent 产品最终胜出，都需要我们的安全底座能力和可信 Skill 分发渠道。</p>
                    <div className="rounded-2xl bg-background/35 p-4 text-muted-foreground">
                      <div className="text-[11px] tracking-[0.22em] uppercase">一句话结尾</div>
                      <div className="mt-2 text-[15px] leading-7 text-foreground/90">
                        Agent 时代已经到来，但“信任”还没有。我们构建信任。
                      </div>
                      <div className="mt-2 text-[13px] leading-6">The Agent era is here, but trust isn't. We build trust.</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-14 max-w-[1120px] px-5 sm:px-8"><div className="divider-dashed" /></div>

        <div className="space-y-20 py-16 sm:space-y-24 sm:py-20">
          <SectionShell id="problem" title="The Problem" kicker="The Problem">
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <Metric label="全球部署" value="284万" note="OpenClaw上线3个月" />
              <Metric label="GitHub Star" value="26万+" note="现象级热潮" />
              <Metric label="窗口期" value="12–18个月" note="先卡位者赢" />
            </div>

            <p>
              AI 已经从“对话交互”时代进入“自主执行”时代，但执行层的安全危机是全行业尚未解决的根问题。
            </p>
            <p className="mt-5">
              现象级开源 Agent 产品 OpenClaw 上线 3 个月便实现：全球 284 万部署、26 万+ Star 登顶 Github，国内掀起“全民养虾”热潮，从两会现场到腾讯大厦用户排队安装，20+ 头部厂商（百度红手指、腾讯 WorkBuddy / QClaw、阿里 CoPaw、字节飞书妙搭 / Coze / 火山等）集体入局抢滩。
            </p>
            <p className="mt-5">
              但所有玩家都聚焦产品层竞争：更好的 UI、更多的 Skill、更低的部署成本。
            </p>

            <div className="mt-8 rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
              <div className="text-kicker text-muted-foreground">
                没有玩家解决的本质问题：底层安全
              </div>
              <InlineList
                items={[
                  "工信部、国家互联网应急中心已明确警示风险：权限失控、数据泄露、恶意 Skill 包、操作不可审计、责任无法追溯。",
                  "大厂所谓的“安全可用”仅停留在提示词注入防护层面，只能解决表层内容安全（Safety），无法解决深层系统安全（Security），难以防止黑客恶意攻击盗取金钱和数字资产，更无法满足生产级落地的合规要求。",
                ]}
              />
            </div>

            <div className="mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="group flex w-full items-start gap-4 rounded-3xl border border-border/70 bg-card/40 p-4 text-left backdrop-blur transition hover:bg-card/55">
                    <img
                      src={openclawHiresJpg}
                      alt="OpenClaw 头部厂商对比图"
                      className="h-[140px] w-[110px] shrink-0 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="text-kicker text-muted-foreground">
                        图：头部厂商 OpenClaw 斗法图
                      </div>
                      <div className="mt-2 font-display text-[18px] leading-[1.1]">
                        市场很热，但底层安全没人碰
                      </div>
                      <div className="mt-2 text-sm leading-7 text-muted-foreground">
                        点击放大查看。原图分辨率有限，但足够传达“卷产品、缺底座”的现状。
                      </div>
                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-primary">
                        放大查看 <MoveUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[1100px]">
                  <DialogHeader>
                    <DialogTitle>OpenClaw 头部厂商对比图</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-auto">
                    <ZoomableImage src={openclawHiresJpg} alt="OpenClaw 头部厂商对比图" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </SectionShell>

          <SectionShell id="why-big" title="Why Big — 市场有多大" kicker="Why Big">
            <p>
              我们卡位 Agent 时代最核心的刚需赛道，享受三层叠加的万亿市场红利：
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">1. 基础盘</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">Agent 执行体本身是万亿级新赛道</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  OpenClaw 的爆发只是开始，工信部已将智能体列为 AI 产业重点发展方向，中国市场增速达 180%/季度，2030 年全球生产级 Agent 落地市场规模将突破 12 万亿人民币。
                </p>
              </Card>

              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">2. 增量盘</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">8000万 Prosumer 的供给空白</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  中国有 8000 万+ 个体工商户、5000 万+ 内容创作者，Agent 生态也将赋能更多“一人公司”涌现；他们对“能用、好用、敢用”的 AI 生产工具需求极强。但现阶段 Agent 定制化门槛高、效果不稳定、支付环节难以信任绑定，留下了供给空白。
                </p>
              </Card>

              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">3. 生态盘</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">标准层长期价值是单点工具的 100 倍</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Agent 从“玩具”走向“生产可用”，需要三个核心基建完善：
                </p>
                <HoverBulletList
                  items={[
                    {
                      key: "memory",
                      short: "🧠 记忆层：跨生态、跨设备的记忆安全迁移与权限管控；仅这一细分赛道年规模超 1000 亿。",
                      detail:
                        "🧠 记忆层：Google、字节等大厂均自研记忆体系，但跨生态、跨设备的记忆安全迁移、权限管控是大厂不愿也不能解决的问题，仅这一细分赛道年市场规模就超过1000亿。",
                    },
                    {
                      key: "security",
                      short: "🛡️ 安全层：安全是生产级落地前置条件；国内 AI 安全合规市场年增速超 60%。",
                      detail:
                        "🛡️ 安全层：安全是Agent生产级落地的前置条件，行业已用真金白银验证需求。2026年3月OpenAI收购Promptfoo、Google以230亿美元史上最大规模收购安全公司Wiz。大厂普遍选择并购而非自研安全能力，因安全技术研发周期长、投入产出比低，直接收购成熟团队是最优解。安全赛道天然具备高价值退出路径，黑客攻击方式也随着安全系统“道高一尺魔高一丈”，国内AI安全合规市场年增速超60%。",
                    },
                    {
                      key: "ecosystem",
                      short: "🤝 生态层：生态越分散，对统一安全标准与认证基础设施需求越强；我们联合清华实验室主导行业标准制定。",
                      detail:
                        "🤝 生态层：当前A2A技能交换、多Agent协作等开源项目密集涌现，智能硬件、具身机器人也需要OS级Agent生态协作，生态越分散，对统一安全标准、安全认证基础设施的需求越强，我们联合清华实验室主导行业标准制定，相当于掌握了生态的“门票分发权”，生态越繁荣，我们的价值越大。",
                    },
                  ]}
                />
              </Card>
            </div>

            <div className="mt-10 rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
              <div className="text-kicker text-muted-foreground">收入如何产生？三层市场机会</div>
              <InlineList
                items={[
                  "安全 Agent 框架（底座）→ Token 调度差价；向大厂输出 SDK / API 授权、企业版框架授权。",
                  "可信 Skill 图谱市场（平台）→ 对每笔 Skill 交易收取“安全认证 + 分发”服务费抽佣。",
                  "马喽经济（生态）→ 虚拟 IP 皮肤 / 配件收入、Prosumer 经验变现分成。",
                ]}
              />
            </div>
          </SectionShell>

          <SectionShell id="why-now" title="Why Now — 为什么是现在" kicker="Why Now">
            <p>四个不可逆的结构性变化同时发生：</p>
            <InlineList
              items={[
                "技术拐点已至、用户教育已经完成。OpenClaw 证明 AI 执行体不是概念——284 万部署、全民养虾，让“AI 帮你干活”的认知从开发者圈层渗透到大众市场；用户付费意愿已被验证（线下代装 OpenClaw 服务售价 500 元/次仍供不应求）。",
                "安全危机迫在眉睫。工信部已发风险提示。第一次重大安全事故只是时间问题——恶意 Skill 删除文件、Agent 泄露企业数据、自动化违规交易。事故发生后，安全底座从“nice to have”瞬间变成“must have”。",
                "大厂留出了安全空白。20+ 厂商都在卷产品层（部署、Skill、体验），没有一家把安全可控作为核心。大厂基因是做产品和流量，不是做密码学和可信计算。这个空白窗口期预计 12–18 个月。",
                "政策东风已起。国产自主可控是政策方向。深圳龙岗、无锡、常熟、合肥等多地已出台 Agent 产业支持政策。安全合规是政府采购的硬门槛。",
              ]}
            />

            <div className="mt-8 rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
              <div className="font-display text-[18px] leading-[1.1]">窗口期只有 12–18 个月。先卡位者赢。</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                安全是我们做生态的必要条件——别人不敢放开做的生态，我们能做；别人接不了的监管要求，我们能接。
              </p>
            </div>
          </SectionShell>

          <SectionShell
            id="why-us"
            title="Why Us — 我们为什么能成？"
            kicker="Why Us"
            ornament={
              <motion.div
                className={cn(
                  "pointer-events-none absolute z-50",
                  // 更自由地悬浮在右侧留白：不同屏幕给不同的偏移
                  "right-[-18px] top-[-26px]",
                  "sm:right-[-46px] sm:top-[-54px]",
                  "lg:right-[-110px] lg:top-[-88px]"
                )}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <motion.img
                  src={malouWhyUsPng}
                  alt="Why Us 小猴"
                  className="h-[220px] w-auto select-none sm:h-[280px] lg:h-[340px]"
                  style={{
                    filter:
                      "drop-shadow(0 26px 68px rgba(0,0,0,.58)) drop-shadow(0 0 46px color-mix(in oklab, var(--primary) 22%, transparent))",
                    willChange: "transform",
                  }}
                  initial={{ rotate: -6, y: 10 }}
                  animate={
                    prefersReducedMotion
                      ? { rotate: -6, y: 0 }
                      : { rotate: [-6, 3, -6], y: [10, -18, 10] }
                  }
                  transition={{ duration: 5.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            }
          >
            <div className="space-y-10">
              <div>
                <div className="text-kicker text-muted-foreground">1. 技术壁垒</div>
                <p className="mt-3">三层自研栈，成本与体验双重领先：</p>
                <div className="mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">技术模块</TableHead>
                        <TableHead className="w-[38%]">核心优势</TableHead>
                        <TableHead>行业壁垒</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">底层全自研 Agent 框架</TableCell>
                        <TableCell>
                          完全自主可控的安全 Agent 内核，清华密码学实验室联合研发，内置权限管控、操作审计、数据隔离三重安全机制
                        </TableCell>
                        <TableCell>国内极少团队同时具备 Agent 技术能力 + 密码学安全学术积累</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">模型调度与成本优化</TableCell>
                        <TableCell>
                          短期：多模型差价 API 渠道；长期：推理训练加速自研方案，已储备 Infra 人才（字节 Top Seed）
                        </TableCell>
                        <TableCell>成本优势可直接转化为价格竞争力</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Agent 与工具层体验优化</TableCell>
                        <TableCell>通过 Context 窗口压缩、skill效率优化、结构化工具等工程优化，为用户提供优质体验和更高的token效率</TableCell>
                        <TableCell>用户体验的代际差是留存的核心驱动力</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <div className="text-kicker text-muted-foreground">2. 生态壁垒</div>
                <p className="mt-3">供需双边网络效应，开发者与用户双向锁定：</p>

                <div className="mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[26%]">生态角色</TableHead>
                        <TableHead className="w-[44%]">我们提供的独特价值</TableHead>
                        <TableHead>锁定效应</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">供给 - 开发者</TableCell>
                        <TableCell>
                          行业首个闭源 Skill 交易市场，“可用不可见”技术使开发者无需担心代码被盗取；平台安全背书，开发者可安全售卖能力沉淀、绑定支付/收款流程
                        </TableCell>
                        <TableCell>越高质量的开发者 ⇒ 收入正反馈越多 ⇒ 继续高质量开发和留存</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">需求 - C 端 / Prosumer 用户</TableCell>
                        <TableCell>所有上架 Skill 经过全链路安全审计，100% 权限可控，拿结果的同时零安全风险</TableCell>
                        <TableCell>用户积累的记忆 / 工作流 / 技能栈迁移成本极高</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">需求 - 大厂 / 企业客户</TableCell>
                        <TableCell>联合清华实验室主导 Agent 安全行业标准制定，可输出白皮书、安全认证、定制化安全方案</TableCell>
                        <TableCell>行业定义权是最大的生态壁垒，下游客户必须遵循标准</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <div className="text-kicker text-muted-foreground">3. 商业闭环</div>
                <p className="mt-3">三层嵌套飞轮</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  核心逻辑：更多场景数据沉淀 → 马喽可交付程度++ → 开发者 & 用户规模与留存++ → 变现能力++ → 网络与生态效应++ → 继续沉淀数据，形成正循环
                </p>

                <Card className="panel glow lift mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-4 backdrop-blur">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-kicker text-muted-foreground">三层嵌套飞轮</div>
                      <div className="mt-2 font-display text-[18px] leading-[1.1]">技术 × ToC × ToB，互相喂数据</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-border/60 bg-background/20 p-3">
                    <img
                      src={flywheelV2Png}
                      alt="三层嵌套飞轮图"
                      className="h-auto w-full max-h-[560px] object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </SectionShell>

          <SectionShell id="how" title="How — 怎么做到" kicker="How">
            <p className="text-muted-foreground">大致时间线，仅供参考优先级</p>
            <InlineList
              items={[
                "🌰 MVP版本：安全版龙虾 + skill 平台 + skill 交易机制（四月底）",
                "2.0 版本：形象化 IP + 马喽交易机制",
              ]}
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">前 90 天</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">打地基</div>
                <InlineList
                  items={[
                    "自主安全 Agent 框架 MVP：可运行的框架 + 安全权限管控 + 操作审计",
                    "清华实验室启动安全底座研发：可信计算模块 + Skill 安全审核引擎",
                    "开发者社区冷启动：100+ 开发者注册，10+ 社区贡献 Skill",
                    "马喽 IP 设计完成：品牌形象 + 前端交互原型",
                  ]}
                />
              </Card>

              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">90–180 天</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">验证 PMF</div>
                <InlineList
                  items={[
                    "Skill 市场上线：100+ 可交易 Skill，首笔交易收入",
                    "大厂框架合作：至少 1 家头部厂商测试/采购安全框架",
                    "开发者社区增长：1000+ 活跃开发者",
                    "马喽养成体验上线：用户可以“养”自己的马喽 Agent",
                  ]}
                />
              </Card>

              <Card className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <div className="text-kicker text-muted-foreground">180–360 天</div>
                <div className="mt-2 font-display text-[20px] leading-[1.1]">规模化</div>
                <InlineList
                  items={[
                    "Skill 市场 GMV：月交易额达到可融 Seed 轮的数据门槛",
                    "安全认证体系：形成行业认可的 Skill 安全审核标准",
                    "用户增长：1 万+ Prosumer 用户，社区自增长飞轮启动",
                    "下一轮融资：Seed 轮 2–4 亿估值",
                  ]}
                />
              </Card>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
              <div className="border-b border-border/70 px-6 py-4">
                <div className="text-kicker text-muted-foreground">商业模式（拼多多式轻资产）</div>
              </div>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[26%]">收入线</TableHead>
                      <TableHead className="w-[44%]">模式</TableHead>
                      <TableHead>何时启动</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Skill 交易抽佣</TableCell>
                      <TableCell>每笔 Skill 买卖抽佣 15–30%</TableCell>
                      <TableCell>第 6 个月</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">框架授权</TableCell>
                      <TableCell>向大厂/企业收取安全框架授权费</TableCell>
                      <TableCell>第 9 个月</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">马喽虚拟商品</TableCell>
                      <TableCell>皮肤、配件、个性化</TableCell>
                      <TableCell>第 6 个月</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Token 回扣机制</TableCell>
                      <TableCell>平台内 API 调用的佣金</TableCell>
                      <TableCell>第 9 个月</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-6 rounded-2xl bg-background/55 p-4 text-sm leading-7 text-muted-foreground">
                  支付方案：挂载微信支付/支付宝，不自建支付系统，不碰牌照，零合规成本。
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell id="team" title="Team" kicker="Team">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[18%]">成员</TableHead>
                    <TableHead className="w-[22%]">角色</TableHead>
                    <TableHead>关键履历</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">刘导</TableCell>
                    <TableCell>首席科学家</TableCell>
                    <TableCell>
                      清华大学副教授，前 Google 美国技术负责人，获得 Google 杰出工程奖；密码学/数据安全/可信体系结构专家，多项国家级课题，带领 8 名博士生全职投入安全底座研发；曾合作豆包手机 OS 安全性研发
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">周子龙</TableCell>
                    <TableCell>CEO</TableCell>
                    <TableCell>
                      连续创业者，前百度产品经理，0-1 双边平台与商业化经验（创办知潜）；从 0-1 搭建起 200+ 公司和数十万用户的 AI 行业招聘平台；入选 2025 福布斯 u30
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">程佳路</TableCell>
                    <TableCell>COO</TableCell>
                    <TableCell>
                      字节 AI 产品战略 + 产品需求流程管理，内部“首席龙虾官”；曾在麦肯锡/早期投资/AI 分身约会 app 创业，北大 + 哥大，擅长“技术 → 交付 → 规模化”
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">张非凡</TableCell>
                    <TableCell>CTO</TableCell>
                    <TableCell>
                      两次大厂 0-1 业务体系搭建（阿里淘宝/滴滴国际化），浙大 CS，NOI 全国铜牌
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">毕宗泽</TableCell>
                    <TableCell>VP Eng / Agent 技术</TableCell>
                    <TableCell>
                      阿里淘宝 Agent 技术专家，主导 AI Agent 落地项目，NeurIPS 2024 第二作者，武大本 + 中科大硕
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hause</TableCell>
                    <TableCell>UPM / UGPM</TableCell>
                    <TableCell>
                      字节跳动/快手核心增长线产品专家，亿级用户产品全域增长体系，99 年产品 3-1
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Research Lead</TableCell>
                    <TableCell>后训练/模型能力</TableCell>
                    <TableCell>
                      正在竞业期，99 年目前职级对标字节 3-2，阿里星，前阿里 Qwen 核心研究员，论文 7000+ 引用，多篇顶会一作
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">+ 开发者社区负责人</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>字节朝夕光年，前 Unity 技术社区运营</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">+ 前端/交互负责人</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>字节朝夕光年，图形学专家，浙大 CS</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 rounded-3xl border border-border/70 bg-card/40 p-6 text-sm leading-7 text-muted-foreground backdrop-blur">
              团队总战力：9 人产品工程 + 9 人清华安全实验室 = 18 人，仅 9 人成本。<br />
              更多产品/技术成员，考虑加入中...
            </div>
          </SectionShell>

          <SectionShell
            id="ask"
            title="The Ask"
            kicker="The Ask"
            ornament={
              <motion.div
                className={cn(
                  "pointer-events-none absolute z-0",
                  // The Ask 右侧留白：放在标题右侧 padding 区，不推出视窗
                  "right-0 top-[-14px]",
                  "sm:top-[-26px]",
                  "lg:top-[-48px]"
                )}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <motion.img
                  src={malouAskPng}
                  alt="The Ask 小猴"
                  className="h-[240px] w-auto select-none sm:h-[300px] lg:h-[360px]"
                  style={{
                    filter:
                      "drop-shadow(0 28px 70px rgba(0,0,0,.55)) drop-shadow(0 0 48px color-mix(in oklab, var(--primary) 22%, transparent))",
                    willChange: "transform",
                  }}
                  initial={{ rotate: -4, y: 6 }}
                  animate={
                    prefersReducedMotion
                      ? { rotate: -4, y: 0 }
                      : { rotate: [-4, 2, -4], y: [6, -10, 6] }
                  }
                  transition={{ duration: 5.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            }
          >
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%]">项目</TableHead>
                    <TableHead>内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">轮次</TableCell>
                    <TableCell>天使轮</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">估值</TableCell>
                    <TableCell>8000 万 – 1 亿人民币</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">融资额</TableCell>
                    <TableCell>1050 – 1500 万人民币</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">出让</TableCell>
                    <TableCell>15%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">用途</TableCell>
                    <TableCell>60% 技术研发（框架 + Skill 市场）、20% 开发者社区建设、15% 运营及品牌、5% 预备金</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Runway</TableCell>
                    <TableCell>12 – 18 个月</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">下一轮目标</TableCell>
                    <TableCell>Seed 轮，12 个月内完成，目标估值 2 – 4 亿</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-10 rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur">
              <div className="text-kicker text-muted-foreground">一句话结尾</div>
              <div className="mt-3 font-display text-[22px] leading-[1.1]">
                Agent 时代已经到来，但“信任”还没有。我们构建信任。
              </div>
              <div className="mt-3 text-sm leading-7 text-muted-foreground">
                The Agent era is here, but trust isn't. We build trust.
              </div>
            </div>
          </SectionShell>
        </div>

        <footer className="border-t border-border/70 py-10">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} MaLou</div>
            <a href="#home" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              回到顶部 <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
