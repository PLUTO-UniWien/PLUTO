import type {
  AnswerChoice,
  AnswerChoiceLabel,
  IndexedStrapiSurvey,
  QuestionLabel,
} from "@/modules/survey/types";
import type { StrapiSubmission, SurveyJSSubmission } from "./types";

export function adaptSurveyJsSubmissioToStrapiSubmission(
  submission: SurveyJSSubmission,
  indexedSurvey: IndexedStrapiSurvey,
) {
  const items = Object.entries(submission)
    .filter(([questionLabel]) => !isCommentField(questionLabel))
    .flatMap(([questionLabel, selectedAnswerChoices]) =>
      processQuestionAnswers(
        questionLabel as QuestionLabel,
        selectedAnswerChoices,
        submission,
        indexedSurvey,
      ),
    );

  return { items } as StrapiSubmission;
}

function isCommentField(questionLabel: string) {
  return questionLabel.endsWith("-Comment");
}

function normalizeSelection(selectedAnswerChoices: string | string[]) {
  return Array.isArray(selectedAnswerChoices) ? selectedAnswerChoices : [selectedAnswerChoices];
}

function findChoiceLabel(
  answerChoiceLabel: string,
  indexedChoices: Record<AnswerChoiceLabel, AnswerChoice>,
) {
  if (answerChoiceLabel in indexedChoices) {
    return answerChoiceLabel;
  }

  const result = Object.values(indexedChoices).find((choice) => {
    if (answerChoiceLabel === "other") {
      return choice.type === "other" || choice.type === "none of the above";
    }

    if (answerChoiceLabel === "none") {
      return choice.type === "no answer";
    }

    return false;
  });

  if (!result) {
    throw new Error(`Choice label not found: ${answerChoiceLabel}`);
  }

  return result;
}

function processQuestionAnswers(
  questionLabel: QuestionLabel,
  selectedAnswerChoices: string | string[],
  submission: SurveyJSSubmission,
  indexedSurvey: IndexedStrapiSurvey,
) {
  const { question, indexedChoices } = indexedSurvey[questionLabel];
  const selection = normalizeSelection(selectedAnswerChoices);

  return selection.map((answerChoiceLabel) => {
    const choiceLabel = findChoiceLabel(answerChoiceLabel, indexedChoices);
    const choice = indexedChoices[choiceLabel as AnswerChoiceLabel];

    const value = isOtherOrNoneOfAbove(choice.type)
      ? submission[`${questionLabel}-Comment`]
      : choice.body;

    return {
      label: choiceLabel,
      question: { id: question.id },
      choiceId: choice.id,
      value,
    };
  });
}

function isOtherOrNoneOfAbove(choiceType: string) {
  return choiceType === "other" || choiceType === "none of the above";
}
