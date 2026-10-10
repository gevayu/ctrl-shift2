/**
 * A page section with its H2 (copy doc: every section opens with an H2).
 * `index` is the template's mono bracket tag, e.g. "[ 03 ]".
 */
export const Section = ({
  id,
  index,
  title,
  titleSize = "h2",
  tone = "plain",
  className = "",
  children,
}: {
  id?: string;
  index?: string;
  title?: React.ReactNode;
  /** `small`: the clients section's heading, smaller than the others. */
  titleSize?: "h2" | "small";
  /** `band`: a distinct background (the equation, closing sections). */
  tone?: "plain" | "band";
  className?: string;
  children: React.ReactNode;
}) => {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      className={`relative z-10 scroll-mt-20 border-t border-ink/5 px-6 py-20 md:px-10 md:py-28 ${tone === "band" ? "bg-ink/[0.03]" : "bg-page/60 backdrop-blur-3xl"} ${className}`}
    >
      {(index || title) && (
        <header className="mb-12 flex flex-col gap-4 md:mb-16">
          {index && <p className="font-mono text-tag tracking-[0.2em] text-muted">{index}</p>}
          {title && (
            <h2
              id={titleId}
              className={`max-w-4xl text-balance font-display font-extrabold leading-display text-ink ${titleSize === "small" ? "text-2xl md:text-3xl" : "text-h2"}`}
            >
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
};
