import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchWeightingOverviewPage(client: StrapiClient) {
  const weightingOverviewPage = client.single("weighting-overview-page");
  const weightingOverviewPageContent =
    (await weightingOverviewPage.find()) as unknown as APIResponseData<"api::weighting-overview-page.weighting-overview-page">;

  return weightingOverviewPageContent.data;
}
