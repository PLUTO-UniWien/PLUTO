"use client";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

type ClarityAnalyticsProps = {
  userId: string;
  sessionId: string;
  projectId: string;
};

export default function ClarityAnalytics({ userId, sessionId, projectId }: ClarityAnalyticsProps) {
  useEffect(() => {
    Clarity.init(projectId);
    Clarity.identify(userId, sessionId);
  }, [projectId, sessionId, userId]);
  return null;
}
