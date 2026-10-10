// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/site/button-link";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { ProcessGrid } from "@/components/site/process-grid";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { SmartLink } from "@/components/site/smart-link";
import { findProcess, processes, processesIndex as c, type Process } from "@/data/processes";
import { processPath, routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

/* ── Index ──────────────────────────────────────────────────────────── */

export const processesMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.processes });

/**
 * The process library: H1, the filterable cards (the five full processes),
 * the 25 coming next by department, the CTA. JSON-LD: CollectionPage.
 */
export const ProcessesView = () => (
  <SiteShell>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: c.meta.title,
        description: c.meta.description,
        url: `${siteConfig.url}${routes.processes}`,
      }}
    />
    <div className="relative z-10 flex flex-col gap-10 px-6 pb-16 pt-32 md:px-10 md:pt-40">
      <Breadcrumbs crumbs={c.crumbs} />
      <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{c.title}</h1>
      <div className="flex max-w-2xl flex-col gap-2 text-lg leading-relaxed text-soft">
        {c.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>

    <Section id="processes">
      <ProcessGrid items={processes.map((p) => ({ href: processPath(p.slug), ...p.card }))} />
    </Section>

    <Section id="soon" title={c.soon.title}>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {c.soon.groups.map((g) => (
          <div key={g.department}>
            <h3 className="mb-4 font-display text-lg font-bold text-ink">{g.department}</h3>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-soft">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>

    <CtaSection title={c.cta.title} primary={c.cta.primary} secondary={c.cta.secondary} routing />
  </SiteShell>
);

/* ── A process ──────────────────────────────────────────────────────── */

const p = c.page;

export const processParams = () => processes.map((pr) => ({ slug: pr.slug }));

export const processMetadata = (slug: string): Metadata => {
  const pr = findProcess(slug);
  return pr ? generateMetadata({ ...pr.meta, url: processPath(slug) }) : {};
};

const howToSchema = (pr: Process) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: pr.title,
  description: pr.answer,
  url: `${siteConfig.url}${processPath(pr.slug)}`,
  inLanguage: "he-IL",
  author: { "@type": "Person", name: "צליל נוימן" },
  step: pr.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
});

/**
 * One process: H1, the answer paragraph (marked), the problem, the steps
 * (HowTo), what to measure, what it saves, which stair and what comes first,
 * the related story, the CTA.
 */
export const ProcessView = ({ slug }: { slug: string }) => {
  const pr = findProcess(slug);
  if (!pr) notFound();
  return (
    <SiteShell>
      <JsonLd data={howToSchema(pr)} />
      <div className="relative z-10 flex flex-col gap-8 px-6 pb-16 pt-32 md:px-10 md:pt-40">
        <Breadcrumbs crumbs={[...c.crumbs, { label: pr.title, href: processPath(pr.slug) }]} />
        <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{pr.title}</h1>
        {pr.author && <p className="text-sm text-muted">{pr.author}</p>}
        <p className="max-w-3xl border-s-2 border-ink/60 bg-ink/[0.04] p-6 text-lg leading-relaxed text-ink">{pr.answer}</p>
      </div>

      <Section id="problem" title={p.problemTitle}>
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{pr.problem}</p>
      </Section>

      <Section id="steps" title={p.stepsTitle}>
        <ol className="flex max-w-3xl flex-col">
          {pr.steps.map((step, i) => (
            <li key={step} className="flex items-baseline gap-6 border-b border-ink/10 py-5 text-lg leading-relaxed text-ink">
              <span className="font-mono text-base text-muted">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section id="measure" title={p.measureTitle} titleSize="small">
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{pr.measure}</p>
      </Section>

      <Section id="saves" title={p.savesTitle} titleSize="small">
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{pr.saves}</p>
      </Section>

      <Section id="stair" title={p.stairTitle} titleSize="small">
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{pr.stair}</p>
        <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 pt-6 text-soft">
          <p>
            {p.storyLabel} <SmartLink item={pr.relatedStory} className="text-ink underline underline-offset-4" />
          </p>
          <p>
            {pr.dimension} <SmartLink item={p.controlScore} className="underline underline-offset-4" />
          </p>
        </div>
      </Section>

      <section aria-labelledby="process-cta" className="relative z-10 border-t border-ink/10 bg-page px-6 py-20 md:px-10">
        <h2 id="process-cta" className="mb-8 font-display text-h2 font-extrabold leading-display text-ink">
          {p.ctaTitle}
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <ButtonLink item={pr.cta} />
          <ArrowLink item={p.back} />
        </div>
      </section>
    </SiteShell>
  );
};
