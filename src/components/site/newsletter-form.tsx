"use client";

import { useState } from "react";

import { blogContent } from "@/data/blog";
import { apiFetch } from "@/lib/api-client";

import { SmartLink } from "./smart-link";

const n = blogContent.newsletter;

/** The blog's newsletter sign-up: one email field, posted to `/api/newsletter`. */
export const NewsletterForm = () => {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      await apiFetch("/api/newsletter", { method: "POST", body: JSON.stringify(data) });
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          {n.field}
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          placeholder={n.field}
          className="flex-1 rounded-sm border border-ink/20 bg-page/60 px-4 py-3 text-end text-ink placeholder:text-muted focus:border-ink/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending" || state === "done"}
          className="rounded-sm bg-ink px-6 py-3 font-medium text-page transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-soft disabled:opacity-60"
        >
          {n.submit}
        </button>
      </div>
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p role="status" aria-live="polite" className="text-sm text-soft">
        {state === "done" ? n.done : state === "error" ? n.error : ""}
      </p>
      <p className="text-xs text-muted">
        {n.note} <SmartLink item={n.privacy} className="underline underline-offset-2 hover:text-ink" />
      </p>
    </form>
  );
};
