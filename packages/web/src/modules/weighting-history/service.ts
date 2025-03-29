import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchWeightingHistoryPage(client: StrapiClient) {
  const weightingHistoryPage = client.single("weighting-history-page");
  const weightingHistoryPageContent =
    (await weightingHistoryPage.find()) as unknown as APIResponseData<"api::weighting-history-page.weighting-history-page">;

  return weightingHistoryPageContent.data;
}
