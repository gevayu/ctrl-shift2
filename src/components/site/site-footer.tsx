import Link from "next/link";

import { siteContent as c } from "@/data/site";
import { routes } from "@/lib/routes";

import { SmartLink } from "./smart-link";

const LINK = "text-sm text-soft transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink";

/** Four columns: the company and its contact details, then services, knowledge, company. */
export const SiteFooter = () => {
  const f = c.footer;
  return (
    <footer className="relative z-10 border-t border-ink/5 bg-page px-6 pb-28 pt-16 md:px-10 md:pb-12">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href={routes.home} dir="ltr" className="self-start font-mono text-xl font-bold tracking-tight text-ink">
            {c.brand}
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{f.tagline}</p>
          <address className="flex flex-col gap-2 not-italic">
            <span className="text-sm text-soft">{f.address}</span>
            <SmartLink item={f.phone} className={`${LINK} self-start`}>
              <span dir="ltr">{f.phone.label}</span>
            </SmartLink>
            <SmartLink item={f.email} className={`${LINK} self-start`} />
            <SmartLink item={f.linkedin} className={`${LINK} self-start`} />
          </address>
        </div>
        {f.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
            <h2 className="font-display text-base font-bold text-ink">{col.title}</h2>
            <ul className="flex flex-col gap-2">
              {col.links.map((item) => (
                <li key={item.label}>
                  <SmartLink item={item} className={LINK} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mt-16 border-t border-ink/5 pt-6 text-xs text-muted">{f.copyright}</p>
    </footer>
  );
};
