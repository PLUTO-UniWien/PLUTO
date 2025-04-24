import ResultComponent from "@/modules/result/component";
import { fetchResultPage } from "@/modules/result/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const resultPage = await fetchResultPage(strapiClient);
  return <ResultComponent resultPage={resultPage} />;
}
