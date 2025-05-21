"use client";
import Script from "next/script";
import { getUmamiInstance } from "./service";
import { useEffect } from "react";

type UmamiAnalyticsProps = {
  userId: string;
  sessionId: string;
  scriptUrl: string;
  websiteId: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
};

export default function UmamiAnalytics({
  userId,
  sessionId,
  scriptUrl,
  websiteId,
  strategy,
}: UmamiAnalyticsProps) {
  useEffect(() => {
    getUmamiInstance().identify({ userId, sessionId });
  }, [userId, sessionId]);
  return <Script strategy={strategy} src={scriptUrl} data-website-id={websiteId} />;
}
