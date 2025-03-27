import { create } from "zustand";
import type { StrapiSurvey } from "./types";

interface SurveyState {
  survey: StrapiSurvey | null;
  setSurvey: (survey: StrapiSurvey) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  survey: null,
  setSurvey: (survey) => set({ survey }),
}));
