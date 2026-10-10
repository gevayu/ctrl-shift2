import type { LinkItem } from "@/data/site";

import { ArrowLink } from "./button-link";

export interface Faq {
  /** Anchor id, so articles and stories can link to one question. */
  id: string;
  q: string;
  a: string;
  /** A link appended to the answer. */
  link?: LinkItem;
}

/**
 * Questions as native `<details>`: no JavaScript, keyboard and screen-reader
 * accessible out of the box. Each question is an H3 (copy doc heading rules).
 * `openOnDesktop` shows every answer from `md` up while phones keep them
 * folded (the FAQ page's spec), done in CSS via `::details-content`; a
 * browser without it keeps them folded everywhere, which still works.
 * The FAQPage JSON-LD is emitted by the page, once, for all its questions.
 */
export const FaqList = ({ items, openOnDesktop = false }: { items: readonly Faq[]; openOnDesktop?: boolean }) => (
  <div className="faq-list border-t border-ink/10" data-open-desktop={openOnDesktop || undefined}>
    {items.map((item) => (
      <details key={item.id} id={item.id} className="group scroll-mt-28 border-b border-ink/10">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
          <h3 className="font-display text-lg font-bold leading-snug text-ink md:text-xl">{item.q}</h3>
          <span aria-hidden="true" className="faq-toggle mt-1 font-mono text-xl leading-none text-muted transition-transform duration-[var(--duration-fast)] ease-entrance group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="max-w-3xl pb-8 text-base leading-relaxed text-soft">
          <p>{item.a}</p>
          {item.link && <ArrowLink item={item.link} className="mt-4" />}
        </div>
      </details>
    ))}
  </div>
);
