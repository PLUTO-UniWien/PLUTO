import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { humanId } from "human-id";

type AnalyticsState = {
  userId: string;
  sessionId: string;
  resetSession: () => void;
};

function generateId() {
  return humanId({
    adjectiveCount: 2,
    capitalize: false,
    separator: "-",
  });
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      userId: generateId(),
      sessionId: generateId(),
      resetSession: () => set({ sessionId: generateId() }),
    }),
    {
      name: "pluto:analytics",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
