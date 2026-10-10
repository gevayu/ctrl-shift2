import type { MetadataRoute } from "next";

import { articles } from "@/data/blog";
import { processes } from "@/data/processes";
import { stories } from "@/data/stories";
import { articlePath, processPath, routes, storyPath } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

/**
 * Generates `/sitemap.xml` — one entry per public route. Stories without the
 * client's written approval are left out (they are noindex too); thank-you
 * pages are never listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });
  return [
    entry(routes.home, 1),
    entry(routes.services, 0.9),
    entry(routes.discovery, 0.8),
    entry(routes.implementation, 0.8),
    entry(routes.support, 0.8),
    entry(routes.stories, 0.8),
    ...stories.filter((s) => s.approved).map((s) => entry(storyPath(s.slug), 0.7)),
    entry(routes.blog, 0.7, "weekly"),
    ...articles.map((a) => entry(articlePath(a.slug), 0.6)),
    entry(routes.processes, 0.7),
    ...processes.map((p) => entry(processPath(p.slug), 0.6)),
    entry(routes.faq, 0.7),
    entry(routes.contact, 0.6),
    entry(routes.privacy, 0.2, "yearly"),
  ];
}
