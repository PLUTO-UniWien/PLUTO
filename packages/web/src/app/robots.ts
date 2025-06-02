import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  // Only generate robots.txt in production
  if (env.NEXT_PUBLIC_APP_FLAVOR !== "prod") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/result/*", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
