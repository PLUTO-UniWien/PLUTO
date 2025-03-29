import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchGlossary(client: StrapiClient) {
  const glossary = client.single("glossary-page");
  const glossaryContent = (await glossary.find({
    populate: ["items"],
  })) as unknown as APIResponseData<"api::glossary-page.glossary-page">;

  return glossaryContent.data;
}
