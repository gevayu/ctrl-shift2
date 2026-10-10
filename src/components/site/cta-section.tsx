import { siteContent, type LinkItem } from "@/data/site";

import { ButtonLink } from "./button-link";
import { SmartLink } from "./smart-link";

/**
 * The closing call to action: a dark full-width band with up to two buttons,
 * and on inner pages the routing layer (שכבת ניתוב) under them.
 */
export const CtaSection = ({
  id = "cta",
  title,
  body,
  primary,
  secondary,
  routing = false,
}: {
  id?: string;
  title?: string;
  body?: string;
  primary: LinkItem;
  secondary?: LinkItem;
  routing?: boolean;
}) => (
  <section
    id={id}
    aria-labelledby={title ? `${id}-title` : undefined}
    aria-label={title ? undefined : "לתיאום פגישה"}
    className="relative z-10 border-t border-ink/10 bg-page px-6 py-24 md:px-10 md:py-32"
  >
    <div className="flex max-w-4xl flex-col gap-8">
      {title && (
        <h2 id={`${id}-title`} className="text-balance font-display text-h2 font-extrabold leading-display text-ink">
          {title}
        </h2>
      )}
      {body && <p className="max-w-2xl text-lg leading-relaxed text-soft">{body}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <ButtonLink item={primary} />
        {secondary && <ButtonLink item={secondary} variant="secondary" />}
      </div>
      {routing && (
        <nav aria-label="ניתוב לפי תפקיד" className="mt-6 border-t border-ink/10 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {siteContent.routing.map((item) => (
              <li key={item.label}>
                <SmartLink item={item} className="text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink" />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  </section>
);
