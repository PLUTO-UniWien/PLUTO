import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STRAPI_API_BASE_URL: z
      .string()
      .url()
      .describe("Base URL of the Strapi API, used for server-side requests."),
    STRAPI_API_TOKEN: z
      .string()
      .min(1)
      .describe("Token for the Strapi API, used to authenticate server-side requests."),
    STRAPI_WEBHOOK_SECRET: z
      .string()
      .min(1)
      .describe("Secret for the Strapi webhook, used to authenticate webhook requests."),
  },
  client: {
    NEXT_PUBLIC_STRAPI_BASE_URL: z
      .string()
      .url()
      .describe(
        "Base URL of the Strapi API, used for client-side requests such as requesting media.",
      ),
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: z
      .string()
      .url()
      .describe("The URL of the Umami instance to track."),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z
      .string()
      .min(1)
      .describe("The ID of the Umami website to track."),
  },
  runtimeEnv: {
    // Server
    STRAPI_API_BASE_URL: process.env.STRAPI_API_BASE_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    STRAPI_WEBHOOK_SECRET: process.env.STRAPI_WEBHOOK_SECRET,
    // Client
    NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  },
});
