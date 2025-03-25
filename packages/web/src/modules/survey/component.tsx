"use client";
import "survey-core/survey-core.css";
import { Model, Survey } from "survey-react-ui";
import type { StrapiType } from "@/modules/strapi/types";
import { generateSurveyJsModelJSON } from "./adapter";
import withClientSideRendering from "@/modules/common/with-client-side-rendering";

type SurveyComponentProps = {
  survey: StrapiType<"api::survey.survey">;
};

function SurveyComponent({ survey }: SurveyComponentProps) {
  const surveyJson = generateSurveyJsModelJSON(survey);
  const model = new Model(surveyJson);

  return <Survey model={model} />;
}

export default withClientSideRendering(SurveyComponent);
