import strapiClient from "@/modules/strapi/client";
import FeedbackComponent from "@/modules/feedback/component";
import { fetchFeedbackPage, fetchFeedbackPageSeo } from "@/modules/feedback/service";
import { createSingleTypeGenerateMetadataCallback } from "@/modules/seo/service";

export const generateMetadata = createSingleTypeGenerateMetadataCallback(
  strapiClient,
  fetchFeedbackPageSeo,
);

export default async function Page() {
  const feedbackPage = await fetchFeedbackPage(strapiClient);
  return <FeedbackComponent feedback={feedbackPage} />;
}
