import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";
import { fetchSingleTypeSeo } from "@/modules/seo/service";

export async function fetchGlossary(client: StrapiClient) {
  const singleType = client.single("glossary-page");
  const response = (await singleType.find({
    populate: ["items"],
  })) as unknown as APIResponseData<"api::glossary-page.glossary-page">;

  return response.data;
}

export async function fetchGlossarySeo(client: StrapiClient) {
  return fetchSingleTypeSeo(client, "glossary-page");
}
