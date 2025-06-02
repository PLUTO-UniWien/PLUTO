"use client";
import Script from "next/script";

type ClarityAnalyticsProps = {
  projectId: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
};

function isValidProjectId(projectId: string) {
  return /^[a-zA-Z0-9]+$/.test(projectId);
}

export default function ClarityAnalytics({ projectId, strategy }: ClarityAnalyticsProps) {
  if (!isValidProjectId(projectId)) {
    console.warn("Invalid Clarity project ID", projectId);
    return null;
  }

  const scriptContent = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");  
  `;

  return (
    <Script
      id="clarity-analytics"
      strategy={strategy}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: value is safe
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
}
