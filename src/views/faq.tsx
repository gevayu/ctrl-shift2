// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { SmartLink } from "@/components/site/smart-link";
import { faqContent as c } from "@/data/faq";
import { routes } from "@/lib/routes";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { faqPageSchema } from "@/utils/seo/structured-data";

export const faqMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.faq });

/**
 * The FAQ page: four groups (H2), every question an H3 with its own anchor.
 * Answers are open on desktop and folded on phones. One FAQPage JSON-LD for
 * the whole page.
 */
export const FaqView = () => (
  <SiteShell>
    <JsonLd data={faqPageSchema(c.groups.flatMap((g) => g.items))} />
    <div className="relative z-10 flex flex-col gap-10 px-6 pb-16 pt-32 md:px-10 md:pt-40">
      <Breadcrumbs crumbs={c.crumbs} />
      <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{c.title}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-soft">
        {c.intro} <SmartLink item={c.ask} className="text-ink underline underline-offset-4" />
      </p>
      <nav aria-label="נושאים">
        <ul className="flex flex-wrap gap-3">
          {c.groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="inline-block rounded-sm border border-ink/20 px-4 py-2 text-sm text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-ink/60 hover:text-ink">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    {c.groups.map((g) => (
      <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="relative z-10 scroll-mt-20 border-t border-ink/5 bg-page/60 px-6 py-16 backdrop-blur-3xl md:px-10 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-16">
          <h2 id={`${g.id}-title`} className="font-display text-h2 font-extrabold leading-display text-ink lg:sticky lg:top-28 lg:self-start">
            {g.title}
          </h2>
          <FaqList items={g.items} openOnDesktop />
        </div>
      </section>
    ))}

    <CtaSection primary={c.cta.primary} secondary={c.cta.secondary} routing />
  </SiteShell>
);
