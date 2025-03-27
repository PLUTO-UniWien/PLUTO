/* eslint-disable */
import type { Schema, Struct } from "@strapi/types";

export interface QuestionChoice extends Struct.ComponentSchema {
  collectionName: "components_question_choices";
  info: {
    description: "";
    displayName: "Choice";
    icon: "bulletList";
  };
  attributes: {
    body: Schema.Attribute.String & Schema.Attribute.Required;
    feedback: Schema.Attribute.Blocks;
    type: Schema.Attribute.Enumeration<["regular", "other", "none of the above", "no answer"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"regular">;
    weight: Schema.Attribute.Integer & Schema.Attribute.Required & Schema.Attribute.DefaultTo<0>;
  };
}

export interface QuestionMetadata extends Struct.ComponentSchema {
  collectionName: "components_question_metadata";
  info: {
    description: "";
    displayName: "Metadata";
  };
  attributes: {
    feedback: Schema.Attribute.Blocks;
    impact: Schema.Attribute.Enumeration<["risk", "benefit"]> & Schema.Attribute.Required;
    selectionMax: Schema.Attribute.Integer;
    selectionMin: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: "components_shared_open_graphs";
  info: {
    displayName: "openGraph";
    icon: "project-diagram";
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<"images">;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos";
  info: {
    displayName: "seo";
    icon: "search";
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<"images">;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<"shared.open-graph", false>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SubmissionItem extends Struct.ComponentSchema {
  collectionName: "components_submission_items";
  info: {
    description: "";
    displayName: "Item";
    icon: "paperPlane";
  };
  attributes: {
    choiceId: Schema.Attribute.Integer & Schema.Attribute.Required;
    question: Schema.Attribute.Relation<"oneToOne", "api::question.question">;
    timeSpentOnQuestion: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SurveyGroup extends Struct.ComponentSchema {
  collectionName: "components_survey_groups";
  info: {
    displayName: "Group";
    icon: "apps";
  };
  attributes: {
    questions: Schema.Attribute.Relation<"oneToMany", "api::question.question">;
    title: Schema.Attribute.String & Schema.Attribute.Required & Schema.Attribute.Unique;
  };
}

declare module "@strapi/types" {
  export module Public {
    export interface ComponentSchemas {
      "question.choice": QuestionChoice;
      "question.metadata": QuestionMetadata;
      "shared.open-graph": SharedOpenGraph;
      "shared.seo": SharedSeo;
      "submission.item": SubmissionItem;
      "survey.group": SurveyGroup;
    }
  }
}
