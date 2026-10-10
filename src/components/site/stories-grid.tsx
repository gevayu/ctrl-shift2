"use client";

import { useMemo, useState } from "react";

import { PROBLEMS, RESULTS, SIZES, storiesIndex } from "@/data/stories";

import { StoryCard, type Story } from "./story-card";

export interface GridStory {
  card: Story;
  industry: string;
  size: string;
  problems: readonly string[];
  results: readonly string[];
}

const f = storiesIndex.filters;
const SELECT = "w-full rounded-sm border border-ink/20 bg-page/60 px-4 py-3 text-sm text-ink focus:border-ink/60 focus:outline-none";

/**
 * The story grid with its four dropdown filters in one row (industry, size,
 * problem, result). Three cards a row on desktop, one on phones.
 */
export const StoriesGrid = ({ items }: { items: readonly GridStory[] }) => {
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState("");
  const industries = useMemo(() => [...new Set(items.map((s) => s.industry))], [items]);

  const shown = items.filter(
    (s) =>
      (!industry || s.industry === industry) &&
      (!size || s.size === size) &&
      (!problem || s.problems.includes(problem)) &&
      (!result || s.results.includes(result)),
  );

  return (
    <>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Filter id="f-industry" label={f.industry} value={industry} onChange={setIndustry} options={industries} />
        <Filter id="f-size" label={f.size} value={size} onChange={setSize} options={SIZES} />
        <Filter id="f-problem" label={f.problem} value={problem} onChange={setProblem} options={PROBLEMS} />
        <Filter id="f-result" label={f.result} value={result} onChange={setResult} options={RESULTS} />
      </div>
      <p aria-live="polite" className="sr-only">
        {shown.length}
      </p>
      {shown.length ? (
        <ul className="grid gap-6 lg:grid-cols-3">
          {shown.map((s) => (
            <li key={s.card.name}>
              <StoryCard story={s.card} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-soft">{f.empty}</p>
      )}
    </>
  );
};

const Filter = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-xs font-medium text-muted">
      {label}
    </label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={SELECT}>
      <option value="">{f.all}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
