// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { JsonLd } from "@/components/site/json-ld";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { PageHero } from "@/components/site/page-hero";
import { Quote } from "@/components/site/quote";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { StageList } from "@/components/site/stage-list";
import { aboutContent as c } from "@/data/about";
import { aboutParagraphs } from "@/data/about-text";
import { homeContent } from "@/data/home";
import { logos } from "@/data/logos";
import { testimonials } from "@/data/stories";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const aboutMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.about });

/**
 * About: the company in 150 words, the three stages, the clients, what they
 * say, the closing CTA. JSON-LD: AboutPage (the Organization node already
 * carries the same text, address and contact details).
 */
export const AboutView = () => (
  <SiteShell>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: c.meta.title,
        url: `${siteConfig.url}${routes.about}`,
        about: { "@id": `${siteConfig.url}/#organization` },
      }}
    />
    <PageHero crumbs={c.crumbs} title={c.title} intro={aboutParagraphs} />

    <Section id="stages" title={c.stagesTitle}>
      <StageList stages={homeContent.steps.items} />
    </Section>

    <Section id="clients" title={logos.clients.title} titleSize="small">
      <LogoMarquee dir={logos.clients.dir} items={logos.clients.items} />
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

    <CtaSection id="closing" title={c.closing.title} body={c.closing.body} primary={c.closing.primary} secondary={c.closing.secondary} />
  </SiteShell>
);
