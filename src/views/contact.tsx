// 📖 Docs: obsidian/frontend/views.md

import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/site/button-link";
import { ContactForm } from "@/components/site/contact-form";
import { JsonLd } from "@/components/site/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { SmartLink } from "@/components/site/smart-link";
import { contactContent as c } from "@/data/contact";
import { siteContent } from "@/data/site";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const contactMetadata: Metadata = generateMetadata({ ...c.meta, url: routes.contact });

const { contact } = siteConfig;
/** A map link rather than an embedded map: no third-party iframe, no cookies. */
const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact.street}, ${contact.city}`)}`;

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: c.meta.title,
  url: `${siteConfig.url}${routes.contact}`,
  about: { "@id": `${siteConfig.url}/#organization` },
};

/**
 * Contact: on the right (first on phones) booking a time, on the left the
 * call-back form; the details line under both, then "not sure you fit?" and
 * the routing layer. JSON-LD: ContactPage (Organization holds the address,
 * phone and hours).
 */
export const ContactView = () => (
  <SiteShell>
    <JsonLd data={contactPageSchema} />
    <div className="relative z-10 flex flex-col gap-8 px-6 pb-12 pt-32 md:px-10 md:pt-40">
      <Breadcrumbs crumbs={c.crumbs} />
      <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{c.title}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-soft">{c.intro}</p>
    </div>

    <section aria-label={c.form.title} className="relative z-10 grid gap-12 border-t border-ink/5 bg-page/60 px-6 py-16 backdrop-blur-3xl md:px-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-h2 font-extrabold leading-display text-ink">{c.booking.title}</h2>
        <p className="text-lg leading-relaxed text-soft">{c.booking.body}</p>
        <ButtonLink item={c.booking.cta} variant="secondary" className="self-start" />
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-h2 font-extrabold leading-display text-ink">{c.form.title}</h2>
        <ContactForm />
      </div>
    </section>

    <section aria-labelledby="details-title" className="relative z-10 border-t border-ink/5 bg-page px-6 py-12 md:px-10">
      <h2 id="details-title" className="mb-4 font-display text-xl font-bold text-ink">
        {c.details.title}
      </h2>
      <p className="flex flex-wrap gap-x-3 gap-y-2 text-soft">
        <span>{siteConfig.name}</span>
        <Sep />
        <a href={MAP_HREF} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
          {contact.street}, {contact.city}
        </a>
        <Sep />
        <SmartLink item={siteContent.footer.phone} className="hover:text-ink">
          <span dir="ltr">{contact.phone}</span>
        </SmartLink>
        <Sep />
        <SmartLink item={siteContent.footer.email} className="hover:text-ink" />
        <Sep />
        <span>{contact.hours}</span>
      </p>
    </section>

    <section aria-labelledby="audience-title" className="relative z-10 border-t border-ink/5 bg-page px-6 py-16 md:px-10">
      <h2 id="audience-title" className="mb-6 font-display text-h2 font-extrabold leading-display text-ink">
        {c.audience.title}
      </h2>
      <p className="max-w-3xl text-lg leading-relaxed text-soft">{c.audience.body}</p>
      <ArrowLink item={c.audience.link} className="mt-6" />
      <nav aria-label="ניתוב לפי תפקיד" className="mt-12 border-t border-ink/10 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {siteContent.routing.map((item) => (
            <li key={item.label}>
              <SmartLink item={item} className="text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink" />
            </li>
          ))}
        </ul>
      </nav>
    </section>
  </SiteShell>
);

const Sep = () => (
  <span aria-hidden="true" className="text-muted">
    |
  </span>
);

/** The thank-you pages (A: 10+ employees, B: "עד 9"). Not indexed. */
export const thanksMetadata: Metadata = { ...generateMetadata({ title: `${c.thanks.a.title} | Ctrl+Shift`, url: routes.contactThanks }), robots: { index: false, follow: false } };

export const ContactThanksView = ({ variant }: { variant: "a" | "b" }) => {
  const t = variant === "a" ? c.thanks.a : c.thanks.b;
  return (
    <SiteShell>
      <div className="relative z-10 flex min-h-[80svh] flex-col justify-center gap-8 px-6 pb-20 pt-32 md:px-10">
        <h1 className="font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{t.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-soft">{t.body}</p>
        {variant === "a" && c.booking.cta.href && (
          <div className="flex flex-col gap-4">
            <p className="text-soft">{c.thanks.a.calendarIntro}</p>
            <ButtonLink item={c.booking.cta} className="self-start" />
          </div>
        )}
        {variant === "b" && <ArrowLink item={c.audience.link} />}
        <ArrowLink item={c.thanks.home} />
      </div>
    </SiteShell>
  );
};
