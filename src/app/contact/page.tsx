import type { Metadata } from "next";

import { ContactView, contactMetadata } from "@/views/contact";

export const metadata: Metadata = contactMetadata;

export default function ContactPage() {
  return <ContactView />;
}
