import type { StrapiType, WithId } from "@/modules/strapi/types";

export type StrapiGlossaryPage = WithId<StrapiType<"api::glossary-page.glossary-page">>;
export type StrapiGlossaryItem = StrapiGlossaryPage["items"][number];
