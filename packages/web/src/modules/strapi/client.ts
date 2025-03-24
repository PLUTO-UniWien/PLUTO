import { strapi } from "@strapi/client";
import { env } from "@/env";

const strapiClient = strapi({
  baseURL: env.STRAPI_API_BASE_URL,
  auth: env.STRAPI_API_TOKEN,
});

export type StrapiClient = typeof strapiClient;

export default strapiClient;
