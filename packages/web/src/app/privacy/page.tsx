import strapiClient from "@/modules/strapi/client";
import PrivacyComponent from "@/modules/privacy/component";
import { fetchPrivacyPage } from "@/modules/privacy/service";

export default async function Page() {
  const privacyPage = await fetchPrivacyPage(strapiClient);
  return <PrivacyComponent privacy={privacyPage} />;
}
