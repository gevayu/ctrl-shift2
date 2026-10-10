// Server-only: reads the filesystem at build time.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Faq } from "@/components/site/faq-list";
import { articles } from "@/data/blog";
import { articlePath } from "@/lib/routes";

/**
 * Article bodies are Markdown files in `src/content/blog/`, kept to a tiny
 * subset so the client's text stays readable and diffable:
 *   "## " heading (H2) · "- " list item · "> " pull line · "Q: "/"A: " FAQ
 *   pair (after the FAQ heading) · any other line is a paragraph.
 * ponytail: a hand parser for five line types; switch to a Markdown library
 * if articles ever need links, bold or images inline.
 */
export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] };

export interface ParsedArticle {
  /** The opening paragraph: the answer shown in the blog list. */
  answer: string;
  blocks: ArticleBlock[];
  faqTitle?: string;
  faq: Faq[];
}

const DIR = join(process.cwd(), "src/content/blog");

export function loadArticle(slug: string): ParsedArticle {
  const lines = readFileSync(join(DIR, `${slug}.md`), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks: ArticleBlock[] = [];
  const faq: Faq[] = [];
  let faqTitle: string | undefined;

  for (const line of lines) {
    if (line.startsWith("Q: ")) {
      faq.push({ id: `${slug}-q${faq.length + 1}`, q: line.slice(3), a: "" });
    } else if (line.startsWith("A: ")) {
      const last = faq[faq.length - 1];
      if (!last) throw new Error(`${slug}.md: "A:" with no "Q:" before it`);
      last.a = line.slice(3);
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      // The FAQ heading starts the question block; it is rendered with the FAQ, not inline.
      if (text.startsWith("שאלות נפוצות")) faqTitle = text;
      else blocks.push({ type: "h2", text });
    } else if (line.startsWith("- ")) {
      const prev = blocks[blocks.length - 1];
      if (prev?.type === "ul") prev.items.push(line.slice(2));
      else blocks.push({ type: "ul", items: [line.slice(2)] });
    } else if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.slice(2) });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }

  const first = blocks.find((b) => b.type === "p");
  return { answer: first?.type === "p" ? first.text : "", blocks, faqTitle, faq };
}

/** The newest articles with their answer paragraph — the blog list and the home page's three. */
export const latestArticles = (count = articles.length) =>
  articles.slice(0, count).map((a) => ({ ...a, href: articlePath(a.slug), answer: loadArticle(a.slug).answer }));
