import SurveyComponent from "@/modules/survey/component";
import { fetchSurvey } from "@/modules/survey/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const survey = await fetchSurvey(strapiClient);

  return (
    <div className="h-full">
      <SurveyComponent survey={survey} />
    </div>
  );
}
