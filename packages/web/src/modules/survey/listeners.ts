import type { Model } from "survey-react-ui";
import type { StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissioToStrapiSubmission } from "@/modules/submission/adapter";
import { getIndexedSurvey } from "./adapter";
import { createSubmission } from "@/modules/submission/action";
import { trackStarted, trackSubmission } from "@/modules/umami/service";

type SurveyModelListenerContext = {
  strapiSurvey: StrapiSurvey;
};

export function attachListenersToSurveyModel(model: Model, context: SurveyModelListenerContext) {
  const { strapiSurvey } = context;
  const indexedSurvey = getIndexedSurvey(strapiSurvey);
  let firstPageVisited = false;

  model.onAfterRenderPage.add(async (survey) => {
    const isFirstPage = survey.currentPageNo === 0;
    if (isFirstPage && !firstPageVisited) {
      firstPageVisited = true;
      await trackStarted();
    }
  });

  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(survey.data, indexedSurvey);
    const result = await createSubmission(submission);
    const submissionId = result.id;
    await trackSubmission(submissionId);
  });
}
