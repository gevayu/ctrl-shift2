import type { Metadata } from "next";

import { HomeView, homeMetadata } from "@/views/home";

/** Next reads `metadata` from the route; the object lives with the view (ADR-0003). */
export const metadata: Metadata = homeMetadata;

export default function Home() {
  return <HomeView />;
}
