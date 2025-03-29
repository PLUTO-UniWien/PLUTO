import strapiClient from "@/modules/strapi/client";
import WeightingHistoryComponent from "@/modules/weighting-history/component";
import { fetchWeightingHistoryPage } from "@/modules/weighting-history/service";

export default async function Page() {
  const weightingHistoryPage = await fetchWeightingHistoryPage(strapiClient);
  return <WeightingHistoryComponent weightingHistory={weightingHistoryPage} />;
}
