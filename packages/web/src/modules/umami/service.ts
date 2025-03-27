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
  await umami.track("submission", { submissionId });
  const currentTimestamp = new Date().toISOString();
  await umami.identify({ [`submission-${currentTimestamp}`]: submissionId });
}

export async function trackStarted() {
  const umami = getUmamiInstance();
  await umami.track("started", {});
}
