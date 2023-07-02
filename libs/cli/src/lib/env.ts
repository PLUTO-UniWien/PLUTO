import { z } from 'zod';

// Define the environment variable schema using Zod
const envSchema = z.object({
  API_URL: z.string().url(),
  STRAPI_API_KEY: z.string().min(1),
});

type EnvVariables = z.infer<typeof envSchema>;

// Validate environment variables
const env: EnvVariables = envSchema.parse(process.env);

export default env;
