import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";
import { fetchSingleTypeSeo } from "@/modules/seo/service";

export async function fetchWeightingOverviewPage(client: StrapiClient) {
  const singleType = client.single("weighting-overview-page");
  const response =
    (await singleType.find()) as unknown as APIResponseData<"api::weighting-overview-page.weighting-overview-page">;

  return response.data;
}

export async function fetchWeightingOverviewPageSeo(client: StrapiClient) {
  return fetchSingleTypeSeo(client, "weighting-overview-page");
}
