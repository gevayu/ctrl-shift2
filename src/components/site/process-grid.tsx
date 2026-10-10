"use client";

import Link from "next/link";
import { useState } from "react";

import { DEPARTMENTS, processesIndex, STAIRS } from "@/data/processes";

export interface ProcessCard {
  href: string;
  name: string;
  problem: string;
  saving: string;
  stairLabel: string;
  stairs: readonly string[];
  department: string;
}

const f = processesIndex.filters;

/**
 * The process cards with two filter rows (department, stair) as toggle
 * buttons. Each card: name, the problem in a sentence, the saving, the stair.
 */
export const ProcessGrid = ({ items }: { items: readonly ProcessCard[] }) => {
  const [department, setDepartment] = useState("");
  const [stair, setStair] = useState("");
  const shown = items.filter((p) => (!department || p.department === department) && (!stair || p.stairs.includes(stair)));
  return (
    <>
      <div className="mb-10 flex flex-col gap-4">
        <Chips label={f.department} options={DEPARTMENTS} value={department} onChange={setDepartment} />
        <Chips label={f.stair} options={STAIRS} value={stair} onChange={setStair} />
      </div>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group flex h-full flex-col gap-4 rounded-md border border-ink/10 bg-page/40 p-6 transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-ink/40 md:p-8"
            >
              <span className="self-start rounded-sm border border-ink/20 px-2 py-1 text-xs text-soft">{p.stairLabel}</span>
              <h3 className="font-display text-xl font-bold text-ink">{p.name}</h3>
              <p className="text-sm leading-relaxed text-soft">{p.problem}</p>
              <p className="mt-auto border-t border-ink/10 pt-4 text-sm font-medium text-ink">{p.saving}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const Chips = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
    <span className="me-2 text-xs font-medium text-muted">{label}:</span>
    {["", ...options].map((o) => (
      <button
        key={o || "all"}
        type="button"
        aria-pressed={value === o}
        onClick={() => onChange(o)}
        className={`rounded-sm border px-3 py-1.5 text-sm transition-colors duration-[var(--duration-fast)] ease-entrance ${value === o ? "border-ink bg-ink text-page" : "border-ink/20 text-soft hover:border-ink/50"}`}
      >
        {o || f.all}
      </button>
    ))}
  </div>
);
