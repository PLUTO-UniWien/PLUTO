import questionsData from './static/questions.json';
import { StrapiResponseCollection } from './base.types';
import { generateSurveyJsModel, questionLabelInverse } from './utils';

const { data: questionItems } =
  questionsData as StrapiResponseCollection<Question>;
const questions = questionItems.map((item) => item.attributes);

export function surveyModel() {
  return generateSurveyJsModel(questions);
}

export function questionByName(name: string) {
  const { questionNumber } = questionLabelInverse(name);
  return questions[questionNumber - 1];
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
