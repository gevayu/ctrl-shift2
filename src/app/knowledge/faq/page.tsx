import type { Metadata } from "next";

import { FaqView, faqMetadata } from "@/views/faq";

export const metadata: Metadata = faqMetadata;

export default function FaqPage() {
  return <FaqView />;
}
