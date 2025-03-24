import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseCollection } from "@/modules/strapi/types";

export async function fetchSurvey(client: StrapiClient) {
  const survey = client.single("survey");
  const surveyContent = (await survey.find({
    populate: [
      "groups",
      "groups.questions",
      "groups.questions.choices",
      "groups.questions.metadata",
    ],
  })) as unknown as APIResponseCollection<"api::survey.survey">;

  return surveyContent.data[0];
}
