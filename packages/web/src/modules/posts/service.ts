import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseCollection } from "@/modules/strapi/types";
import type { StrapiPost, StrapiPostPreview } from "./types";
import type { StrapiSeo } from "@/modules/seo/types";

export async function fetchPostPreviews(client: StrapiClient) {
  const posts = client.collection("posts");
  const slugs = (await posts.find({
    fields: ["createdAt", "title", "slug"],
  })) as unknown as APIResponseCollection<"api::post.post">;

  return slugs.data.map(
    ({ createdAt, title, slug }) => ({ createdAt, title, slug }) as StrapiPostPreview,
  );
}

export async function fetchPostBySlug(client: StrapiClient, slug: string) {
  const posts = client.collection("posts");
  const matchingPosts = (await posts.find({
    filters: { slug: { eq: slug } },
  })) as unknown as APIResponseCollection<"api::post.post">;
  if (matchingPosts.data.length === 0) {
    throw new Error(`No post found with slug: ${slug}`);
  }
  return matchingPosts.data[0] as StrapiPost;
}

export async function fetchPostSeoBySlug(client: StrapiClient, slug: string) {
  const posts = client.collection("posts");
  const matchingPosts = (await posts.find({
    filters: { slug: { eq: slug } },
    populate: ["seo", "seo.metaImage", "seo.openGraph", "seo.openGraph.ogImage"],
  })) as unknown as APIResponseCollection<"api::post.post">;
  if (matchingPosts.data.length === 0) {
    throw new Error(`No post found with slug: ${slug}`);
  }
  return matchingPosts.data[0].seo as StrapiSeo | undefined;
}
