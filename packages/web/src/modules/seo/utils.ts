import { env } from "@/env";
import type { Metadata } from "next";

/**
 * Generates a canonical URL for the given path
 * Only generates canonical URLs in production mode
 */
export function getCanonicalUrl(path = "") {
  // Only generate canonical URLs in production
  if (env.NEXT_PUBLIC_APP_FLAVOR !== "prod") {
    return undefined;
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

/**
 * Creates metadata with canonical URL for a given path
 */
export function createMetadataWithCanonical(path = "", additionalMetadata: Partial<Metadata> = {}) {
  const canonical = getCanonicalUrl(path);

  return {
    ...additionalMetadata,
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };
}

/**
 * Generates Organization JSON-LD structured data
 */
export function generateOrganizationJsonLd() {
  if (env.NEXT_PUBLIC_APP_FLAVOR !== "prod") {
    return null;
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PLUTO - Public Value Assessment Tool",
    description: "A tool for assessing the benefits and risks of specific instances of data use",
    url: baseUrl,
    logo: "https://raw.githubusercontent.com/PLUTO-UniWien/PLUTO/refs/heads/main/packages/web/public/pluto-og-image-generic.png",
    sameAs: ["https://github.com/PLUTO-UniWien"],
  };
}

/**
 * Generates WebSite JSON-LD structured data
 */
export function generateWebSiteJsonLd() {
  if (env.NEXT_PUBLIC_APP_FLAVOR !== "prod") {
    return null;
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PLUTO - Public Value Assessment Tool",
    description: "A tool for assessing the benefits and risks of specific instances of data use",
    url: baseUrl,
  };
}
