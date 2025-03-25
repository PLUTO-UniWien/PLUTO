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
  },
  client: {
    NEXT_PUBLIC_STRAPI_BASE_URL: z
      .string()
      .url()
      .describe(
        "Base URL of the Strapi API, used for client-side requests such as requesting media.",
      ),
  },
  runtimeEnv: {
    // Server
    STRAPI_API_BASE_URL: process.env.STRAPI_API_BASE_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    // Client
    NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  },
});
