import type { APIResponseData } from "@/modules/strapi/types";
import type { StrapiSeo } from "@/modules/seo/types";
import type { Metadata } from "next";
import { strapiPublicUrl } from "@/modules/strapi/utils";
import { getCanonicalUrl } from "./utils";

export function adaptStrapiSeoToNextMetadata(seo: StrapiSeo, canonicalPath?: string): Metadata {
  const canonical = canonicalPath ? getCanonicalUrl(canonicalPath) : undefined;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    robots: seo.metaRobots,
    openGraph: strapiOpenGraphToNextOpenGraph(seo.openGraph),
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };
}

function strapiOpenGraphToNextOpenGraph(og: StrapiSeo["openGraph"]) {
  if (!og) return undefined;
  return {
    title: og.ogTitle,
    description: og.ogDescription,
    images: strapiImageToOGImage(og.ogImage),
    type: og.ogType,
  };
}

function strapiImageToOGImage(image: StrapiSeo["metaImage"]) {
  if (!image) return undefined;
  const img = image as unknown as APIResponseData<"plugin::upload.file">["data"];
  return {
    url: strapiPublicUrl(img.url),
    width: img.width,
    height: img.height,
  };
}
