import type { Metadata } from "next";

import { SupportView, supportMetadata } from "@/views/service-detail";

export const metadata: Metadata = supportMetadata;

export default function SupportPage() {
  return <SupportView />;
}
