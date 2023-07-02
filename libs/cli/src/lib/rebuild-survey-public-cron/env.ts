import { z } from 'zod';
import { envSchemaShape as envSchemaShapePullCmsContent } from '../pull-cms-content/env';

const { API_URL, STRAPI_API_KEY } = envSchemaShapePullCmsContent;
export const envSchemaShape = {
  API_URL,
  STRAPI_API_KEY,
  CMS_REFRESH_INTERVAL_MIN: z.string().default('1').transform(Number),
};

const envSchema = z.object(envSchemaShape);

type EnvVariables = z.infer<typeof envSchema>;

// Validate environment variables
const env: EnvVariables = envSchema.parse(process.env);

export default env;
