"use client";
import Script from "next/script";

type UmamiAnalyticsProps = {
  scriptUrl: string;
  websiteId: string;
};

export default function UmamiAnalytics({ scriptUrl, websiteId }: UmamiAnalyticsProps) {
  return <Script async src={scriptUrl} data-website-id={websiteId} />;
}
