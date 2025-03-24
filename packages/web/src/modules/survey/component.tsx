"use client";
import "survey-core/survey-core.css";
import { Model, Survey } from "survey-react-ui";
import type { StrapiType } from "@/modules/strapi/types";

const surveyJson = {
  elements: [
    {
      name: "FirstName",
      title: "Enter your first name:",
      type: "text",
    },
    {
      name: "LastName",
      title: "Enter your last name:",
      type: "text",
    },
  ],
};

type SurveyComponentProps = {
  survey: StrapiType<"api::survey.survey">;
};

export default function SurveyComponent({ survey }: SurveyComponentProps) {
  console.log(survey);
  const model = new Model(surveyJson);

  return <Survey model={model} />;
}
