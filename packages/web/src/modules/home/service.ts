import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";
import { fetchSingleTypeSeo } from "@/modules/seo/service";

export async function fetchHomePage(client: StrapiClient) {
  const singleType = client.single("home-page");
  const response =
    (await singleType.find()) as unknown as APIResponseData<"api::home-page.home-page">;

  return response.data;
}

export async function fetchHomePageSeo(client: StrapiClient) {
  return fetchSingleTypeSeo(client, "home-page");
}
