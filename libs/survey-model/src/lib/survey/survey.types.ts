export type Survey = {
  id: number;
  version: string;
  groups: SurveyGroup[];
};

export type SurveyGroup = {
  title: string;
  questions: Question[];
};

export type Question = {
  id: number;
  label: `Q${number}`;
  body: string;
  explanation: string | null;
  choices: AnswerChoice[];
  metadata: QuestionMetadata;
  weightingAppendixDescription: string | null;
};

export type QuestionMetadata = {
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
  /**
   * The in-CMS ID of the survey.
   */
  survey: string;
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
  question: number;
  /**
   * Short label, such as `A5.1`
   */
  choice: string;
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
