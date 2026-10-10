import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { LinkItem } from "@/data/site";

import { ArrowLink } from "./button-link";

export interface Stage {
  number: string;
  name: string;
  english: string;
  body: string;
  outcomeLabel: string;
  outcome: string;
  link: LinkItem;
}

/**
 * The three stages as side-by-side blocks: number, Hebrew name (H3), the
 * small English name, the paragraph, what you hold at the end, the link.
 * Shared by the home page and the services page.
 */
export const StageList = ({ stages }: { stages: readonly Stage[] }) => (
  <RevealGroup amount={0.15} tag="ul" className="grid gap-6 lg:grid-cols-3">
    {stages.map((stage, i) => (
      <RevealItem key={stage.number} index={i} tag="li" className="flex flex-col gap-5 rounded-md border border-ink/10 bg-page/40 p-6 md:p-8">
        <span className="font-mono text-3xl font-bold text-muted">{stage.number}</span>
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{stage.name}</h3>
          <p dir="ltr" className="mt-1 text-end font-mono text-tag uppercase tracking-[0.2em] text-muted">
            {stage.english}
          </p>
        </div>
        <p className="leading-relaxed text-soft">{stage.body}</p>
        <p className="border-t border-ink/10 pt-5 text-sm leading-relaxed text-soft">
          <strong className="block font-bold text-ink">{stage.outcomeLabel}</strong>
          {stage.outcome}
        </p>
        <ArrowLink item={stage.link} className="mt-auto" />
      </RevealItem>
    ))}
  </RevealGroup>
);
