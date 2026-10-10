// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogList } from "@/components/site/blog-list";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { SmartLink } from "@/components/site/smart-link";
import { articles, blogContent as c, findArticle } from "@/data/blog";
import { siteContent } from "@/data/site";
import { latestArticles, loadArticle, type ArticleBlock } from "@/lib/blog";
import { articlePath, routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { faqPageSchema } from "@/utils/seo/structured-data";

/** Meta description from the answer paragraph: whole sentences up to ~160 characters. */
const describe = (answer: string) => {
  let out = "";
  for (const sentence of answer.match(/[^.?!]+[.?!]/g) ?? [answer]) {
    if ((out + sentence).length > 160 && out) break;
    out += sentence;
  }
  return out.trim();
};

/* ── Index ──────────────────────────────────────────────────────────── */

export const blogMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.blog });

/**
 * The blog: H1, the intro line, cluster tabs over the list, the newsletter
 * sign-up (here only), the routing layer. JSON-LD: Blog.
 */
export const BlogView = () => {
  const items = latestArticles();
  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: c.meta.title,
          description: c.meta.description,
          url: `${siteConfig.url}${routes.blog}`,
          inLanguage: "he-IL",
          blogPost: items.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${siteConfig.url}${a.href}`, author: { "@type": "Person", name: a.author } })),
        }}
      />
      <div className="relative z-10 flex flex-col gap-8 px-6 pb-12 pt-32 md:px-10 md:pt-40">
        <Breadcrumbs crumbs={c.crumbs} />
        <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{c.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-soft">{c.intro}</p>
      </div>

      <Section id="articles">
        <BlogList items={items.map(({ href, title, author, answer, cluster }) => ({ href, title, author, answer, cluster }))} />
      </Section>

      <Section id="newsletter" title={c.newsletter.title} titleSize="small" tone="band">
        <p className="mb-8 max-w-2xl text-soft">{c.newsletter.body}</p>
        <NewsletterForm />
        <nav aria-label="ניתוב לפי תפקיד" className="mt-16 border-t border-ink/10 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {siteContent.routing.map((item) => (
              <li key={item.label}>
                <SmartLink item={item} className="text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink" />
              </li>
            ))}
          </ul>
        </nav>
      </Section>
    </SiteShell>
  );
};

/* ── An article ─────────────────────────────────────────────────────── */

export const articleParams = () => articles.map((a) => ({ slug: a.slug }));

export const articleMetadata = (slug: string): Metadata => {
  const a = findArticle(slug);
  if (!a) return {};
  return generateMetadata({
    title: `${a.title} | Ctrl+Shift`,
    description: describe(loadArticle(slug).answer),
    url: articlePath(slug),
  });
};

/**
 * One article: H1 (+ subtitle), byline, the body, its FAQ (FAQPage), CTA.
 * JSON-LD: BlogPosting, FAQPage, BreadcrumbList.
 */
export const ArticleView = ({ slug }: { slug: string }) => {
  const a = findArticle(slug);
  if (!a) notFound();
  const body = loadArticle(slug);
  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.title,
          description: describe(body.answer),
          url: `${siteConfig.url}${articlePath(slug)}`,
          inLanguage: "he-IL",
          author: { "@type": "Person", name: a.author },
          publisher: { "@id": `${siteConfig.url}/#organization` },
        }}
      />
      {body.faq.length > 0 && <JsonLd data={faqPageSchema(body.faq)} />}
      <article className="relative z-10">
        <header className="flex flex-col gap-6 px-6 pb-12 pt-32 md:px-10 md:pt-40">
          <Breadcrumbs crumbs={[...c.crumbs, { label: a.title, href: articlePath(slug) }]} />
          <h1 className="max-w-4xl text-balance font-display text-h2 font-extrabold leading-display text-ink drop-shadow-glow">{a.title}</h1>
          {a.subtitle && <p className="text-xl font-medium text-soft">{a.subtitle}</p>}
          <p className="text-sm text-muted">
            {c.article.byline} {a.author}
          </p>
        </header>
        <div className="border-t border-ink/5 bg-page/60 px-6 py-16 backdrop-blur-3xl md:px-10">
          <div className="flex max-w-3xl flex-col gap-5 text-lg leading-relaxed text-soft">
            {body.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
          {body.faq.length > 0 && (
            <section aria-labelledby="article-faq" className="mt-20 max-w-3xl">
              <h2 id="article-faq" className="mb-8 font-display text-2xl font-extrabold text-ink md:text-3xl">
                {body.faqTitle}
              </h2>
              <FaqList items={body.faq} />
            </section>
          )}
        </div>
      </article>
      <CtaSection title={c.article.cta.title} primary={c.article.cta.primary} secondary={c.article.cta.secondary} />
    </SiteShell>
  );
};

const Block = ({ block }: { block: ArticleBlock }) => {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 font-display text-2xl font-extrabold leading-snug text-ink md:text-3xl">{block.text}</h2>;
    case "quote":
      return <p className="border-s-2 border-ink/60 ps-5 text-xl font-bold text-ink">{block.text}</p>;
    case "ul":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-ink/70" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "p":
      return <p>{block.text}</p>;
  }
};
