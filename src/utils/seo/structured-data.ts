/**
 * @fileoverview JSON-LD structured data helpers.
 *
 * Structured data lets search engines understand the site as entities
 * (Organization, WebSite, Service, FAQPage, BreadcrumbList) rather than just
 * text. Render the output with `<JsonLd>`.
 */

import { siteConfig } from "@/lib/site";

const orgId = `${siteConfig.url}/#organization`;
const abs = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

/**
 * Organization + WebSite schema for the site root. Emit once, in the root
 * layout. The two nodes are linked by `@id` so crawlers treat them as related.
 */
export function getSiteStructuredData() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/assets/logos/brand/ctrl-shift.png`,
        description: siteConfig.about,
        email: contact.email,
        telephone: contact.phoneE164,
        openingHours: contact.hoursSchema,
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.street,
          addressLocality: contact.city,
          addressCountry: "IL",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: "he-IL",
        publisher: { "@id": orgId },
      },
    ],
  };
}

export interface FaqEntry {
  q: string;
  a: string;
}

/** FAQPage — one per page, listing every question rendered on it. */
export const faqPageSchema = (items: readonly FaqEntry[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export interface Crumb {
  label: string;
  /** `null` for a level that has no page of its own (e.g. "ידע"). */
  href: string | null;
}

/** BreadcrumbList — levels without a page are listed by name only. */
export const breadcrumbSchema = (crumbs: readonly Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: abs(c.href) } : {}),
  })),
});

/** Service, provided by the site's Organization. */
export const serviceSchema = ({ name, description, path }: { name: string; description: string; path: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: abs(path),
  areaServed: "IL",
  provider: { "@id": orgId },
});
