import type { Model } from "survey-react-ui";
import type { StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissioToStrapiSubmission } from "@/modules/submission/adapter";
import { getIndexedSurvey } from "./adapter";
import { createSubmission } from "@/modules/submission/action";
import { trackSubmission } from "@/modules/umami/service";

export function attachListenersToSurveyModel(model: Model, strapiSurvey: StrapiSurvey) {
  const indexedSurvey = getIndexedSurvey(strapiSurvey);

  model.onValueChanged.add((survey, options) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(survey.data, indexedSurvey);
    console.log(submission);
  });

  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(survey.data, indexedSurvey);
    const result = await createSubmission(submission);
    const submissionId = result.id;
    await trackSubmission(submissionId);
  });
}
