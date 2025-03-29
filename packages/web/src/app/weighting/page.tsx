import strapiClient from "@/modules/strapi/client";
import { fetchSurvey } from "@/modules/survey/service";
import WeightingOverviewComponent from "@/modules/weighting-overview/component";
import { fetchWeightingOverviewPage } from "@/modules/weighting-overview/service";

export default async function Page() {
  const weightingOverviewPage = await fetchWeightingOverviewPage(strapiClient);
  const survey = await fetchSurvey(strapiClient);
  return <WeightingOverviewComponent weightingOverview={weightingOverviewPage} survey={survey} />;
}
