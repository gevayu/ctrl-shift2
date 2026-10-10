import type { Metadata } from "next";

import { ContactThanksView, thanksMetadata } from "@/views/contact";

export const metadata: Metadata = thanksMetadata;

export default function ContactThanksSmallPage() {
  return <ContactThanksView variant="b" />;
}
