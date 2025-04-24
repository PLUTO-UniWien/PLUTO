import type { StrapiType, WithId } from "@/modules/strapi/types";

export type StrapiWeightingHistoryPage = WithId<
  StrapiType<"api::weighting-history-page.weighting-history-page">
>;
