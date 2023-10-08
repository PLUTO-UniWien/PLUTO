import type { Schema, Attribute } from '@strapi/strapi';

export interface AnswerChoiceChoices extends Schema.Component {
  collectionName: 'components_answer_choice_choices';
  info: {
    displayName: 'choices';
    description: '';
  };
  attributes: {
    score: Attribute.Integer & Attribute.Required;
    type: Attribute.Enumeration<
      ['none', 'otherExclusive', 'otherInclusive', 'regular']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'regular'>;
    body: Attribute.String & Attribute.Required;
    feedback: Attribute.String;
  };
}

export interface GlossaryItemGlossaryItem extends Schema.Component {
  collectionName: 'components_glossary_item_glossary_items';
  info: {
    displayName: 'Glossary Item';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.RichText & Attribute.Required;
  };
}

export interface QuestionMetadataMetadata extends Schema.Component {
  collectionName: 'components_question_metadata_metadata';
  info: {
    displayName: 'metadata';
    description: '';
  };
  attributes: {
    impact: Attribute.Enumeration<['x', 'y']> &
      Attribute.Required &
      Attribute.DefaultTo<'x'>;
    selection: Attribute.Component<'selection-range.selection-range'>;
    feedback: Attribute.String;
  };
}

export interface ResultItemResultItem extends Schema.Component {
  collectionName: 'components_result_item_result_items';
  info: {
    displayName: 'Result Item';
    description: '';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<
      ['none', 'otherExclusive', 'otherInclusive', 'regular']
    > &
      Attribute.Required;
    question: Attribute.Relation<
      'result-item.result-item',
      'oneToOne',
      'api::question.question'
    >;
    choice: Attribute.String & Attribute.Required;
  };
}

export interface SelectionRangeSelectionRange extends Schema.Component {
  collectionName: 'components_selection_range_selection_ranges';
  info: {
    displayName: 'Selection Range';
  };
  attributes: {
    start: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }> &
      Attribute.DefaultTo<1>;
    end: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }> &
      Attribute.DefaultTo<1>;
  };
}

export interface SubmissionMetadataSubmissionMetadata extends Schema.Component {
  collectionName: 'components_submission_metadata_submission_metadata';
  info: {
    displayName: 'Submission Metadata';
  };
  attributes: {
    userAgent: Attribute.String & Attribute.Required;
  };
}

export interface SurveyGroupSurveyGroup extends Schema.Component {
  collectionName: 'components_survey_group_survey_groups';
  info: {
    displayName: 'Survey Group';
  };
  attributes: {
    title: Attribute.String;
    questions: Attribute.Relation<
      'survey-group.survey-group',
      'oneToMany',
      'api::question.question'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'answer-choice.choices': AnswerChoiceChoices;
      'glossary-item.glossary-item': GlossaryItemGlossaryItem;
      'question-metadata.metadata': QuestionMetadataMetadata;
      'result-item.result-item': ResultItemResultItem;
      'selection-range.selection-range': SelectionRangeSelectionRange;
      'submission-metadata.submission-metadata': SubmissionMetadataSubmissionMetadata;
      'survey-group.survey-group': SurveyGroupSurveyGroup;
    }
  }
}
