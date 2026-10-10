// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { ArrowLink, ButtonLink } from "@/components/site/button-link";
import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { StageList } from "@/components/site/stage-list";
import { StoryCard } from "@/components/site/story-card";
import { DiamondStar, Marquee } from "@/components/ui/loops";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TextEffect } from "@/components/ui/text-effect";
import { homeContent as c } from "@/data/home";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { faqPageSchema } from "@/utils/seo/structured-data";

/** The home route's metadata — `siteConfig`'s title and description (copy doc §14). */
export const homeMetadata: Metadata = generateMetadata({ url: "/" });

/** Stair heights, lowest (first, on the right) to highest. */
const STAIR_OFFSET = ["md:mt-48", "md:mt-36", "md:mt-24", "md:mt-12", "md:mt-0"];

/**
 * Ctrl+Shift home page, in the copy doc's section order: Hero, filter strip,
 * the problem, the equation, three steps, the Ctrl/Shift board, the base
 * before the summit, clients, blog, FAQ, closing. (The doc's team section has
 * no copy yet, and "three tracks" is marked not-to-build.) A Server
 * Component; the reveals, the text effects and the orb are client leaves.
 */
export const HomeView = ({ robot = false }: { robot?: boolean }) => (
  <SiteShell intro robot={robot}>
    {/* 1. Hero — the orb stands in for the hero photo until it exists. */}
    <section aria-labelledby="hero-title" className="relative z-10 flex min-h-svh items-center px-6 pb-40 pt-32 md:px-10 md:pb-24">
      <RevealGroup maskFade className="flex w-full max-w-7xl flex-col gap-8 md:gap-10">
        <RevealItem index={0} tag="h1" className="font-display text-h1 font-extrabold leading-display text-ink">
          <span id="hero-title" className="sr-only">
            {c.hero.title.join(" ")}
          </span>
          <span aria-hidden="true" className="flex flex-col">
            <TextEffect per="char" as="span" className="inline-block drop-shadow-glow">
              {c.hero.title[0]}
            </TextEffect>
            <span className="flex items-center gap-4 md:gap-6">
              <TextEffect per="char" delay={0.5} as="span" className="inline-block drop-shadow-glow-strong">
                {c.hero.title[1]}
              </TextEffect>
              <DiamondStar className="h-[0.6em] w-[0.6em] shrink-0 text-ink" />
            </span>
          </span>
        </RevealItem>
        <RevealItem index={1} tag="p" className="max-w-2xl text-lg leading-relaxed text-soft md:text-2xl">
          {c.hero.subtitle}
        </RevealItem>
        <RevealItem index={2} className="flex flex-wrap items-center gap-4">
          <ButtonLink item={c.hero.primary} />
          <ButtonLink item={c.hero.secondary} variant="secondary" />
        </RevealItem>
        <RevealItem index={3} tag="p" className="text-sm text-muted">
          {c.hero.note}
        </RevealItem>
      </RevealGroup>
    </section>

    {/* 2. Filter strip */}
    <section aria-labelledby="filter-title" className="relative z-10 border-y border-ink/10 bg-page px-6 py-12 md:px-10">
      <h2 id="filter-title" className="mb-6 text-sm font-medium text-muted">
        {c.filter.title}
      </h2>
      <ul className="grid gap-6 md:grid-cols-3 md:gap-10">
        {c.filter.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-ink">
            <Check />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">{c.filter.note}</p>
    </section>

    {/* 3. The problem */}
    <Section id="problem" index="[ 01 ]" title={c.problem.title}>
      <RevealGroup amount={0.2} className="flex max-w-4xl flex-col gap-10">
        <RevealItem index={0} tag="p" className="max-w-3xl text-lg leading-relaxed text-soft">
          {c.problem.body}
        </RevealItem>
        <RevealItem index={1} tag="p" className="font-display text-xl font-bold text-ink">
          {c.problem.listTitle}
        </RevealItem>
        <RevealItem index={2} tag="div">
          <ol className="flex flex-col">
            {c.problem.symptoms.map((s, i) => (
              <li key={s} className="flex items-baseline gap-6 border-b border-ink/10 py-6 text-lg leading-relaxed text-ink md:text-xl">
                <span className="font-mono text-tag text-muted">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </RevealItem>
        <RevealItem index={3} tag="p" className="text-xl font-bold leading-relaxed text-ink md:text-2xl">
          {c.problem.closing}
        </RevealItem>
      </RevealGroup>
    </Section>

    {/* 4. The equation — the brand section, the only place the formula appears. */}
    <section aria-labelledby="equation-title" className="relative z-10 border-t border-ink/10 bg-ink/[0.03] px-6 py-24 md:px-10 md:py-32">
      <p className="mb-10 font-mono text-tag tracking-[0.2em] text-muted">[ 02 ]</p>
      <h2
        id="equation-title"
        dir="ltr"
        aria-label="Ctrl + Shift = Scale"
        className="grid grid-cols-[repeat(5,auto)] items-start justify-start gap-x-[0.3em] font-display text-formula font-extrabold leading-display text-ink drop-shadow-glow"
      >
        {c.equation.terms.map((t, i) => (
          <Term key={t.term} term={t.term} word={t.word} operator={["+", "="][i]} />
        ))}
      </h2>
      <p className="mt-12 max-w-2xl text-lg leading-relaxed text-soft">{c.equation.lead}</p>
      {/* Laid out in the formula's own left-to-right order, so each column sits under its term. */}
      <RevealGroup amount={0.2} tag="ul" className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12 md:[direction:ltr]">
        {c.equation.columns.map((col, i) => (
          <RevealItem key={col.term} index={i} tag="li" className={`flex flex-col gap-4 [direction:rtl] ${i === 2 ? "rounded-md border border-ink/20 bg-ink/[0.04] p-6" : "md:pt-6"}`}>
            <h3 className="flex flex-wrap items-baseline gap-x-3 font-display text-2xl font-bold text-ink">
              <span dir="ltr" className="font-mono">
                {col.term}.
              </span>
              {col.title}
            </h3>
            <p className={`leading-relaxed ${i === 2 ? "text-ink" : "text-soft"}`}>{col.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-16 max-w-4xl text-xl font-bold leading-relaxed text-ink md:text-2xl">{c.equation.closing}</p>
      <ArrowLink item={c.equation.link} className="mt-8" />
    </section>

    {/* 5. Three steps */}
    <Section id="steps" index="[ 03 ]" title={c.steps.title}>
      <StageList stages={c.steps.items} />
    </Section>

    {/* 6. The Ctrl/Shift board */}
    <Section id="board" index="[ 04 ]" title={c.board.title}>
      <ul className="grid gap-6 lg:grid-cols-3">
        {c.board.stories.map((story) => (
          <li key={story.name}>
            <StoryCard story={story} />
          </li>
        ))}
      </ul>
      <ArrowLink item={c.board.link} className="mt-10" />
    </Section>

    {/* 7. The base before the summit */}
    <Section id="foundation" index="[ 05 ]" title={c.foundation.title}>
      <div className="grid max-w-4xl gap-6 text-lg leading-relaxed text-soft">
        <p>{c.foundation.research}</p>
        <p className="text-sm text-muted">
          <cite className="not-italic">{c.foundation.sources}</cite>
        </p>
        <p>{c.foundation.body}</p>
      </div>
      <RevealGroup amount={0.2} tag="ul" className="mt-16 grid gap-4 md:grid-cols-5 md:items-start">
        {c.foundation.stairs.map((stair, i) => (
          <RevealItem key={stair.title} index={i} tag="li" className={`flex flex-col gap-2 border-t-2 border-ink/60 bg-ink/[0.03] p-5 ${STAIR_OFFSET[i]}`}>
            <span className="font-mono text-tag text-muted">0{i + 1}</span>
            <h3 className="font-display text-lg font-bold text-ink">{stair.title}</h3>
            <p className="text-sm leading-relaxed text-soft">{stair.line}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-16 max-w-3xl text-xl font-bold leading-relaxed text-ink md:text-2xl">{c.foundation.closing}</p>
      <ButtonLink item={c.foundation.cta} variant="secondary" className="mt-8" />
    </Section>

    {/* 9. Clients — names in grey until approved logos exist. */}
    <Section id="clients" title={c.clients.title} titleSize="small">
      <ul className="sr-only">
        {c.clients.names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div dir="ltr" aria-hidden="true" className="-mx-6 overflow-hidden md:-mx-10">
        <Marquee className="flex w-max whitespace-nowrap">
          {[...c.clients.names, ...c.clients.names].map((name, i) => (
            <span key={i} dir="rtl" className="mx-8 font-display text-2xl font-bold text-ink/25 md:mx-12 md:text-4xl">
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </Section>

    {/* 11. From the blog */}
    <Section id="blog" index="[ 06 ]" title={c.blog.title}>
      <ul className="border-t border-ink/10">
        {c.blog.posts.map((title) => (
          <li key={title} className="border-b border-ink/10 py-6">
            <h3 className="font-display text-xl font-bold text-ink md:text-2xl">{title}</h3>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-8">
        <ArrowLink item={c.blog.link} />
        <ArrowLink item={c.blog.secondary} />
      </div>
    </Section>

    {/* 12. FAQ */}
    <Section id="faq" index="[ 07 ]" title={c.faq.title}>
      <JsonLd data={faqPageSchema(c.faq.items)} />
      <FaqList items={c.faq.items} />
    </Section>

    {/* 13. Closing */}
    <CtaSection id="closing" title={c.closing.title} body={c.closing.body} primary={c.closing.primary} />
  </SiteShell>
);

/** A formula term with its Hebrew word under it, then the operator that follows it. */
const Term = ({ term, word, operator }: { term: string; word: string; operator?: string }) => (
  <>
    <span className="flex flex-col items-start">
      <span>{term}</span>
      <span aria-hidden="true" dir="rtl" className="mt-3 font-sans text-base font-medium text-muted md:text-xl">
        {word}
      </span>
    </span>
    {operator && (
      <span aria-hidden="true" className="text-muted">
        {operator}
      </span>
    )}
  </>
);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ink">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
