import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StrapiSurvey } from "./types";

interface SurveyState {
  survey: StrapiSurvey | null;
  setSurvey: (survey: StrapiSurvey) => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      survey: null,
      setSurvey: (survey) => set({ survey }),
    }),
    {
      name: "survey",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
