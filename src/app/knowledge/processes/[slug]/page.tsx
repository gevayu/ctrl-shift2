import type { Metadata } from "next";

import { ProcessView, processMetadata, processParams } from "@/views/processes";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = processParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return processMetadata((await params).slug);
}

export default async function ProcessPage({ params }: Props) {
  return <ProcessView slug={(await params).slug} />;
}
