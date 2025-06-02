import strapiClient from "@/modules/strapi/client";
import PrivacyComponent from "@/modules/privacy/component";
import { fetchPrivacyPage } from "@/modules/privacy/service";
import { createMetadataWithCanonical } from "@/modules/seo/utils";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return createMetadataWithCanonical("/privacy", {
    title: "Privacy Policy - PLUTO",
    description: "Privacy policy for the PLUTO public value assessment tool.",
  });
}

export default async function Page() {
  const privacyPage = await fetchPrivacyPage(strapiClient);
  return <PrivacyComponent privacy={privacyPage} />;
}
