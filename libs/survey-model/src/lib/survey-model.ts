import surveyData from './static/survey.json';
import {
  answerChoiceLabel,
  answerChoiceLabelInverse,
  generateSurveyJsModel,
  questionLabelInverse,
} from './survey.adapter';
import { Question, ResultItem } from './survey.types';
import { parseSurvey } from './parser';

/**
 * Static survey model loaded from JSON file.
 */
const survey = parseSurvey(surveyData);
/**
 * Computed attribute of {@link survey}, a flat array of all the included questions regardless of groups.
 */
const questions = survey.groups.flatMap((group) => group.questions);

/**
 * Returns a raw survey model for use with SurveyJS.
 */
export function surveyModel() {
  return generateSurveyJsModel(survey);
}

/**
 * Returns a {@link Question} by its name.
 * Useful to access a full {@link Question} object from a SurveyJS submission,
 * where we only have access to some of the question's attributes.
 *
 * @param {string} name - The name of the question to find. E.g. "Q1" for the first question.
 */
export function questionByName(name: string) {
  const { questionNumber } = questionLabelInverse(name);
  return questions[questionNumber - 1];
}

/**
 * Returns an {@link AnswerChoice} by its label.
 * Useful to access a full {@link AnswerChoice} object from a SurveyJS submission,
 * where we only have access to some of the selected answer choice's attributes.
 *
 * @param {Question} question - The question to find the answer choice for.
 * @param {string} label - The label of the answer choice to find. E.g. "A1.1" for the first answer choice of the first question.
 */
export function choiceByLabel(question: Question, label: string) {
  const { choiceNumber } = answerChoiceLabelInverse(label);
  return question.choices[choiceNumber - 1];
}

/**
 * Returns an {@link AnswerChoice} by its {@link ResultItem}.
 * Utility wrapper around {@link choiceByLabel} to find the answer choice for a {@link ResultItem}.
 *
 * @param {Question} question - The question to find the answer choice for.
 * @param {ResultItem} resultItem - The result item to find the answer choice for.
 */
export function choiceByResultItem(question: Question, resultItem: ResultItem) {
  return choiceByLabel(question, resultItem.choiceId);
}

/**
 * Returns the {@link AnswerChoice} label for a {@link Question} with `type` "none" or "other".
 * This is useful to access the label of the "none" or "other" answer choice from a SurveyJS submission,
 * so that the corresponding {@link AnswerChoice} can be found and we can access its attributes for
 * further processing.
 *
 * @param {Question} question - The question to find the answer choice for.
 * @param {'other' | 'none'} option - The option to find the answer choice for. Either "none" or "other".
 */
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
