import type { StrapiType, WithId } from "../strapi/types";

export type StrapiPostPreview = {
  createdAt: string;
  title: string;
  slug: string;
};

export type StrapiPost = WithId<StrapiType<"api::post.post">>;
