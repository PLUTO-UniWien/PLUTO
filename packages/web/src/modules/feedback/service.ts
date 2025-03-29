import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";
import { fetchSingleTypeSeo } from "@/modules/seo/service";

export async function fetchFeedbackPage(client: StrapiClient) {
  const singleType = client.single("feedback-page");
  const response =
    (await singleType.find()) as unknown as APIResponseData<"api::feedback-page.feedback-page">;

  return response.data;
}

export async function fetchFeedbackPageSeo(client: StrapiClient) {
  return fetchSingleTypeSeo(client, "feedback-page");
}
