import type { Metadata } from "next";

import { ServicesView, servicesMetadata } from "@/views/services";

export const metadata: Metadata = servicesMetadata;

export default function ServicesPage() {
  return <ServicesView />;
}
