import HomeComponent from "@/modules/home/component";
import { fetchHomePage } from "@/modules/home/service";
import strapiClient from "@/modules/strapi/client";

export default async function Page() {
  const homePage = await fetchHomePage(strapiClient);

  return <HomeComponent homePage={homePage} />;
}
