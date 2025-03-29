import { PostComponent } from "@/modules/posts/component";
import { fetchPostBySlug, fetchPostPreviews } from "@/modules/posts/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(strapiClient, slug);
  return <PostComponent post={post} />;
}

export async function generateStaticParams() {
  const postPreviews = await fetchPostPreviews(strapiClient);
  return postPreviews.map(({ slug }) => ({ slug }));
}
