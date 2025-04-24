import { PostComponent } from "@/modules/posts/component";
import { fetchPostBySlug, fetchPostPreviews, fetchPostSeoBySlug } from "@/modules/posts/service";
import { adaptStrapiSeoToNextMetadata } from "@/modules/seo/adapter";
import strapiClient from "@/modules/strapi/client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = await fetchPostSeoBySlug(strapiClient, slug);
  if (!seo) return {};
  return adaptStrapiSeoToNextMetadata(seo);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(strapiClient, slug);
  return <PostComponent post={post} />;
}

export async function generateStaticParams() {
  const postPreviews = await fetchPostPreviews(strapiClient);
  return postPreviews.map(({ slug }) => ({ slug }));
}
