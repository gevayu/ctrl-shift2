// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import { LogoRow } from "@/components/site/logo-marquee";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { SiteShell } from "@/components/site/site-shell";
import { StoryCard } from "@/components/site/story-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { logos } from "@/data/logos";
import { discoveryPage, implementationPage, supportPage, type ServiceBlock, type ServicePage } from "@/data/services";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { faqPageSchema, serviceSchema } from "@/utils/seo/structured-data";

export const serviceMetadata = (page: ServicePage): Metadata => generateMetadata({ ...page.meta, url: page.path });

/**
 * One template for the three service pages (discovery, implementation,
 * support): hero, then the page's blocks in order, then the CTA with the
 * routing layer. JSON-LD: Service, FAQPage, BreadcrumbList.
 */
export const ServiceDetailView = ({ page }: { page: ServicePage }) => (
  <SiteShell>
    <JsonLd data={serviceSchema({ name: page.serviceName, description: page.meta.description, path: page.path })} />
    <PageHero crumbs={page.crumbs} title={page.title} intro={page.intro} />
    {page.blocks.map((block, i) => (
      <Block key={block.title} block={block} id={`s${i + 1}`} index={`[ 0${i + 1} ]`} />
    ))}
    <CtaSection primary={page.cta.primary} secondary={page.cta.secondary} routing />
  </SiteShell>
);

const Block = ({ block, id, index }: { block: ServiceBlock; id: string; index: string }) => {
  switch (block.kind) {
    case "steps":
      return (
        <Section id={id} index={index} title={block.title}>
          <RevealGroup amount={0.1} tag="ul" className="flex max-w-4xl flex-col">
            {block.items.map((step, i) => (
              <RevealItem key={step.title} index={i} tag="li" className="grid gap-3 border-b border-ink/10 py-8 md:grid-cols-[4rem_1fr] md:gap-8">
                <span className="font-mono text-2xl font-bold text-muted">{i + 1}.</span>
                <div className="flex flex-col gap-3">
                  <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-xl font-bold text-ink md:text-2xl">
                    {step.title}
                    {step.duration && <span className="font-sans text-sm font-medium text-muted">{step.duration}</span>}
                  </h3>
                  <p className="leading-relaxed text-soft">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      );
    case "list":
      return (
        <Section id={id} index={index} title={block.title}>
          <ul className="grid max-w-5xl gap-x-12 md:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-4 border-b border-ink/10 py-5 leading-relaxed text-ink">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-ink" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      );
    case "text":
      return (
        <Section id={id} index={index} title={block.title} tone={block.band ? "band" : "plain"}>
          <div className="flex max-w-3xl flex-col gap-5 text-lg leading-relaxed text-soft">
            {block.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {block.partnerLogos && (
            <div className="mt-12">
              <LogoRow dir={logos.partners.dir} items={logos.partners.items} />
            </div>
          )}
        </Section>
      );
    case "story":
      return (
        <Section id={id} index={index} title={block.title}>
          <StoryCard story={block.story} wide />
        </Section>
      );
    case "faq":
      return (
        <Section id={id} index={index} title={block.title}>
          <JsonLd data={faqPageSchema(block.items)} />
          <FaqList items={block.items} />
        </Section>
      );
  }
};

export const discoveryMetadata = serviceMetadata(discoveryPage);
export const DiscoveryView = () => <ServiceDetailView page={discoveryPage} />;

export const implementationMetadata = serviceMetadata(implementationPage);
export const ImplementationView = () => <ServiceDetailView page={implementationPage} />;

export const supportMetadata = serviceMetadata(supportPage);
export const SupportView = () => <ServiceDetailView page={supportPage} />;
