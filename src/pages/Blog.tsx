import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/problem", label: "The problem" },
  { href: "/why-big", label: "Why big" },
  { href: "/why-now", label: "Why now" },
  { href: "/why-us", label: "Why us" },
  { href: "/how", label: "How" },
  { href: "/team", label: "Team" },
  { href: "/ask", label: "The Ask" },
  { href: "/blog", label: "Blog" },
];

const GROUPS: Array<{
  title: string;
  items: Array<{ title: string; href: string }>;
}> = [
  {
    title: "玄心",
    items: [
      {
        title: "上周AI要闻：OpenClaw 生态爆发，Agentic时代 5 个信号",
        href: "https://mp.weixin.qq.com/s/ci1PFlHYwd5RQPEO9xI3ug",
      },
      {
        title: "上周AI要闻：邪修1min体验上OpenClaw、养虾“代谢”省token大法",
        href: "https://mp.weixin.qq.com/s/uFeQtC7F92grebniwC5m6Q",
      },
    ],
  },
  {
    title: "洞见",
    items: [
      {
        title: "为什么 Anthropic 能做出大厂做不出来的模型和 Agent？",
        href: "https://mp.weixin.qq.com/s/Ks7fMKrcgfhlmYF66eZ2eA",
      },
      {
        title: "OpenClaw 与 AI Agent 时代：当 How 被自动化，人还剩下什么？",
        href: "https://mp.weixin.qq.com/s/9WhsMgovhpK7rGp0DjV61g",
      },
      {
        title: "Web 4.0：当 AI 不再需要人类“批准”时，会发生什么？软件的用户不再是人类，AI直接帮你赚钱",
        href: "https://mp.weixin.qq.com/s/6Mj2h_Am4GrdwM1r_7AkLw",
      },
    ],
  },
  {
    title: "妙赏",
    items: [
      {
        title: "一手测评AnyGen：字节版NoteBookLM + Manus，幻觉少、不废话！把“麦肯锡能力”开放给每个人，还能做漫画和3D粒子魔法特效",
        href: "https://mp.weixin.qq.com/s/zzxIhaRrT-QHAWpyAcS-RQ",
      },
      {
        title: "ELYS 深度测评：当社交圈里住进了硅基生命，价值其实不在社交本身（含50个独家邀请码）",
        href: "https://mp.weixin.qq.com/s/nhNDiS3Twc5qXtoRQ_hsRw",
      },
    ],
  },
  {
    title: "深情",
    items: [
      {
        title: "虚构文学：AI圈浮世绘，每个人都在自己的叙事里胜利",
        href: "https://mp.weixin.qq.com/s/UAZ6ssAwMU_gfi6QoMFsmg",
      },
    ],
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/55 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-[148px]">
            <div className="font-display text-[18px] leading-none tracking-[-0.02em]">MaLou</div>
            <div className="mt-1 text-kicker text-muted-foreground">Investor pitch</div>
          </div>

          <nav className="-mx-2 flex flex-1 items-center overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1">
              {NAV.map((s) => {
                const isActive = s.href === "/blog";
                return (
                  <Link key={s.href} href={s.href}>
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

          <a
            href="#list"
            className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[12px] tracking-[0.14em] uppercase font-mono text-foreground/90 backdrop-blur transition hover:bg-card/55/55 sm:flex"
          >
            Jump to list <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="scroll-mt-28">
          <div className="mx-auto relative max-w-[1120px] px-5 pt-20 pb-10 sm:px-8 sm:pt-28 sm:pb-14">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-2 text-[12px] text-muted-foreground backdrop-blur">
                  <span className="text-foreground/80">🧾</span>
                  <span className="font-mono tracking-[0.18em] uppercase">Blog</span>
                  <span className="text-muted-foreground/70">— curated reads</span>
                </div>

                <h1 className="mt-6 font-display text-[44px] leading-[0.98] tracking-[-0.04em] sm:text-[66px]">
                  读。
                  <br />
                  想。
                  做。
                </h1>

                <p className="mt-6 max-w-[46rem] text-[16px] leading-8 text-foreground/85 sm:text-[18px]">
                  玄心｜洞见｜妙赏｜深情
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#list"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:bg-primary/90"
                  >
                    进入目录 <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link href="/home">
                    <span className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm text-foreground/90 backdrop-blur transition hover:bg-card/55">
                      回到 Pitch <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:pt-2">
                <Card className="panel glow overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur">
                  <div className="border-b border-border/70 p-4">
                    <div className="text-kicker text-muted-foreground">Notes</div>
                    <div className="mt-2 font-display text-[22px] leading-[1.1]">
                      来自我们持续的思考，欢迎关注“探微观智”
                    </div>
                  </div>
                  <div className="space-y-3 p-4 text-sm leading-7 text-muted-foreground">
                    <p>
                      探微观智（公众号）聚焦AI产品和创作，思考下一代AI原生产品和交互灵感。从产品创新，到模型、平台、生态、资本、观点报告等上下游迭代趋势，以实战视角切入，每日更新。
                    </p>
                    <p>你可以把它当作“投资人附录”。</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-14 max-w-[1120px] px-5 sm:px-8">
          <div className="divider-dashed" />
        </div>

        <section id="list" className="scroll-mt-28">
          <div className="mx-auto w-full max-w-[980px] px-5 py-16 sm:px-8 sm:py-20">
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 text-kicker text-muted-foreground">目录</div>
              <h2 className="font-display text-[28px] leading-[1.08] tracking-[-0.02em] sm:text-[42px]">
                Blog
              </h2>
            </div>

            <div className="grid gap-4">
              {GROUPS.map((g) => (
                <Card
                  key={g.title}
                  className="panel glow lift rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur"
                >
                  <div className="text-kicker text-muted-foreground">{g.title}</div>
                  <div className="mt-4 space-y-3">
                    {g.items.map((it) => (
                      <a
                        key={it.href}
                        href={it.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block rounded-2xl border border-border/60 bg-background/20 px-4 py-3 transition hover:bg-background/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="text-[15px] leading-7 text-foreground/90 group-hover:text-foreground">
                            {it.title}
                          </div>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-primary opacity-70 transition group-hover:opacity-100" />
                        </div>
                        <div className="mt-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
                          mp.weixin.qq.com
                        </div>
                      </a>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-sm text-muted-foreground">
              提示：微信文章可能需要在浏览器里登录/打开。
            </div>
          </div>
        </section>

        <footer className="border-t border-border/70 py-10">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} MaLou — Blog</div>
            <a href="#home" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              回到顶部 <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
