import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchResultPage(client: StrapiClient) {
  const resultPage = client.single("result-page");
  const resultPageContent =
    (await resultPage.find()) as unknown as APIResponseData<"api::result-page.result-page">;

  return resultPageContent.data;
}
