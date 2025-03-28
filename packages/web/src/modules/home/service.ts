import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchHomePage(client: StrapiClient) {
  const homePage = client.single("home-page");
  const homePageContent =
    (await homePage.find()) as unknown as APIResponseData<"api::home-page.home-page">;

  return homePageContent.data;
}
