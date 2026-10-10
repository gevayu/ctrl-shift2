// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowLink } from "@/components/site/button-link";
import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { StoriesGrid } from "@/components/site/stories-grid";
import { Quote } from "@/components/site/quote";
import { StoryCard } from "@/components/site/story-card";
import { findStory, stories, storiesIndex as c, testimonials, type StoryPage } from "@/data/stories";
import { routes, storyPath } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

/* ── Index ──────────────────────────────────────────────────────────── */

export const storiesMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.stories });

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: c.meta.title,
  description: c.meta.description,
  url: `${siteConfig.url}${routes.stories}`,
  hasPart: stories.filter((s) => s.approved).map((s) => ({ "@type": "Article", headline: s.title, url: `${siteConfig.url}${storyPath(s.slug)}` })),
};

/**
 * Client stories index: H1, the filterable grid, "not here yet", what
 * clients say, the CTA with the routing layer. JSON-LD: CollectionPage.
 */
export const StoriesView = () => (
  <SiteShell>
    <JsonLd data={collectionSchema} />
    <div className="relative z-10 flex flex-col gap-10 px-6 pb-16 pt-32 md:px-10 md:pt-40">
      <Breadcrumbs crumbs={c.crumbs} />
      <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{c.title}</h1>
    </div>

    <Section id="stories" title={c.gridTitle}>
      <StoriesGrid
        items={stories.map((s) => ({ card: s.card, industry: s.card.industry, size: s.size, problems: s.problems, results: s.results }))}
      />
    </Section>

    <Section id="not-yet" title={c.notYet.title} titleSize="small">
      <p className="max-w-3xl text-base leading-relaxed text-soft">{c.notYet.body}</p>
    </Section>

    <Section id="testimonials" title={c.testimonialsTitle}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.person}>
            <Quote text={t.text} person={t.person} role={t.role} />
          </li>
        ))}
      </ul>
    </Section>

    <CtaSection primary={c.cta.primary} secondary={c.cta.secondary} routing />
  </SiteShell>
);

/* ── A story ────────────────────────────────────────────────────────── */

const s = c.story;

export const storyParams = () => stories.map((st) => ({ slug: st.slug }));

export const storyMetadata = (slug: string): Metadata => {
  const story = findStory(slug);
  if (!story) return {};
  const meta = generateMetadata({ ...story.meta, url: storyPath(slug) });
  // Not yet approved by the client in writing: reachable for review, not indexed.
  return story.approved ? meta : { ...meta, robots: { index: false, follow: false } };
};

const articleSchema = (story: StoryPage) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: story.title,
  description: story.meta.description,
  url: `${siteConfig.url}${storyPath(story.slug)}`,
  inLanguage: "he-IL",
  author: { "@type": "Person", name: "צליל נוימן" },
  publisher: { "@id": `${siteConfig.url}/#organization` },
  about: { "@type": "Organization", name: story.card.name },
});

/**
 * One client story: H1, the Ctrl/Shift card, the executive summary (marked
 * for the CEO), what didn't fit, what we did, the quote (once approved), what
 * next, related links, CTA. JSON-LD: Article with the client Organization.
 */
export const StoryView = ({ slug }: { slug: string }) => {
  const story = findStory(slug);
  if (!story) notFound();
  const related = story.related.stories.map(findStory).filter((r): r is StoryPage => Boolean(r));
  return (
    <SiteShell>
      <JsonLd data={articleSchema(story)} />
      <div className="relative z-10 flex flex-col gap-10 px-6 pb-16 pt-32 md:px-10 md:pt-40">
        <Breadcrumbs
          crumbs={[
            { label: "בית", href: routes.home },
            { label: "סיפורי לקוח", href: routes.stories },
            { label: story.card.name, href: storyPath(story.slug) },
          ]}
        />
        <h1 className="max-w-5xl text-balance font-display text-h2 font-extrabold leading-display text-ink drop-shadow-glow md:text-h1">{story.title}</h1>
        <StoryCard story={{ ...story.card, link: { label: "", href: null } }} wide headingLevel="h2" bare />
      </div>

      <Section id="summary" title={<>{s.summaryTitle} <span className="ms-3 rounded-sm border border-ink/30 px-2 py-1 align-middle font-sans text-xs font-medium text-soft">{s.summaryBadge}</span></>}>
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{story.summary}</p>
      </Section>

      <Section id="problem" title={s.problemTitle}>
        <p className="max-w-3xl text-lg leading-relaxed text-soft">{story.problem}</p>
      </Section>

      <Section id="what-we-did" title={s.stagesTitle}>
        <ol className="flex max-w-4xl flex-col">
          {story.stages.map((st, i) => (
            <li key={st.name} className="grid gap-3 border-b border-ink/10 py-8 md:grid-cols-[4rem_1fr] md:gap-8">
              <span className="font-mono text-2xl font-bold text-muted">0{i + 1}</span>
              <div className="flex flex-col gap-3">
                <h3 className="flex flex-wrap items-baseline gap-x-4 font-display text-xl font-bold text-ink md:text-2xl">
                  {st.name}
                  {st.duration && <span className="font-sans text-sm font-medium text-muted">{st.duration}</span>}
                </h3>
                <p className="leading-relaxed text-soft">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {story.quote?.approved && (
        <Section id="quote" title={s.quoteTitle}>
          <div className="max-w-3xl">
            <Quote text={story.quote.text} person={story.quote.person} role={story.quote.role} />
          </div>
        </Section>
      )}

      {story.next && (
        <Section id="next" title={s.nextTitle}>
          <p className="max-w-3xl text-lg leading-relaxed text-soft">{story.next}</p>
        </Section>
      )}

      <Section id="related" title={s.relatedTitle} titleSize="small">
        {related.length > 0 && (
          <ul className="mb-10 grid gap-6 lg:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <StoryCard story={r.card} />
              </li>
            ))}
          </ul>
        )}
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="mb-2 text-xs font-medium text-muted">{s.processLabel}</dt>
            <dd>
              <ArrowLink item={story.related.process} />
            </dd>
          </div>
          <div>
            <dt className="mb-2 text-xs font-medium text-muted">{s.stageLabel}</dt>
            <dd>
              <ArrowLink item={story.related.stage} />
            </dd>
          </div>
        </dl>
      </Section>

      <CtaSection primary={s.cta.primary} secondary={s.cta.secondary} />
    </SiteShell>
  );
};
