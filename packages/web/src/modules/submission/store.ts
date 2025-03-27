import { create } from "zustand";
import type { StrapiSubmission } from "./types";

interface SubmissionState {
  submission: StrapiSubmission | null;
  setSubmission: (submission: StrapiSubmission | null) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  submission: null,
  setSubmission: (submission) => set({ submission }),
}));
