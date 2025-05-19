import type {
  AnswerChoice,
  AnswerChoiceLabel,
  IndexedStrapiSurvey,
  QuestionLabel,
} from "@/modules/survey/types";
import type { StrapiSubmission, SurveyJSSubmission } from "./types";

export function adaptSurveyJsSubmissionToStrapiSubmission(
  submission: SurveyJSSubmission,
  indexedSurvey: IndexedStrapiSurvey,
  questionTimeSpent: Map<QuestionLabel, number>,
) {
  const items = Object.entries(submission)
    .filter(([questionLabel]) => !isCommentField(questionLabel))
    .flatMap(([questionLabel, selectedAnswerChoices]) =>
      processQuestionAnswers(
        questionLabel as QuestionLabel,
        selectedAnswerChoices,
        submission,
        indexedSurvey,
        questionTimeSpent,
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

function findChoiceByLabel(
  answerChoiceLabel: string,
  indexedChoices: Record<AnswerChoiceLabel, AnswerChoice>,
) {
  if (answerChoiceLabel in indexedChoices) {
    return indexedChoices[answerChoiceLabel as AnswerChoiceLabel];
  }

  const choice = Object.values(indexedChoices).find((choice) => {
    if (answerChoiceLabel === "other") {
      return choice.type === "other" || choice.type === "none of the above";
    }

    if (answerChoiceLabel === "none") {
      return choice.type === "no answer";
    }

    return false;
  });

  if (!choice) {
    throw new Error(`Choice not found with label: ${answerChoiceLabel}`);
  }

  return choice;
}

function processQuestionAnswers(
  questionLabel: QuestionLabel,
  selectedAnswerChoices: string | string[],
  submission: SurveyJSSubmission,
  indexedSurvey: IndexedStrapiSurvey,
  questionTimeSpent: Map<QuestionLabel, number>,
) {
  const timeSpentOnQuestion = questionTimeSpent.get(questionLabel);
  const { question, indexedChoices } = indexedSurvey[questionLabel];
  const selection = normalizeSelection(selectedAnswerChoices);

  return selection.map((answerChoiceLabel) => {
    const choice = findChoiceByLabel(answerChoiceLabel, indexedChoices);

    const value = isOtherOrNoneOfAbove(choice.type)
      ? submission[`${questionLabel}-Comment`]
      : choice.body;

    return {
      question: { id: question.id },
      choiceId: choice.id,
      value,
      timeSpentOnQuestion,
    };
  });
}

function isOtherOrNoneOfAbove(choiceType: string) {
  return choiceType === "other" || choiceType === "none of the above";
}
