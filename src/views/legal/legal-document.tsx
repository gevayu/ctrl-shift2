/**
 * The shared shape of a legal page.
 *
 * A Server Component with no motion: these pages are read, not experienced, and
 * every spring here would be hydration cost spent on a document nobody scrolls
 * for pleasure. Plain semantic markup, one `<h1>`, a clean heading outline.
 */
import Link from "next/link";

export interface LegalSection {
  heading: string;
  /** Each entry is a paragraph. */
  body: readonly string[];
}

export interface LegalDocumentProps {
  title: string;
  /** Shown under the title, e.g. "Last updated 1 October 2026". */
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
}

export const LegalDocument = ({
  title,
  updated,
  intro,
  sections,
}: LegalDocumentProps) => (
  // ponytail: the policy text is still the template's English boilerplate, so the
  // page is marked English/LTR until the client's Hebrew policy replaces it.
  <div lang="en" dir="ltr" className="min-h-lvh w-full bg-page font-sans text-ink">
    <header className="mx-auto w-full max-w-[48rem] px-4 pb-8 pt-24 md:px-6 md:pt-28 xl:px-8">
      <Link href="/" className="underline underline-offset-4 transition-opacity duration-[var(--duration-fast)] hover:opacity-70 focus-visible:opacity-70">
        ← Ctrl+Shift
      </Link>
      <h1 className="mt-6 font-display text-legal-title leading-display">{title}</h1>
      <p className="mt-3 opacity-80">{updated}</p>
      <p className="mt-6">{intro}</p>
    </header>

    <main className="mx-auto w-full max-w-[48rem] px-4 pb-24 md:px-6 xl:px-8">
      {sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-legal-heading leading-display">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-3">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </main>
  </div>
);
