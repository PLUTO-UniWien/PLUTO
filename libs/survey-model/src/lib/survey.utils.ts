import {
  AnswerChoice,
  Question,
  ResultItem,
  SurveyResult,
} from './survey.types';
import { groupBy } from './utils';
import { answerChoiceLabelInverse, questionLabel } from './survey.adapter';
import { choiceByResultItem, questionByName } from './survey-model';

export function getFeedbackForResult(result: SurveyResult) {
  const answersPerQuestion = getAnswersPerQuestion(result.items);
  const entriesPerImpact = groupBy(
    answersPerQuestion,
    ({
      question: {
        metadata: { impact },
      },
    }) => impact
  );
  const entriesX = entriesPerImpact['x'];
  const feedbackX = entriesX.flatMap(({ question, items }) =>
    getFeedbackForAnsweredQuestion(question, items)
  );
  const entriesY = entriesPerImpact['y'];
  const feedbackY = entriesY.flatMap(({ question, items }) =>
    getFeedbackForAnsweredQuestion(question, items)
  );
  return { feedbackX, feedbackY };
}

type ResultItemWithChoice = {
  resultItem: ResultItem;
  choice: AnswerChoice;
};

function resultItemWithChoice(
  question: Question,
  resultItem: ResultItem
): ResultItemWithChoice {
  const choice = choiceByResultItem(question, resultItem);
  return { resultItem, choice };
}

function getAnswersPerQuestion(resultItems: ResultItem[]) {
  const answersPerQuestionGroup = groupBy(resultItems, ({ choiceId }) => {
    const { questionNumber } = answerChoiceLabelInverse(choiceId);
    return questionLabel(questionNumber);
  });
  return Object.entries(answersPerQuestionGroup).map(
    ([questionName, answers]) => {
      const question = questionByName(questionName);
      const items = answers.map((resultItem) =>
        resultItemWithChoice(question, resultItem)
      );
      return { question, items };
    }
  );
}

function getFeedbackForAnsweredQuestion(
  question: Question,
  items: ResultItemWithChoice[]
) {
  const {
    metadata: { feedback: coreFeedback },
  } = question;
  const individualFeedback = items.map(({ choice: { feedback } }) => feedback);
  return [coreFeedback, ...individualFeedback].filter(Boolean) as string[];
}
