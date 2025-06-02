import type { MetadataRoute } from "next";
import { env } from "@/env";
import strapiClient from "@/modules/strapi/client";
import { fetchLatestPosts } from "@/modules/posts/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only generate sitemap in production
  if (env.NEXT_PUBLIC_APP_FLAVOR !== "prod") {
    return [];
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const lastModified = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/survey`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/weighting`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/imprint`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Fetch dynamic posts from Strapi
    const latestPosts = await fetchLatestPosts(strapiClient, 100);

    const dynamicRoutes: MetadataRoute.Sitemap = latestPosts.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.warn("Failed to fetch dynamic routes for sitemap:", error);
    return staticRoutes;
  }
}
