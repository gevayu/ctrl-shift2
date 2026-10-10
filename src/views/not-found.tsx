// 📖 Docs: obsidian/frontend/views.md

import { ArrowLink } from "@/components/site/button-link";
import { SiteShell } from "@/components/site/site-shell";
import { links, type LinkItem } from "@/data/site";
import { routes } from "@/lib/routes";

/** 404 copy, from the client's copy doc. */
const copy = {
  title: "העמוד הזה לא במידה.",
  body: "הוא הוסר, שינה כתובת, או מעולם לא היה. מה שכן יש:",
  links: [
    { label: "לעמוד הבית", href: routes.home },
    { label: "לסיפורי הלקוח", href: routes.stories },
    { label: "לספריית התהליכים", href: routes.processes },
    { label: "לתאם פגישת איפיון", href: links.meeting },
  ] satisfies LinkItem[],
};

export const NotFoundView = () => (
  <SiteShell>
    <div className="relative z-10 flex min-h-[80svh] flex-col justify-center gap-8 px-6 pb-20 pt-32 md:px-10">
      <p className="font-mono text-tag tracking-[0.2em] text-muted">[ 404 ]</p>
      <h1 className="font-display text-h1 font-extrabold leading-display text-ink drop-shadow-glow">{copy.title}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-soft">{copy.body}</p>
      <ul className="flex flex-col gap-4">
        {copy.links.map((item) => (
          <li key={item.label}>
            <ArrowLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  </SiteShell>
);
