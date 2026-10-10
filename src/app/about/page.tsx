import type { Metadata } from "next";

import { AboutView, aboutMetadata } from "@/views/about";

export const metadata: Metadata = aboutMetadata;

export default function AboutPage() {
  return <AboutView />;
}
