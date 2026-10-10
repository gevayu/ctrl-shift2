import type { Metadata } from "next";

import { ImplementationView, implementationMetadata } from "@/views/service-detail";

export const metadata: Metadata = implementationMetadata;

export default function ImplementationPage() {
  return <ImplementationView />;
}
