import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STRAPI_API_BASE_URL: z.string().url(),
    STRAPI_API_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    STRAPI_API_BASE_URL: process.env.STRAPI_API_BASE_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  },
});
