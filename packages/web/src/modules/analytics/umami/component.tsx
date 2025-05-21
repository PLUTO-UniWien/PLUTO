"use client";
import Script from "next/script";
import { getUmamiInstance } from "./service";
import { useCallback, useEffect } from "react";
import { useAnalyticsStore } from "@/modules/analytics/store";

type UmamiAnalyticsProps = {
  scriptUrl: string;
  websiteId: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
};

export default function UmamiAnalytics({ scriptUrl, websiteId, strategy }: UmamiAnalyticsProps) {
  const { userId, sessionId } = useAnalyticsStore();

  const handleScriptLoad = useCallback(() => {
    getUmamiInstance().identify({ userId, sessionId });
  }, [userId, sessionId]);

  useEffect(() => {
    // If the script is already loaded (e.g., on subsequent renders)
    if (window.umami) {
      getUmamiInstance().identify({ userId, sessionId });
    }
  }, [userId, sessionId]);

  return (
    <Script
      strategy={strategy}
      src={scriptUrl}
      data-website-id={websiteId}
      onLoad={handleScriptLoad}
    />
  );
}
