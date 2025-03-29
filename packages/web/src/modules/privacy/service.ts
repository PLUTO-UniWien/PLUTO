import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchPrivacyPage(client: StrapiClient) {
  const privacyPage = client.single("privacy-page");
  const privacyPageContent =
    (await privacyPage.find()) as unknown as APIResponseData<"api::privacy-page.privacy-page">;

  return privacyPageContent.data;
}
