import type { Metadata } from "next";

import { BlogView, blogMetadata } from "@/views/blog";

export const metadata: Metadata = blogMetadata;

export default function BlogPage() {
  return <BlogView />;
}
