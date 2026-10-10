// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";
import Link from "next/link";

import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { StageList } from "@/components/site/stage-list";
import { StoryCard } from "@/components/site/story-card";
import { servicesContent as c } from "@/data/services";
import { routes } from "@/lib/routes";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { faqPageSchema, serviceSchema } from "@/utils/seo/structured-data";

export const servicesMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.services });

/**
 * The services parent page: the order of the three stages, each with what you
 * hold at the end, what we never do, one client across the whole track, and
 * three questions. JSON-LD: a Service per stage, FAQPage, BreadcrumbList.
 */
export const ServicesView = () => (
  <SiteShell>
    <JsonLd data={c.stages.map((s) => serviceSchema({ name: s.name, description: s.body, path: s.link.href }))} />
    <PageHero crumbs={c.crumbs} title={c.title} intro={c.intro} />

    {/* Timeline, right to left; each segment opens its page. */}
    <nav aria-label="שלבי המסלול" className="relative z-10 px-6 pb-20 md:px-10">
      <ol className="grid border-t border-ink/20 md:grid-cols-3">
        {c.timeline.map((t) => (
          <li key={t.number}>
            <Link
              href={t.href}
              className="group flex h-full flex-col gap-2 border-b border-ink/10 py-6 transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-ink/[0.04] md:border-b-0 md:border-s md:px-6 md:first:border-s-0 md:first:ps-0"
            >
              <span className="font-mono text-tag text-muted">{t.number}</span>
              <span className="font-display text-xl font-bold text-ink">{t.name}</span>
              <span className="text-sm text-soft">{t.duration}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>

    <Section id="stages" index="[ 01 ]">
      <StageList stages={c.stages} />
    </Section>

    <Section id="never" index="[ 02 ]" title={c.never.title}>
      <ul className="flex max-w-3xl flex-col">
        {c.never.items.map((item) => (
          <li key={item} className="flex items-start gap-4 border-b border-ink/10 py-6 text-lg leading-relaxed text-ink">
            <Cross />
            {item}
          </li>
        ))}
      </ul>
    </Section>

    <Section id="story" index="[ 03 ]" title={c.story.title}>
      <StoryCard story={c.story.card} wide />
    </Section>

    <Section id="faq" index="[ 04 ]" title={c.faq.title}>
      <JsonLd data={faqPageSchema(c.faq.items)} />
      <FaqList items={c.faq.items} />
    </Section>

    <CtaSection primary={c.cta.primary} secondary={c.cta.secondary} routing />
  </SiteShell>
);

const Cross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true" className="mt-1.5 h-5 w-5 shrink-0 text-muted">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
