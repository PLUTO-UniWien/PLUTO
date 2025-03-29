"use client";
import "survey-core/survey-core.css";
import "./styles.css";
import { Model, Survey } from "survey-react-ui";
import { adaptStrapiSurveyToSurveyJsModelJSON } from "./adapter";
import withClientSideRendering from "@/modules/common/with-client-side-rendering";
import { attachListenersToSurveyModel } from "./listeners";
import type { StrapiSurvey } from "./types";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "./store";
import LoadingComponent from "@/modules/loading/component";

type SurveyComponentProps = {
  survey: StrapiSurvey;
};

function SurveyComponent({ survey: strapiSurvey }: SurveyComponentProps) {
  const router = useRouter();

  // Transform the Strapi survey to a SurveyJS model
  const surveyJson = adaptStrapiSurveyToSurveyJsModelJSON(strapiSurvey);
  const model = new Model(surveyJson);

  // Store the survey in the store
  useSurveyStore.getState().setSurvey(strapiSurvey);

  // Attach listeners to the SurveyJS model to customize question rendering, survey submission handling, etc.
  attachListenersToSurveyModel(model, { strapiSurvey, router });

  return <Survey model={model} />;
}

export default withClientSideRendering(SurveyComponent, LoadingComponent);
