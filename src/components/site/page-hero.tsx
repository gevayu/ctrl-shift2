import type { Crumb } from "@/utils/seo/structured-data";

import { Breadcrumbs } from "./breadcrumbs";

/**
 * An inner page's first screen: breadcrumbs, the one H1, the opening
 * paragraph(s). Plain markup — no entrance — so the server HTML is the page
 * at rest and the H1 paints with the first frame.
 */
export const PageHero = ({
  crumbs,
  title,
  intro,
}: {
  crumbs: readonly Crumb[];
  title: string;
  intro: readonly string[];
}) => (
  <div className="relative z-10 flex min-h-[70svh] flex-col justify-end gap-10 px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40">
    <Breadcrumbs crumbs={crumbs} />
    <h1 className="max-w-5xl text-balance font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{title}</h1>
    <div className="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-soft">
      {intro.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  </div>
);
