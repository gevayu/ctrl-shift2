import type { Metadata } from "next";

import { StoryView, storyMetadata, storyParams } from "@/views/stories";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = storyParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return storyMetadata((await params).slug);
}

export default async function StoryPage({ params }: Props) {
  return <StoryView slug={(await params).slug} />;
}
