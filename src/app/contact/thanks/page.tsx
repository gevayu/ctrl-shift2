import type { Metadata } from "next";

import { ContactThanksView, thanksMetadata } from "@/views/contact";

export const metadata: Metadata = thanksMetadata;

export default function ContactThanksPage() {
  return <ContactThanksView variant="a" />;
}
