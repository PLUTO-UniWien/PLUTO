import SurveyComponent from "@/modules/survey/component";
import { fetchSurvey } from "@/modules/survey/service";
import strapiClient from "@/modules/strapi/client";
import { fetchGlossary } from "@/modules/glossary/service";

export default async function Page() {
  const survey = await fetchSurvey(strapiClient);
  const glossary = await fetchGlossary(strapiClient);

  return (
    <div className="h-full">
      <SurveyComponent survey={survey} glossaryItems={glossary?.items ?? []} />
    </div>
  );
}
