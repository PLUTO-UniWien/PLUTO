import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchFeedbackPage(client: StrapiClient) {
  const feedbackPage = client.single("feedback-page");
  const feedbackPageContent =
    (await feedbackPage.find()) as unknown as APIResponseData<"api::feedback-page.feedback-page">;

  return feedbackPageContent.data;
}
