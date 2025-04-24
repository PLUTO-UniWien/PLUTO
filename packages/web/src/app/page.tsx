import HomeComponent from "@/modules/home/component";
import { fetchHomePage, fetchHomePageSeo } from "@/modules/home/service";
import strapiClient from "@/modules/strapi/client";
import { createSingleTypeGenerateMetadataCallback } from "@/modules/seo/service";

export const generateMetadata = createSingleTypeGenerateMetadataCallback(
  strapiClient,
  fetchHomePageSeo,
);

export default async function Page() {
  const homePage = await fetchHomePage(strapiClient);

  return <HomeComponent homePage={homePage} />;
}
