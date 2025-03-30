"use client";
import Script from "next/script";

type UmamiAnalyticsProps = {
  scriptUrl: string;
  websiteId: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
};

export default function UmamiAnalytics({ scriptUrl, websiteId, strategy }: UmamiAnalyticsProps) {
  return <Script strategy={strategy} src={scriptUrl} data-website-id={websiteId} />;
}
