import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StrapiSubmission } from "./types";
import type { WithId } from "@/modules/strapi/types";

interface SubmissionState {
  submission: (StrapiSubmission & { submittedAt: string }) | null;
  setSubmission: (submission: WithId<StrapiSubmission> | null) => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set) => ({
      submission: null,
      setSubmission: (submission) =>
        set({
          submission: submission ? { ...submission, submittedAt: new Date().toISOString() } : null,
        }),
    }),
    {
      name: "submission",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
