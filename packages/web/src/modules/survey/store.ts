import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuestionLabel, StrapiSurvey } from "./types";

type SurveyProgress = {
  pageNumber: number;
  data: Record<QuestionLabel, unknown>;
};

interface SurveyState {
  survey: StrapiSurvey | null;
  setSurvey: (survey: StrapiSurvey | null) => void;
  surveyProgress: SurveyProgress | null;
  setSurveyProgress: (surveyProgress: SurveyProgress | null) => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      survey: null,
      setSurvey: (survey) => set({ survey }),
      surveyProgress: null,
      setSurveyProgress: (surveyProgress) => set({ surveyProgress }),
    }),
    {
      name: "survey",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
