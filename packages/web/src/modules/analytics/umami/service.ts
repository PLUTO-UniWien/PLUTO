import type { UmamiInstance } from "./types";

export function getUmamiInstance(): UmamiInstance {
  "use client";

  if (!window.umami) {
    console.warn(
      "Umami analytics is not initialized or not available on the window object. Will not collect analytics.",
    );

    const dummyInstance: UmamiInstance = {
      track: () => Promise.resolve(),
      identify: () => Promise.resolve(),
    };

    return dummyInstance;
  }

  const tolerantInstance: UmamiInstance = {
    track: (...args) => window.umami.track(...args).catch((error) => handleError(error, ...args)),
    identify: (...args) =>
      window.umami.identify(...args).catch((error) => handleError(error, ...args)),
  };

  return tolerantInstance;
}

function handleError(error: unknown, ...args: unknown[]) {
  console.error("Error while tracking event with args:", args, "Error:", error);
}

async function trackEvent(event: string, properties: Record<string, unknown>) {
  const umami = getUmamiInstance();
  await umami.track(event, { properties: JSON.stringify(properties) });
}

export async function trackSubmission(submissionId: number) {
  await trackEvent("survey-submission", { submissionId });
}

export async function trackSurveyStarted() {
  await trackEvent("survey-start", {});
}

export async function trackQuestionExplanationViewed(questionId: number, questionLabel: string) {
  await trackEvent("question-explanation-view", { questionId, questionLabel });
}

export async function trackGlossaryItemInfoViewed(questionId: number, glossaryItemName: string) {
  await trackEvent("glossary-item-info-view", { questionId, glossaryItemName });
}

export async function trackSurveyPreviewOpened() {
  await trackEvent("survey-preview-open", {});
}

export async function trackQuestionVisited(questionId: number, questionLabel: string) {
  await trackEvent("question-visit", { questionId, questionLabel });
}

export async function trackPdfExport(submissionId: number, status: "success" | "failure") {
  await trackEvent("pdf-export", { submissionId, status });
}

export async function trackFeedbackFormOpened(submissionId: number) {
  await trackEvent("feedback-form-open", { submissionId });
}
