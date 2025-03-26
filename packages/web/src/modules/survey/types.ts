import type { StrapiType, WithId } from "@/modules/strapi/types";

export type StrapiSurvey = WithId<StrapiType<"api::survey.survey">>;
export type Question = WithId<StrapiType<"api::question.question">>;
export type AnswerChoice = WithId<StrapiType<"question.choice">>;
export type AnswerChoiceLabel = `A${number}.${number}`;
export type QuestionLabel = `Q${number}`;
export type IndexedStrapiSurvey = Record<
  QuestionLabel,
  {
    question: Question;
    indexedChoices: Record<AnswerChoiceLabel, AnswerChoice>;
  }
>;
