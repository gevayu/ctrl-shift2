import type { LinkItem } from "@/data/site";

import { ArrowLink } from "./button-link";

export interface StoryMetric {
  /** The number, set large: "24", "40%", "27 → 87". */
  value: string;
  label: string;
  note?: string;
}

export interface Story {
  name: string;
  industry: string;
  /** Company size, e.g. "10 עד 30 עובדים". */
  size?: string;
  /** The path the client went through (services page). */
  path?: string;
  before?: string;
  ctrl: string;
  shift: readonly StoryMetric[];
  /** The technical summary (implementation page). */
  tech?: string;
  /** Control score before and after, and the dimensions that moved most. */
  control?: { before: number; after: number; dims?: string };
  link: LinkItem;
}

/** Ctrl / Shift are Latin, set in mono; the Hebrew labels in the text face. */
const LABEL = "font-mono text-tag font-medium uppercase tracking-[0.2em] text-muted";
const LABEL_HE = "text-xs font-medium text-muted";

/**
 * The Ctrl/Shift card — the same structure as the card at the top of every
 * client story: name and industry, the Ctrl line, the Shift numbers large.
 * `wide` lays it across the full width with the numbers beside the text.
 */
export const StoryCard = ({
  story,
  wide = false,
  headingLevel = "h3",
  bare = false,
}: {
  story: Story;
  wide?: boolean;
  headingLevel?: "h2" | "h3";
  /** No "full story" link: the card at the top of the story itself. */
  bare?: boolean;
}) => {
  const Heading = headingLevel;
  return (
    <article className={`flex h-full flex-col gap-6 rounded-md border border-ink/10 bg-page/40 p-6 backdrop-blur-md md:p-8 ${wide ? "lg:grid lg:grid-cols-2 lg:gap-12" : ""}`}>
      <div className="flex flex-col gap-6">
        <header>
          <Heading className="font-display text-2xl font-bold text-ink">{story.name}</Heading>
          <p className="mt-1 text-sm text-muted">
            {story.industry}
            {story.size && <> | {story.size}</>}
          </p>
        </header>
        {story.path && (
          <p className="text-sm leading-relaxed text-soft">
            <span className={`${LABEL_HE} me-2`}>המסלול:</span>
            {story.path}
          </p>
        )}
        {story.before && (
          <div>
            <p className={LABEL_HE}>לפני</p>
            <p className="mt-2 text-sm leading-relaxed text-soft">{story.before}</p>
          </div>
        )}
        <div>
          <p className={LABEL}>Ctrl</p>
          <p className="mt-2 text-sm leading-relaxed text-soft">{story.ctrl}</p>
        </div>
        {story.tech && wide && <Tech text={story.tech} />}
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className={LABEL}>Shift</p>
          <dl className={`mt-3 grid gap-5 ${wide ? "sm:grid-cols-2" : ""}`}>
            {story.shift.map((m) => (
              <div key={m.label} className="flex flex-col-reverse gap-1">
                <dt className="text-sm leading-snug text-soft">
                  {m.label}
                  {m.note && <span className="block text-xs text-muted">{m.note}</span>}
                </dt>
                <dd dir="ltr" className="text-end font-display text-stat font-bold leading-display text-ink">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {story.tech && !wide && <Tech text={story.tech} />}
        {story.control && (
          <div className="border-t border-ink/10 pt-5 text-sm text-soft">
            <p>
              <span className={LABEL_HE}>ציון שליטה </span>
              לפני: <strong className="text-ink">{story.control.before}</strong> | אחרי: <strong className="text-ink">{story.control.after}</strong>
            </p>
            {story.control.dims && (
              <p className="mt-2">
                <span className={LABEL_HE}>הממדים שהשתנו הכי הרבה: </span>
                {story.control.dims}
              </p>
            )}
          </div>
        )}
        {!bare && <ArrowLink item={story.link} className="mt-auto" />}
      </div>
    </article>
  );
};

const Tech = ({ text }: { text: string }) => (
  <div>
    <p className={LABEL_HE}>תקציר טכני</p>
    <p className="mt-2 text-sm leading-relaxed text-soft">{text}</p>
  </div>
);
