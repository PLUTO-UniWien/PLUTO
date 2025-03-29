import strapiClient from "@/modules/strapi/client";
import WeightingOverviewComponent from "@/modules/weighting-overview/component";
import { fetchWeightingOverviewPage } from "@/modules/weighting-overview/service";

export default async function Page() {
  const weightingOverviewPage = await fetchWeightingOverviewPage(strapiClient);
  return <WeightingOverviewComponent weightingOverview={weightingOverviewPage} />;
}
