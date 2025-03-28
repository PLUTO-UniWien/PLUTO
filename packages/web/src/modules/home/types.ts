import type { StrapiType, WithId } from "@/modules/strapi/types";

export type StrapiHomePage = WithId<StrapiType<"api::home-page.home-page">>;
