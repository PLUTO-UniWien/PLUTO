import strapiClient from "@/modules/strapi/client";
import WeightingHistoryComponent from "@/modules/weighting-history/component";
import {
  fetchWeightingHistoryPage,
  fetchWeightingHistoryPageSeo,
} from "@/modules/weighting-history/service";
import { createSingleTypeGenerateMetadataCallback } from "@/modules/seo/service";

export const generateMetadata = createSingleTypeGenerateMetadataCallback(
  strapiClient,
  fetchWeightingHistoryPageSeo,
);

export default async function Page() {
  const weightingHistoryPage = await fetchWeightingHistoryPage(strapiClient);
  return <WeightingHistoryComponent weightingHistory={weightingHistoryPage} />;
}
