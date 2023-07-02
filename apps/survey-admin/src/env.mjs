import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    STRAPI_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
  },
  runtimeEnv: {
    STRAPI_API_KEY: process.env.STRAPI_API_KEY,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
  },
});
