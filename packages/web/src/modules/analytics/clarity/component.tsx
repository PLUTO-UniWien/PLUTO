"use client";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/modules/analytics/store";

type ClarityAnalyticsProps = {
  projectId: string;
};

export default function ClarityAnalytics({ projectId }: ClarityAnalyticsProps) {
  const { userId, sessionId } = useAnalyticsStore();
  useEffect(() => {
    Clarity.init(projectId);
    Clarity.identify(userId, sessionId);
  }, [projectId, sessionId, userId]);
  return null;
}
