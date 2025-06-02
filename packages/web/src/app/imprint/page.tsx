import strapiClient from "@/modules/strapi/client";
import ImprintComponent from "@/modules/imprint/component";
import { fetchImprintPage } from "@/modules/imprint/service";
import { createMetadataWithCanonical } from "@/modules/seo/utils";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return createMetadataWithCanonical("/imprint", {
    title: "Imprint - PLUTO",
    description: "Legal information and imprint for the PLUTO public value assessment tool.",
  });
}

export default async function Page() {
  const imprintPage = await fetchImprintPage(strapiClient);
  return <ImprintComponent imprint={imprintPage} />;
}
