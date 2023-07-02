import questionsData from './static/questions.json';
import { StrapiResponseCollection } from './base.types';
import {
  answerChoiceLabel,
  answerChoiceLabelInverse,
  generateSurveyJsModel,
  questionLabelInverse,
} from './utils';

const { data: questionItems } =
  questionsData as StrapiResponseCollection<Question>;
const questions = questionItems.map(({ id, attributes }) => ({
  id,
  ...attributes,
}));

export function surveyModel() {
  return generateSurveyJsModel(questions);
}

export function questionByName(name: string) {
  const { questionNumber } = questionLabelInverse(name);
  return questions[questionNumber - 1];
}

export function choiceByLabel(question: Question, label: string) {
  const { choiceNumber } = answerChoiceLabelInverse(label);
  return question.choices[choiceNumber - 1];
}

export function choiceLabelForSpecialOption(
  question: Question,
  option: 'other' | 'none'
) {
  const choice = question.choices.find((choice) =>
    choice.type.startsWith(option)
  );
  if (choice) {
    const index = question.choices.indexOf(choice);
    const choiceNumber = index + 1;
    const { questionNumber } = questionLabelInverse(question.label);
    return answerChoiceLabel(questionNumber, choiceNumber);
  }
  throw new Error(`Question does not have a ${option} choice`);
}

export type Question = {
  label: `Q${number}`;
  body: string;
  choices: AnswerChoice[];
  metadata: QuestionMetadata;
};

type QuestionMetadata = {
  impact: 'x' | 'y';
  selection: { start: number; end: number };
  feedback: string | null;
};

/**
 * The type of answer choice.
 *
 * - `none` - When selecting this option, no other options can be selected.
 * - `otherExclusive` - When selecting this option, the user can enter a custom answer, no other options can be selected.
 * - `otherInclusive` - When selecting this option, the user can enter a custom answer, other options can be selected.
 * - `regular` - When selecting this option, other options can be selected.
 */
type AnswerChoiceType =
  | 'none'
  | 'otherExclusive'
  | 'otherInclusive'
  | 'regular';

export type AnswerChoice = {
  body: string;
  score: number;
  feedback: string | null;
  type: AnswerChoiceType;
};

export type SurveyResult = {
  items: ResultItem[];
  metadata: SubmissionMetadata;
};

export type SubmissionMetadata = {
  userAgent: string;
};

/**
 * Represents a single result item
 */
export type ResultItem = {
  /**
   * The in-CMS ID of the question.
   */
  questionId: number;
  /**
   * Short label, such as `A5.1`
   */
  choiceId: string;
  /**
   * The body of the answer choice.
   */
  value: string;
  /**
   * Type of the answer choice.
   */
  type: AnswerChoiceType;
  /**
   * The weight assigned to the answer choice.
   */
  score: number;
  /**
   * The impact of the answer choice.
   */
  impact: 'x' | 'y';
};
