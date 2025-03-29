import type { StrapiType, WithId } from "@/modules/strapi/types";
import type { AnswerChoiceLabel, QuestionLabel } from "@/modules/survey/types";

type SurveyAnswerValue = AnswerChoiceLabel | "other" | "none";

export type SurveyJSSubmission = {
  [key: QuestionLabel]: SurveyAnswerValue | SurveyAnswerValue[];
  [key: `${QuestionLabel}-Comment`]: string;
};
export type StrapiSubmission = WithId<StrapiType<"api::submission.submission">>;
export type StrapiSubmissionItem = StrapiType<"submission.item">;
