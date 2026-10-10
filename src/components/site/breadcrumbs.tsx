import { breadcrumbSchema, type Crumb } from "@/utils/seo/structured-data";

import { JsonLd } from "./json-ld";
import { SmartLink } from "./smart-link";

/** The visible trail plus its BreadcrumbList JSON-LD. The last crumb is the page itself. */
export const Breadcrumbs = ({ crumbs }: { crumbs: readonly Crumb[] }) => (
  <nav aria-label="פירורי לחם" className="text-xs text-muted md:text-sm">
    <JsonLd data={breadcrumbSchema(crumbs)} />
    <ol className="flex flex-wrap items-center gap-2">
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        return (
          <li key={crumb.label} className="flex items-center gap-2">
            {last ? (
              <span aria-current="page" className="text-soft">
                {crumb.label}
              </span>
            ) : crumb.href ? (
              <SmartLink item={crumb} className="transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-ink" />
            ) : (
              <span>{crumb.label}</span>
            )}
            {!last && <span aria-hidden="true">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);
