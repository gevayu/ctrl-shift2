/** A client quote: the words, then who said it. */
export const Quote = ({ text, person, role }: { text: string; person: string; role: string }) => (
  <figure className="flex h-full flex-col gap-5 rounded-md border border-ink/10 bg-page/40 p-6 md:p-8">
    <blockquote className="flex-1 text-base leading-relaxed text-ink">
      <p>&quot;{text}&quot;</p>
    </blockquote>
    <figcaption className="text-sm">
      <span className="block font-bold text-ink">{person}</span>
      <span className="text-muted">{role}</span>
    </figcaption>
  </figure>
);
