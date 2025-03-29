import GlossaryComponent from "@/modules/glossary/component";
import { fetchGlossary } from "@/modules/glossary/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const glossary = await fetchGlossary(strapiClient);
  return <GlossaryComponent glossary={glossary} />;
}
