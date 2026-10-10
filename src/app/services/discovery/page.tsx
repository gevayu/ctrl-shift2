import type { Metadata } from "next";

import { DiscoveryView, discoveryMetadata } from "@/views/service-detail";

export const metadata: Metadata = discoveryMetadata;

export default function DiscoveryPage() {
  return <DiscoveryView />;
}
