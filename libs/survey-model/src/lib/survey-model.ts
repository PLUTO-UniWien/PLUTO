import surveyData from './static/survey.json';
import {
  answerChoiceLabel,
  answerChoiceLabelInverse,
  generateSurveyJsModel,
  questionLabelInverse,
} from './survey.adapter';
import { Question } from './survey.types';
import { parseSurvey } from './parser';

const survey = parseSurvey(surveyData);
const questions = survey.groups.flatMap((group) => group.questions);

export function surveyModel() {
  return generateSurveyJsModel(survey);
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
