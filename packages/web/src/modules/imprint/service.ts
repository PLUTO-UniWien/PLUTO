import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchImprintPage(client: StrapiClient) {
  const imprintPage = client.single("imprint-page");
  const imprintPageContent =
    (await imprintPage.find()) as unknown as APIResponseData<"api::imprint-page.imprint-page">;

  return imprintPageContent.data;
}
