"use client";
import "survey-core/survey-core.css";
import { Model, Survey } from "survey-react-ui";
import { adaptStrapiSurveyToSurveyJsModelJSON } from "./adapter";
import withClientSideRendering from "@/modules/common/with-client-side-rendering";
import { attachListenersToSurveyModel } from "./listeners";
import type { StrapiSurvey } from "./types";

type SurveyComponentProps = {
  survey: StrapiSurvey;
};

function SurveyComponent({ survey }: SurveyComponentProps) {
  const surveyJson = adaptStrapiSurveyToSurveyJsModelJSON(survey);
  const model = new Model(surveyJson);
  attachListenersToSurveyModel(model, survey);

  return <Survey model={model} />;
}

export default withClientSideRendering(SurveyComponent);
