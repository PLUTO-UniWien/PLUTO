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

export async function trackSubmission(submissionId: number) {
  const umami = getUmamiInstance();
  await umami.track("survey-submission", { submissionId });
  const currentTimestamp = new Date().toISOString();
  await umami.identify({ [`survey-submission-${currentTimestamp}`]: submissionId });
}

export async function trackSurveyStarted() {
  const umami = getUmamiInstance();
  await umami.track("survey-start", {});
}

export async function trackQuestionExplanationViewed(questionId: number, questionLabel: string) {
  const umami = getUmamiInstance();
  await umami.track("question-explanation-view", { questionId, questionLabel });
}

export async function trackSurveyPreviewOpened() {
  const umami = getUmamiInstance();
  await umami.track("survey-preview-open", {});
}

export async function trackQuestionVisited(questionId: number, questionLabel: string) {
  const umami = getUmamiInstance();
  await umami.track("question-visit", { questionId, questionLabel });
}

export async function trackPdfExport(submissionId: number, status: "success" | "failure") {
  const umami = getUmamiInstance();
  await umami.track("pdf-export", { submissionId, status });
}
