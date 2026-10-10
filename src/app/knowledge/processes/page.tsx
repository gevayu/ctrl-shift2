import type { Metadata } from "next";

import { ProcessesView, processesMetadata } from "@/views/processes";

export const metadata: Metadata = processesMetadata;

export default function ProcessesPage() {
  return <ProcessesView />;
}
