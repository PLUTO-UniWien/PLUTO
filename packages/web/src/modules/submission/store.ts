import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StrapiSubmission } from "./types";

interface SubmissionState {
  submission: StrapiSubmission | null;
  setSubmission: (submission: StrapiSubmission | null) => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set) => ({
      submission: null,
      setSubmission: (submission) => set({ submission }),
    }),
    {
      name: "submission",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
