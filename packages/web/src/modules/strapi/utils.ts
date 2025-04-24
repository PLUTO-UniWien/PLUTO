import { env } from "@/env";

export function strapiPublicUrl(path: string) {
  return `${env.NEXT_PUBLIC_STRAPI_BASE_URL}${path}`;
}
