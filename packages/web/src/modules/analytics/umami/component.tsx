"use client";
import Script from "next/script";
import { getUmamiInstance } from "./service";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/modules/analytics/store";

type UmamiAnalyticsProps = {
  scriptUrl: string;
  websiteId: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
};

export default function UmamiAnalytics({ scriptUrl, websiteId, strategy }: UmamiAnalyticsProps) {
  const { userId, sessionId } = useAnalyticsStore();
  useEffect(() => {
    getUmamiInstance().identify({ userId, sessionId });
  }, [userId, sessionId]);
  return <Script strategy={strategy} src={scriptUrl} data-website-id={websiteId} />;
}
