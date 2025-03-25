import type { StrapiClient } from "@/modules/strapi/client";
import type { APIResponseData } from "@/modules/strapi/types";

export async function fetchSurvey(client: StrapiClient) {
  const survey = client.single("survey");
  const surveyContent = (await survey.find({
    populate: [
      "logo",
      "groups",
      "groups.questions",
      "groups.questions.choices",
      "groups.questions.metadata",
    ],
  })) as unknown as APIResponseData<"api::survey.survey">;

  return surveyContent.data;
}
