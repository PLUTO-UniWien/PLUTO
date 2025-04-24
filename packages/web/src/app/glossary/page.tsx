import GlossaryComponent from "@/modules/glossary/component";
import { fetchGlossary, fetchGlossarySeo } from "@/modules/glossary/service";
import strapiClient from "@/modules/strapi/client";
import { createSingleTypeGenerateMetadataCallback } from "@/modules/seo/service";

export const generateMetadata = createSingleTypeGenerateMetadataCallback(
  strapiClient,
  fetchGlossarySeo,
);

export default async function Page() {
  const glossary = await fetchGlossary(strapiClient);
  return <GlossaryComponent glossary={glossary} />;
}
