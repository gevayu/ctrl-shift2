import type { Metadata } from "next";

import { StoriesView, storiesMetadata } from "@/views/stories";

export const metadata: Metadata = storiesMetadata;

export default function StoriesPage() {
  return <StoriesView />;
}
