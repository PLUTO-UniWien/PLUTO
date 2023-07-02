import { z } from 'zod';

// Define the environment variable schema using Zod
export const envSchemaShape = {
  API_URL: z.string().url(),
  STRAPI_API_KEY: z.string().min(1),
  SHOULD_RUN_STANDALONE: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
};

const envSchema = z.object(envSchemaShape);

type EnvVariables = z.infer<typeof envSchema>;

// Validate environment variables
const env: EnvVariables = envSchema.parse(process.env);

export default env;
