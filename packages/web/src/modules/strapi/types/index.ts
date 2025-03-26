import type { Schema, UID, Utils } from "@strapi/types";

type IDProperty = { id: number };

type InvalidKeys<TSchemaUID extends UID.Schema> = Utils.Object.KeysBy<
  Schema.Attributes<TSchemaUID>,
  Schema.Attribute.Private | Schema.Attribute.Password
>;

export type GetValues<TSchemaUID extends UID.Schema> = {
  [TKey in Schema.OptionalAttributeNames<TSchemaUID>]?: Schema.AttributeByName<
    TSchemaUID,
    TKey
  > extends infer TAttribute extends Schema.Attribute.Attribute
    ? GetValue<TAttribute>
    : never;
} & {
  [TKey in Schema.RequiredAttributeNames<TSchemaUID>]-?: Schema.AttributeByName<
    TSchemaUID,
    TKey
  > extends infer TAttribute extends Schema.Attribute.Attribute
    ? GetValue<TAttribute>
    : never;
} extends infer TValues
  ? // Remove invalid keys (private, password)
    Omit<TValues, InvalidKeys<TSchemaUID>>
  : never;

type RelationValue<TAttribute extends Schema.Attribute.Attribute> =
  TAttribute extends Schema.Attribute.RelationWithTarget
    ? Utils.MatchFirst<
        [
          [
            Utils.Extends<TAttribute["relation"], Schema.Attribute.RelationKind.Any>,
            TAttribute["relation"] extends `${string}ToMany`
              ? (GetValues<TAttribute["target"]> & IDProperty)[]
              : (GetValues<TAttribute["target"]> & IDProperty) | null,
          ],
        ],
        `TODO: handle other relation kind (${TAttribute["relation"]})`
      >
    : never;

type ComponentValue<TAttribute extends Schema.Attribute.Attribute> =
  TAttribute extends Schema.Attribute.Component<infer TComponentUID, infer TRepeatable>
    ? IDProperty &
        Utils.If<TRepeatable, GetValues<TComponentUID>[], GetValues<TComponentUID> | null>
    : never;

type DynamicZoneValue<TAttribute extends Schema.Attribute.Attribute> =
  TAttribute extends Schema.Attribute.DynamicZone<infer TComponentUIDs>
    ? Array<
        Utils.Array.Values<TComponentUIDs> extends infer TComponentUID
          ? TComponentUID extends UID.Component
            ? { __component: TComponentUID } & IDProperty & GetValues<TComponentUID>
            : never
          : never
      >
    : never;

type MediaValue<TAttribute extends Schema.Attribute.Attribute> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TAttribute extends Schema.Attribute.Media<infer _TKind, infer TMultiple>
    ? Utils.If<
        TMultiple,
        APIResponseCollection<"plugin::upload.file">,
        APIResponseData<"plugin::upload.file"> | null
      >
    : never;

export type GetValue<TAttribute extends Schema.Attribute.Attribute> = Utils.If<
  Utils.IsNotNever<TAttribute>,
  Utils.MatchFirst<
    [
      // Relation
      [Utils.Extends<TAttribute, Schema.Attribute.OfType<"relation">>, RelationValue<TAttribute>],
      // DynamicZone
      [
        Utils.Extends<TAttribute, Schema.Attribute.OfType<"dynamiczone">>,
        DynamicZoneValue<TAttribute>,
      ],
      // Component
      [Utils.Extends<TAttribute, Schema.Attribute.OfType<"component">>, ComponentValue<TAttribute>],
      // Media
      [Utils.Extends<TAttribute, Schema.Attribute.OfType<"media">>, MediaValue<TAttribute>],
      // Fallback
      // If none of the above attribute type, fallback to the original Attribute.GetValue (while making sure it's an attribute)
      [Utils.IsNotNever<TAttribute>, Schema.Attribute.Value<TAttribute, unknown>],
    ],
    unknown
  >,
  unknown
>;

export interface APIResponseCollectionMetadata {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export type WithId<T> = T & IDProperty;

export interface APIResponseData<TContentTypeUID extends UID.ContentType> {
  data: WithId<GetValues<TContentTypeUID>>;
}

export interface APIResponseCollection<TContentTypeUID extends UID.ContentType> {
  data: WithId<GetValues<TContentTypeUID>>[];
  meta: APIResponseCollectionMetadata;
}

type StrapiContentType<T extends UID.ContentType> = GetValues<T>;
type StrapiComponentType<T extends UID.Component> = GetValues<T>;
export type StrapiType<T extends UID.Schema> = T extends UID.ContentType
  ? StrapiContentType<T>
  : T extends UID.Component
    ? StrapiComponentType<T>
    : never;

// These files are copied automatically from packages/cms/types/generated/ via script packages/web/scripts/copy-cms-types.ts
export * as components from "./components";
export * as contentTypes from "./contentTypes";
