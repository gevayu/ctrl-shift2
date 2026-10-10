import type { Metadata } from "next";

import { ArticleView, articleMetadata, articleParams } from "@/views/blog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return articleMetadata((await params).slug);
}

export default async function ArticlePage({ params }: Props) {
  return <ArticleView slug={(await params).slug} />;
}
