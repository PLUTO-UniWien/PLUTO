import Script from "next/script";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "./utils";

export function StructuredData() {
  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      {organizationJsonLd && (
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: this is a valid use case
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      )}
      {websiteJsonLd && (
        <Script
          id="website-jsonld"
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: this is a valid use case
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      )}
    </>
  );
}
