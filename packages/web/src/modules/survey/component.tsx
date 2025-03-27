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

function SurveyComponent({ survey: strapiSurvey }: SurveyComponentProps) {
  // Transform the Strapi survey to a SurveyJS model
  const surveyJson = adaptStrapiSurveyToSurveyJsModelJSON(strapiSurvey);
  const model = new Model(surveyJson);

  // Attach listeners to the SurveyJS model to customize question rendering, survey submission handling, etc.
  attachListenersToSurveyModel(model, { strapiSurvey });

  return <Survey model={model} />;
}

export default withClientSideRendering(SurveyComponent);
