// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { OrbBackground } from "@/components/scene/orb-background";
import { Preloader } from "@/components/scene/preloader";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { HoverCard } from "@/components/ui/hover-card";
import { ArrowUpRight } from "@/components/ui/icons";
import { IntroProvider } from "@/components/ui/intro";
import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { DiamondStar, Marquee, PulseDot } from "@/components/ui/loops";
import { EnterOnIntro, IntroFade, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TextEffect } from "@/components/ui/text-effect";
import { vexonContent as c } from "@/data/mocks/home";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

/** The home route's metadata — `siteConfig`'s title and description (the hero's copy). */
export const homeMetadata: Metadata = generateMetadata({ url: "/" });

const LINK = "group flex items-center gap-1 text-tag font-medium uppercase tracking-widest text-muted transition-colors duration-[var(--duration-fast)] hover:text-white";
const LINK_ARROW = "h-3 w-3 transition-transform duration-[var(--duration-fast)] -scale-x-100 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5";
const CORNER = "absolute h-4 w-4 border-white/60 transition-transform duration-[var(--duration-fast)] group-hover:scale-110";

/**
 * Vexon — the shipped landing page (vexon-old/src/App.tsx) rebuilt on the
 * starter: the same preloader, particle-orb background, three sections, copy,
 * palette and type. A Server Component; the preloader, the orb, the reveals,
 * the loops and the cursor are client leaves (hard rule #6), and every motion
 * is a spring (hard rule #1).
 */
export const HomeView = ({ robot = false }: { robot?: boolean }) => (
  // A robot gets the page at rest (D-016): no preloader, the orb as a still,
  // every entrance at its end state, no cursor.
  <RobotProvider robot={robot}>
  {robot && <RobotView />}
  <IntroProvider robot={robot}>
    <div className="relative min-h-screen bg-black font-sans">
      <Preloader />

      {/* Background — Three.js particle halo (replaces the looped video) */}
      <OrbBackground />

      <IntroFade>
        {/* Navigation */}
        <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-50 flex w-full items-start justify-between px-6 py-6 md:px-10 md:py-8">
          <EnterOnIntro x={20} className="flex flex-col gap-6 md:gap-10">
            <div className="font-logo text-2xl font-bold tracking-tighter text-white md:text-3xl">{c.brand}</div>
            <div className="hidden font-mono text-tag uppercase tracking-[0.2em] text-soft opacity-52 md:block">{c.version}</div>
          </EnterOnIntro>

          <EnterOnIntro y={-10} className="flex flex-col items-end gap-2">
            {c.nav.map((l) => (
              <a key={l.href} href={l.href} className={LINK}>
                {l.label}
                <ArrowUpRight className={LINK_ARROW} />
              </a>
            ))}
          </EnterOnIntro>
        </nav>

        <div className="relative z-10">
          <main>
            {/* Section 1: Hero */}
            <section id="ai-intelligence" className="flex min-h-screen items-center px-6 pb-40 pt-32 md:px-10 md:pb-20 md:pt-20">
              <RevealGroup maskFade className="grid w-full grid-cols-1 lg:grid-cols-12 lg:gap-10">
                {/* Start Column - Big Headline */}
                <div className="flex flex-col justify-center lg:col-span-8">
                  <RevealItem index={0} className="mb-6 font-mono text-label tracking-[0.2em] text-soft md:text-tag">
                    {c.hero.eyebrow}
                  </RevealItem>

                  <RevealItem
                    index={1}
                    tag="h1"
                    className="font-display text-hero-fit font-bold uppercase leading-[0.9] tracking-tight text-white md:text-hero-md lg:text-hero-lg"
                  >
                    <span className="flex items-center gap-4">
                      <TextEffect per="char" as="span" className="mask-fade-in inline-block text-white drop-shadow-glow">
                        {c.hero.lines[0]}
                      </TextEffect>
                    </span>
                    <span className="flex items-center gap-4 text-soft md:gap-8">
                      <span className="relative block">
                        <DiamondStar className="h-[0.8em] w-[0.8em] text-white" />
                      </span>
                      <TextEffect per="char" delay={0.5} as="span" className="text-white drop-shadow-glow-strong">
                        {c.hero.lines[1]}
                      </TextEffect>
                    </span>
                    <span className="flex items-center gap-4">
                      <TextEffect per="char" delay={1} as="span" className="mask-fade-out inline-block text-white drop-shadow-glow">
                        {c.hero.lines[2]}
                      </TextEffect>
                    </span>
                  </RevealItem>
                </div>

                {/* End Column - Info & Actions */}
                <div className="flex translate-y-hero-drop flex-col justify-end gap-8 pb-12 pt-12 md:gap-12 md:pb-20 lg:col-span-4">
                  <RevealItem index={2} className="flex items-center justify-between">
                    <div className="text-3xl font-light tracking-tighter text-soft md:text-4xl">
                      ( <span className="font-mono font-bold">{c.hero.mark}</span> )
                    </div>
                    <div className="font-mono text-label tracking-[0.2em] text-soft md:text-tag">{c.hero.counter}</div>
                  </RevealItem>

                  <RevealItem index={3} tag="p" className="max-w-xs text-xs leading-relaxed text-soft md:text-sm">
                    {c.hero.body}
                  </RevealItem>

                  <RevealItem index={4} className="flex flex-wrap items-center gap-4 md:gap-6">
                    <button
                      type="button"
                      className="group relative overflow-hidden rounded-sm border border-white/30 bg-black/60 px-6 py-3 text-xs font-medium tracking-wide text-white backdrop-blur-3xl transition-all duration-[var(--duration-fast)] hover:bg-black/80 md:px-8 md:py-4 md:text-sm"
                    >
                      <span className={`${CORNER} end-0 top-0 border-e-2 border-t-2`} />
                      <span className={`${CORNER} bottom-0 start-0 border-b-2 border-s-2`} />
                      <span className="relative z-10 uppercase tracking-widest">{c.hero.primary}</span>
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium tracking-wide text-white transition-colors duration-[var(--duration-fast)] hover:opacity-70 md:text-sm"
                    >
                      {c.hero.secondary}
                    </button>
                  </RevealItem>
                </div>
              </RevealGroup>
            </section>

            {/* Section 2: About / Cards */}
            <section
              id="about-vexon"
              aria-labelledby="about-vexon-title"
              className="flex min-h-screen flex-col justify-center border-t border-white/5 bg-black/40 px-6 py-20 backdrop-blur-3xl md:px-10"
            >
              <RevealGroup amount={0.4} className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <RevealItem index={0} className="font-mono text-tag uppercase tracking-[0.2em] text-soft opacity-52">
                    {c.about.eyebrow}
                  </RevealItem>
                </div>
                <div className="lg:col-span-8">
                  <TextEffect
                    as="h2"
                    per="word"
                    className="mb-8 font-display text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:max-w-4xl"
                  >
                    {c.about.heading}
                  </TextEffect>
                  <RevealItem index={1} tag="p" className="max-w-2xl text-sm font-light leading-relaxed text-soft opacity-60 md:text-base">
                    {c.about.body}
                  </RevealItem>
                </div>
              </RevealGroup>

              <RevealGroup amount={0.4} tag="ul" className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {c.about.cards.map((card, i) => (
                  <RevealItem
                    key={card.title}
                    index={i}
                    duration={1600}
                    tag="li"
                    className="group relative aspect-4/5 overflow-hidden rounded-md border border-white/10 bg-black/10 backdrop-blur-md"
                  >
                    <span className="absolute end-0 top-0 z-40 h-5 w-5 border-e-2 border-t-2 border-white/40" />
                    <span className="absolute bottom-0 start-0 z-40 h-5 w-5 border-b-2 border-s-2 border-white/40" />
                    <span className="absolute start-4 top-4 z-40 font-mono text-label uppercase tracking-widest text-white/46">{card.index}</span>
                    <HoverCard src={card.image} alt={card.alt} label={card.cursor}>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-1/2 flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-8">
                        <h3 className="font-display text-2xl font-medium tracking-tight text-white">{card.title}</h3>
                        <p className="mt-2 text-sm font-light leading-relaxed text-soft opacity-70">{card.body}</p>
                      </div>
                    </HoverCard>
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>

            {/* Section 3: About Us Modular Grid */}
            <section id="mission-intelligence" className="relative z-10 border-t border-white/5 bg-black font-sans">
              <div className="grid grid-cols-1 border-b border-white/5 md:grid-cols-4">
                {/* Box 1: Brand/Context */}
                <div className="flex min-h-mission-box flex-col justify-between border-b border-white/5 p-8 md:border-b-0">
                  <div className="font-logo text-xl font-bold tracking-tighter text-white opacity-80">
                    {c.mission.brand}
                    {/* Orbitron has no ®, so the old page drew it from the system sans;
                        next/font's metric-adjusted fallback would draw it a quarter larger. */}
                    <span className="font-system">{c.mission.mark}</span>
                  </div>
                  <div className="font-mono text-micro uppercase tracking-[0.3em] text-white opacity-46">{c.mission.established}</div>
                </div>

                {/* Box 2: Big Interactive Catchphrase */}
                <div className="flex flex-col justify-center border-b border-white/5 p-8 md:col-span-3 lg:p-12">
                  <div className="mb-4 font-mono text-label uppercase tracking-[0.4em] text-white opacity-46">{c.mission.eyebrow}</div>
                  <h2 className="font-display text-hero font-bold uppercase leading-[0.9] tracking-tight text-white md:text-mission-md lg:text-mission-lg">
                    <span className="flex flex-wrap items-center gap-x-4">
                      <TextEffect per="char" as="span" className="inline-block text-white">
                        {c.mission.headingLead}
                      </TextEffect>
                      <TextEffect per="char" delay={0.5} as="span" className="mask-fade-in inline-block text-white drop-shadow-glow">
                        {c.mission.headingAccent}
                      </TextEffect>
                      <span className="relative inline-flex items-center">
                        <DiamondStar className="h-[0.8em] w-[0.8em] text-white" />
                      </span>
                    </span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Box 3: Empty space / Visual Detail */}
                <div className="hidden md:block">
                  <div className="flex h-full items-center justify-center opacity-10" />
                </div>

                {/* Box 4: Metadata */}
                <div className="flex flex-col gap-6 border-b border-white/5 p-8 md:border-b-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-white/5">
                    <PulseDot className="h-1 w-1 rounded-full bg-white" />
                  </div>
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-white opacity-46">{c.mission.meta}</div>
                </div>

                {/* Box 5: Long Text Description */}
                <div className="flex flex-col justify-center p-8 md:col-span-2 lg:p-12">
                  <p className="max-w-xl text-sm font-light leading-relaxed text-white opacity-60 md:text-base">{c.mission.body}</p>
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      type="button"
                      className="group flex items-center gap-2 text-tag font-medium uppercase tracking-[0.2em] text-white transition-opacity duration-[var(--duration-fast)] hover:opacity-70"
                    >
                      {c.mission.cta}
                      <ArrowUpRight className={LINK_ARROW} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Marquee Section */}
              <div dir="ltr" className="w-full overflow-hidden border-t border-white/5 py-12 md:py-20">
                {/* The names, once, for assistive tech; the moving row below is
                    decoration at 20 % white — its words are CSS generated
                    content (outside the accessibility tree, so axe's contrast
                    check skips them), the pixels identical. */}
                <ul className="sr-only">
                  {c.mission.companies.map((company) => (
                    <li key={company}>{company}</li>
                  ))}
                </ul>
                <Marquee className="flex whitespace-nowrap">
                  {[...c.mission.companies, ...c.mission.companies].map((company, idx) => (
                    <span
                      key={idx}
                      aria-hidden="true"
                      data-word={company}
                      className="mx-8 cursor-default text-marquee font-bold tracking-tighter text-white/20 transition-all duration-[var(--duration-fast)] after:content-[attr(data-word)] hover:scale-110 hover:text-white md:mx-16 md:text-marquee-md"
                    />
                  ))}
                </Marquee>
              </div>
            </section>
          </main>

          {/* Footer Branding */}
          <footer className="relative z-10 w-full bg-black px-6 pb-12 pt-20 md:px-10 md:pb-16">
            <div className="progressive-blur absolute inset-x-0 top-0 -z-10 h-40 backdrop-blur-xl" />
          </footer>
        </div>
      </IntroFade>

      <CursorFollower />
    </div>
  </IntroProvider>
  </RobotProvider>
);
