import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";
import { fetchSingleTypeSeo } from "@/modules/seo/service";

export async function fetchWeightingHistoryPage(client: StrapiClient) {
  const singleType = client.single("weighting-history-page");
  const response =
    (await singleType.find()) as unknown as APIResponseData<"api::weighting-history-page.weighting-history-page">;

  return response.data;
}

export async function fetchWeightingHistoryPageSeo(client: StrapiClient) {
  return fetchSingleTypeSeo(client, "weighting-history-page");
}
