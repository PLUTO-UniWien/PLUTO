import strapiClient from "@/modules/strapi/client";
import { fetchSurvey } from "@/modules/survey/service";
import WeightingOverviewComponent from "@/modules/weighting-overview/component";
import {
  fetchWeightingOverviewPage,
  fetchWeightingOverviewPageSeo,
} from "@/modules/weighting-overview/service";
import { createSingleTypeGenerateMetadataCallback } from "@/modules/seo/service";

export const generateMetadata = createSingleTypeGenerateMetadataCallback(
  strapiClient,
  fetchWeightingOverviewPageSeo,
);

export default async function Page() {
  const weightingOverviewPage = await fetchWeightingOverviewPage(strapiClient);
  const survey = await fetchSurvey(strapiClient);
  return <WeightingOverviewComponent weightingOverview={weightingOverviewPage} survey={survey} />;
}
