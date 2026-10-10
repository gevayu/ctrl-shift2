"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { contactContent, EMPLOYEES, ROLES, SMALL_COMPANY } from "@/data/contact";
import { apiFetch } from "@/lib/api-client";
import { routes } from "@/lib/routes";

import { SmartLink } from "./smart-link";

const f = contactContent.form;

const FIELD = "w-full rounded-sm border border-ink/20 bg-page/60 px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink/60 focus:outline-none";
const LABEL = "mb-2 block text-sm font-medium text-soft";

/**
 * The contact form. Native validation (required, type=email/tel) catches the
 * obvious before sending; the route re-validates with the shared schema.
 * "עד 9" employees still sends, then lands on thank-you version B.
 */
export const ContactForm = () => {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      await apiFetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
      router.push(data.employees === SMALL_COMPANY ? routes.contactThanksSmall : routes.contactThanks);
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label={f.fields.name} autoComplete="name" />
        <Field name="company" label={f.fields.company} autoComplete="organization" />
        <Select name="role" label={f.fields.role} options={ROLES} />
        <Select name="employees" label={f.fields.employees} options={EMPLOYEES} />
        <Field name="phone" label={f.fields.phone} type="tel" autoComplete="tel" dir="ltr" />
        <Field name="email" label={f.fields.email} type="email" autoComplete="email" dir="ltr" />
      </div>
      <div>
        <label htmlFor="pain" className={LABEL}>
          {f.fields.pain}
        </label>
        <textarea id="pain" name="pain" rows={4} placeholder={f.painPlaceholder} maxLength={2000} className={FIELD} />
      </div>
      {/* Honeypot: off-screen and out of the tab order; people never fill it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center self-start rounded-sm bg-ink px-8 py-4 text-base font-medium text-page transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        {state === "sending" ? f.sending : f.submit}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-soft">
        {state === "error" ? f.error : f.after}
      </p>
      <p className="text-xs text-muted">
        {f.privacy} <SmartLink item={f.privacyLink} className="underline underline-offset-2 hover:text-ink" />
      </p>
    </form>
  );
};

const Field = ({ name, label, type = "text", autoComplete, dir }: { name: string; label: string; type?: string; autoComplete?: string; dir?: "ltr" }) => (
  <div>
    <label htmlFor={name} className={LABEL}>
      {label}
    </label>
    <input id={name} name={name} type={type} required autoComplete={autoComplete} dir={dir} className={`${FIELD} ${dir ? "text-end" : ""}`} />
  </div>
);

const Select = ({ name, label, options }: { name: string; label: string; options: readonly string[] }) => (
  <div>
    <label htmlFor={name} className={LABEL}>
      {label}
    </label>
    <select id={name} name={name} required defaultValue="" className={FIELD}>
      <option value="" disabled>
        {f.choose}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
