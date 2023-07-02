export type StrapiResponseItem<T> = {
  id: number;
  attributes: { createdAt: string; updatedAt: string; publishedAt: string } & T;
};

export type StrapiResponseSingle<T> = {
  data: StrapiResponseItem<T>;
};

export type StrapiResponseCollection<T> = {
  data: StrapiResponseItem<T>[];
};
