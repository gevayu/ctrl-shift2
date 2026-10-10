"use client";

import Link from "next/link";
import { useState } from "react";

import { blogContent, CLUSTERS, type ClusterId } from "@/data/blog";

export interface BlogItem {
  href: string;
  title: string;
  author: string;
  answer: string;
  cluster: ClusterId;
}

/**
 * The article list with the four cluster tabs ("הכל" selected by default);
 * a tab shows its one-line description. Chronological, no lead images.
 * ponytail: no pagination yet (10 per page per the doc); add it past 10 articles.
 */
export const BlogList = ({ items }: { items: readonly BlogItem[] }) => {
  const [tab, setTab] = useState<ClusterId | "">("");
  const active = CLUSTERS.find((c) => c.id === tab);
  const shown = tab ? items.filter((i) => i.cluster === tab) : items;
  return (
    <>
      <div role="tablist" aria-label="אשכולות" className="flex flex-wrap gap-2">
        {[{ id: "" as const, label: blogContent.all }, ...CLUSTERS].map((c) => (
          <button
            key={c.id || "all"}
            role="tab"
            type="button"
            aria-selected={tab === c.id}
            onClick={() => setTab(c.id)}
            className={`rounded-sm border px-4 py-2 text-sm transition-colors duration-[var(--duration-fast)] ease-entrance ${tab === c.id ? "border-ink bg-ink text-page" : "border-ink/20 text-soft hover:border-ink/50"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-6 text-sm text-muted">{active?.description}</p>
      <ul className="mt-8 border-t border-ink/10">
        {shown.map((a) => (
          <li key={a.href} className="border-b border-ink/10">
            <Link href={a.href} className="group flex flex-col gap-3 py-8">
              <h2 className="font-display text-xl font-bold text-ink transition-opacity duration-[var(--duration-fast)] ease-entrance group-hover:opacity-70 md:text-2xl">
                {a.title}
              </h2>
              <p className="text-xs text-muted">{a.author}</p>
              <p className="max-w-3xl leading-relaxed text-soft">{a.answer}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
