import strapiClient from "@/modules/strapi/client";
import ImprintComponent from "@/modules/imprint/component";
import { fetchImprintPage } from "@/modules/imprint/service";

export default async function Page() {
  const imprintPage = await fetchImprintPage(strapiClient);
  return <ImprintComponent imprint={imprintPage} />;
}
