/**
 * Represents a single response item obtained from the Strapi API,
 * including the automatically added CMS-related metadata.
 *
 * @template T - The type of the item's attributes.
 */
export type StrapiResponseItem<T> = {
  id: number;
  attributes: { createdAt: string; updatedAt: string; publishedAt: string } & T;
};

/**
 * Represents a data response obtained from Strapi, received after querying for a single item.
 *
 * @template T - The type of the item's attributes.
 */
export type StrapiResponseSingle<T> = {
  data: StrapiResponseItem<T>;
};

/**
 * Represents a data response obtained from Strapi, received after querying for a collection of items.
 *
 * @template T - The type of the item's attributes.
 */
export type StrapiResponseCollection<T> = {
  data: StrapiResponseItem<T>[];
};
