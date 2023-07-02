import { z } from 'zod';

const ConfigSchema = z.object({
  appBackendUrl: z.string().url(),
  useAuth: z.enum(['true', 'false']).transform((val) => val === 'true'),
  lastContentUpdate: z.string().default('N/A'),
});
type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  return ConfigSchema.parse({
    appBackendUrl: process.env.VUE_APP_BACKEND_URL,
    useAuth: process.env.VUE_APP_USE_AUTH,
    lastContentUpdate: process.env.VUE_APP_LAST_CONTENT_UPDATE,
  });
}

const config = loadConfig();
export default config;
