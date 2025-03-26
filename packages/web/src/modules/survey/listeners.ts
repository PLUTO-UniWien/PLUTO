import type { Model } from "survey-react-ui";
import type { StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissioToStrapiSubmission } from "@/modules/submission/adapter";
import { getIndexedSurvey } from "./adapter";
import { createSubmission } from "../submission/action";

export function attachListenersToSurveyModel(model: Model, strapiSurvey: StrapiSurvey) {
  const indexedSurvey = getIndexedSurvey(strapiSurvey);

  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(survey.data, indexedSurvey);
    const result = await createSubmission(submission);
    const submissionId = result.id;
  });
}
