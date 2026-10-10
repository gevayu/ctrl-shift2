import type { MetadataRoute } from "next";

import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

/**
 * Generates `/sitemap.xml` — one entry per public route.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "monthly" | "yearly" = "monthly") => ({
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
    entry(routes.faq, 0.7),
    entry(routes.privacy, 0.2, "yearly"),
  ];
}
