import strapiClient from "@/modules/strapi/client";
import FeedbackComponent from "@/modules/feedback/component";
import { fetchFeedbackPage } from "@/modules/feedback/service";

export default async function Page() {
  const feedbackPage = await fetchFeedbackPage(strapiClient);
  return <FeedbackComponent feedback={feedbackPage} />;
}
