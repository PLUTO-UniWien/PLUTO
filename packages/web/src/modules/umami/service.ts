import type { UmamiInstance } from "./types";

export function getUmamiInstance(): UmamiInstance {
  "use client";

  if (!window.umami) {
    throw new Error("Umami analytics is not initialized or not available on the window object");
  }

  return window.umami;
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
