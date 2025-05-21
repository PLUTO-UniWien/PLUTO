import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type AnalyticsState = {
  userId: string;
  sessionId: string;
  resetSession: () => void;
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      userId: uuidv4(),
      sessionId: uuidv4(),
      resetSession: () => set({ sessionId: uuidv4() }),
    }),
    {
      name: "analytics",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
