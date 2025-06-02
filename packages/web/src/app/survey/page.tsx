import SurveyComponent from "@/modules/survey/component";
import { fetchSurvey } from "@/modules/survey/service";
import strapiClient from "@/modules/strapi/client";
import { fetchGlossary } from "@/modules/glossary/service";
import { createMetadataWithCanonical } from "@/modules/seo/utils";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return createMetadataWithCanonical("/survey", {
    title: "Survey - PLUTO",
    description:
      "Take our assessment survey to evaluate the benefits and risks of data use instances.",
  });
}

export default async function Page() {
  const survey = await fetchSurvey(strapiClient);
  const glossary = await fetchGlossary(strapiClient);

  return (
    <div className="h-full">
      <SurveyComponent survey={survey} glossaryItems={glossary?.items ?? []} />
    </div>
  );
}
