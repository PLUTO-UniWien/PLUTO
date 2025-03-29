import { PostPreviewList } from "@/modules/posts/component";
import { fetchPostPreviews } from "@/modules/posts/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const postPreviews = await fetchPostPreviews(strapiClient);
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
          News
        </h1>
      </div>
      <PostPreviewList postPreviews={postPreviews} />
    </div>
  );
}
