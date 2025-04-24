/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Model } from "survey-react-ui";
import type { IndexedStrapiSurvey, QuestionLabel, StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissioToStrapiSubmission } from "@/modules/submission/adapter";
import { getIndexedSurvey } from "./adapter";
import { createSubmission } from "@/modules/submission/action";
import {
  trackSurveyStarted,
  trackSubmission,
  trackQuestionExplanationViewed,
  trackSurveyPreviewOpened,
  trackQuestionVisited,
} from "@/modules/umami/service";
import { QuestionExplanationComponent } from "@/modules/question-explanation/component";
import { mountReactComponent } from "@/modules/common/dom-utils";
import { useSubmissionStore } from "@/modules/submission/store";
import type { useRouter } from "next/navigation";

type SurveyModelListenerContext = {
  strapiSurvey: StrapiSurvey;
  router: ReturnType<typeof useRouter>;
};

export function attachListenersToSurveyModel(model: Model, context: SurveyModelListenerContext) {
  const { strapiSurvey, router } = context;
  const indexedSurvey = getIndexedSurvey(strapiSurvey);
  const questionTimeSpent = new Map<QuestionLabel, number>();
  const listenerContext: ListenerContext = { indexedSurvey, questionTimeSpent, router };
  const listeners = [
    trackQuestionTimeSpent,
    trackSurveyStartEvent,
    performAndTrackSurveySubmission,
    addExplanationComponentToQuestionHeader,
    moveNoneOptionToEnd,
    trackSurveyPreviewShown,
    trackQuestionVisit,
  ];

  for (const listener of listeners) {
    listener(model, listenerContext);
  }
}

type ListenerContext = {
  indexedSurvey: IndexedStrapiSurvey;
  questionTimeSpent: Map<QuestionLabel, number>;
  router: ReturnType<typeof useRouter>;
};

function trackSurveyStartEvent(model: Model, _: ListenerContext) {
  let firstPageVisited = false;
  model.onAfterRenderPage.add(async (survey) => {
    const isFirstPage = survey.currentPageNo === 0;
    if (isFirstPage && !firstPageVisited) {
      firstPageVisited = true;
      await trackSurveyStarted();
    }
  });
}

function performAndTrackSurveySubmission(model: Model, context: ListenerContext) {
  // Persist submission results and track it in analytics
  const { indexedSurvey, questionTimeSpent, router } = context;
  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(
      survey.data,
      indexedSurvey,
      questionTimeSpent,
    );
    useSubmissionStore.getState().setSubmission(submission);
    const result = await createSubmission(submission);
    const submissionId = result.id;
    router.push("/result");
    await trackSubmission(submissionId);
  });
}

function addExplanationComponentToQuestionHeader(model: Model, context: ListenerContext) {
  // Add explanation icon to question header
  const { indexedSurvey } = context;
  const cleanupFunctions = new Map<string, () => void>();
  const questionExplanationOpenChangeTracker = new Map<string, boolean>();
  model.onAfterRenderQuestion.add((_, { htmlElement, question }) => {
    const questionLabel = question.name as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    const explanation = strapiQuestion.explanation;
    if (!explanation) return;

    const questionHeaderDiv = htmlElement.querySelector(".sd-question__header");
    if (!questionHeaderDiv) return;

    // Clean up previous mount if it exists
    const cleanup = cleanupFunctions.get(questionLabel);
    if (cleanup) {
      // Schedule cleanup for the next tick to avoid React rendering conflicts
      setTimeout(cleanup, 0);
    }

    questionHeaderDiv.classList.add("flex");

    // Whenever the explanation of a question is opened for the first time, track the event
    async function onQuestionExplanationOpenChange(open: boolean) {
      const isAlreadyTracked = questionExplanationOpenChangeTracker.get(questionLabel);
      if (open && !isAlreadyTracked) {
        await trackQuestionExplanationViewed(strapiQuestion.id, questionLabel);
        questionExplanationOpenChangeTracker.set(questionLabel, true);
      }
    }

    // Store the new cleanup function
    const newCleanup = mountReactComponent(
      <QuestionExplanationComponent
        explanation={explanation}
        onOpenChange={onQuestionExplanationOpenChange}
      />,
      questionHeaderDiv as HTMLElement,
    );
    cleanupFunctions.set(questionLabel, newCleanup);
  });
}

function moveNoneOptionToEnd(model: Model, _: ListenerContext) {
  // Move none option to the end of the list
  model.onAfterRenderQuestion.add((_, { question }) => {
    const noneOption = question.visibleChoices.find(
      (choice: { value: string }) => choice.value === "none",
    );
    if (!noneOption) return;
    const noneIndex = question.visibleChoices.indexOf(noneOption);
    question.visibleChoices.splice(noneIndex, 1);
    question.visibleChoices.push(noneOption);
  });
}

function trackQuestionTimeSpent(model: Model, context: ListenerContext) {
  const { questionTimeSpent } = context;
  const questionStartTimes = new Map<QuestionLabel, number>();

  // Track when a question is rendered
  model.onAfterRenderQuestion.add((_, { question }) => {
    const questionLabel = question.name as QuestionLabel;
    questionStartTimes.set(questionLabel, performance.now());
  });

  // Track when a question is left (either by navigation or completion)
  model.onCurrentPageChanging.add((_, { oldCurrentPage }) => {
    const questions = oldCurrentPage.elements;
    for (const question of questions) {
      const questionLabel = question.name as QuestionLabel;
      const startTime = questionStartTimes.get(questionLabel);
      if (startTime) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
        questionStartTimes.delete(questionLabel);
      }
    }
  });

  // When survey is completed, track all remaining question times
  model.onComplete.add((survey) => {
    if (!survey.currentPage) return;

    // Process all questions on the current page
    const currentPageQuestions = survey.currentPage.elements;
    for (const question of currentPageQuestions) {
      const questionLabel = question.name as QuestionLabel;
      const startTime = questionStartTimes.get(questionLabel);
      if (startTime) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
        questionStartTimes.delete(questionLabel);
      }
    }

    // Also check for any remaining questions that might not have been processed
    for (const [questionLabel, startTime] of questionStartTimes.entries()) {
      const timeSpent = performance.now() - startTime;
      const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
      questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
    }

    // Clear the start times map
    questionStartTimes.clear();
  });

  // Add a fallback to ensure all question times are captured when the survey is submitted
  model.onCompleting.add((_, options) => {
    if (options.isCompleteOnTrigger) {
      // Process any remaining questions with active timers
      for (const [questionLabel, startTime] of questionStartTimes.entries()) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
      }
      questionStartTimes.clear();
    }
  });
}

function trackSurveyPreviewShown(model: Model, _: ListenerContext) {
  model.onShowingPreview.add(async () => {
    await trackSurveyPreviewOpened();
  });
}

function trackQuestionVisit(model: Model, context: ListenerContext) {
  const { indexedSurvey } = context;
  model.onCurrentPageChanged.add(async (_, { newCurrentPage }) => {
    const questionLabel = newCurrentPage.name.replace("P", "Q") as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    await trackQuestionVisited(strapiQuestion.id, questionLabel);
  });
}
