import { PostPreviewList } from "@/modules/posts/component";
import { fetchPostPreviews } from "@/modules/posts/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const postPreviews = await fetchPostPreviews(strapiClient);
  return (
    <div>
      <h1>News</h1>
      <PostPreviewList postPreviews={postPreviews} />
    </div>
  );
}
