import type { StrapiClient } from "@/modules/strapi/client";
import type { StrapiSeo } from "./types";
import type { Metadata } from "next";
import { adaptStrapiSeoToNextMetadata } from "./adapter";

export async function fetchSingleTypeSeo(client: StrapiClient, resource: string) {
  const singleType = client.single(resource);
  const response = await singleType.find({
    populate: ["seo", "seo.metaImage", "seo.openGraph", "seo.openGraph.ogImage"],
  });

  return response.data.seo as StrapiSeo | undefined;
}

export function createSingleTypeGenerateMetadataCallback(
  client: StrapiClient,
  seoFetcher: (client: StrapiClient) => Promise<StrapiSeo | undefined>,
  canonicalPath?: string,
) {
  async function generateMetadata(): Promise<Metadata> {
    const seo = await seoFetcher(client);
    if (!seo) return {};
    return adaptStrapiSeoToNextMetadata(seo, canonicalPath);
  }

  return generateMetadata;
}
