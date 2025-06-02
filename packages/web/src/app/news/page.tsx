import { PostPreviewList } from "@/modules/posts/component";
import { fetchPostPreviews } from "@/modules/posts/service";
import strapiClient from "@/modules/strapi/client";
import { createMetadataWithCanonical } from "@/modules/seo/utils";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return createMetadataWithCanonical("/news", {
    title: "News - PLUTO",
    description: "Latest news and updates from the PLUTO public value assessment tool project.",
  });
}

export default async function Page() {
  const postPreviews = await fetchPostPreviews(strapiClient);
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-10">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
          News
        </h1>
      </div>
      <PostPreviewList postPreviews={postPreviews} />
    </div>
  );
}
