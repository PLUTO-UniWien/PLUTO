import type { StrapiSubmission, StrapiSubmissionItem } from "@/modules/submission/types";
import type { AnswerChoice, Question, StrapiSurvey } from "@/modules/survey/types";
import { groupBy } from "@/modules/common/collection-utils";
import { getScoreRangeForQuestions } from "./range";

/**
 * Returns the counteraction feedback for the supplied {@link StrapiSubmission} grouped
 * by the impact of the question as well as the scores for the x and y-axis.
 *
 * @param {StrapiSubmission} submission - The survey result to get the feedback for.
 * @param {StrapiSurvey} survey - The survey model that the submission belongs to.
 */
export function analyzeSubmission(submission: StrapiSubmission, survey: StrapiSurvey) {
  const indexedAnswerChoices = indexAnswerChoices(survey);
  const submittedEntries = submission.items.map((item) => indexedAnswerChoices[item.choiceId]);

  // Group the entries based on they should be included or excluded in the result computation. We exclude entries to which the user has not submitted an answer.
  const entriesByInclusion = getEntriesByInclusion(submittedEntries);
  const excludedEntries = entriesByInclusion.excluded || [];
  const includedEntries = entriesByInclusion.included || [];

  // Get the excluded questions which would have impacted risk and benefit respectively
  const entriesByImpactExcluded = getEntriesByImpact(excludedEntries);
  const answeredQuestionsImpactingRiskExcluded = getAnsweredQuestions(
    entriesByImpactExcluded.risk || [],
  );
  const answeredQuestionsImpactingBenefitExcluded = getAnsweredQuestions(
    entriesByImpactExcluded.benefit || [],
  );

  // Get the included questions which actually impacted risk and benefit respectively
  const entriesByImpactIncluded = getEntriesByImpact(includedEntries);
  const answeredQuestionsImpactingRiskIncluded = getAnsweredQuestions(
    entriesByImpactIncluded.risk || [],
  );
  const answeredQuestionsImpactingBenefitIncluded = getAnsweredQuestions(
    entriesByImpactIncluded.benefit || [],
  );

  // Get the feedback associated with answered questions which are included in the result computation
  const feedbackRisk = getFeedbackForAnsweredQuestions(answeredQuestionsImpactingRiskIncluded);
  const feedbackBenefit = getFeedbackForAnsweredQuestions(
    answeredQuestionsImpactingBenefitIncluded,
  );

  const scoreRangeRisk = getScoreRangeForQuestions(
    answeredQuestionsImpactingRiskIncluded.map(({ question }) => question),
  );
  const scoreRangeBenefit = getScoreRangeForQuestions(
    answeredQuestionsImpactingBenefitIncluded.map(({ question }) => question),
  );

  const scoreRisk = getScoreForAnsweredQuestions(answeredQuestionsImpactingRiskIncluded);
  const scoreBenefit = getScoreForAnsweredQuestions(answeredQuestionsImpactingBenefitIncluded);
  const scoreRiskNormalized = normalizeScore(scoreRisk, scoreRangeRisk.min, scoreRangeRisk.max);
  const scoreBenefitNormalized = normalizeScore(
    scoreBenefit,
    scoreRangeBenefit.min,
    scoreRangeBenefit.max,
  );

  return {
    feedback: {
      risk: feedbackRisk,
      benefit: feedbackBenefit,
    },
    score: {
      risk: scoreRisk,
      benefit: scoreBenefit,
    },
    scoreNormalized: {
      risk: scoreRiskNormalized,
      benefit: scoreBenefitNormalized,
    },
    counts: {
      included: {
        risk: answeredQuestionsImpactingRiskIncluded.length,
        benefit: answeredQuestionsImpactingBenefitIncluded.length,
      },
      excluded: {
        risk: answeredQuestionsImpactingRiskExcluded.length,
        benefit: answeredQuestionsImpactingBenefitExcluded.length,
      },
      total: {
        risk:
          answeredQuestionsImpactingRiskIncluded.length +
          answeredQuestionsImpactingRiskExcluded.length,
        benefit:
          answeredQuestionsImpactingBenefitIncluded.length +
          answeredQuestionsImpactingBenefitExcluded.length,
      },
    },
  };
}

type AnswerChoiceWithQuestion = {
  question: Question;
  choice: AnswerChoice;
};

function indexAnswerChoices(survey: StrapiSurvey) {
  const res: Record<number, AnswerChoiceWithQuestion> = {};
  for (const group of survey.groups) {
    for (const question of group.questions || []) {
      for (const choice of question.choices || []) {
        const answerChoice = choice as AnswerChoice;
        res[answerChoice.id] = {
          question,
          choice: answerChoice,
        };
      }
    }
  }
  return res;
}

/**
 * Returns the normalized score for the supplied `score`, `minScore` and `maxScore`.
 * The result is a number between -1 and 1.
 *
 * @param {number} score - The score to normalize.
 * @param {number} minScore - The minimum score.
 * @param {number} maxScore - The maximum score.
 */
function normalizeScore(score: number, minScore: number, maxScore: number) {
  return ((score - minScore) / (maxScore - minScore)) * 2 - 1;
}

function getEntriesByInclusion(entries: AnswerChoiceWithQuestion[]) {
  return groupBy(entries, ({ choice }) => (choice.type === "no answer" ? "excluded" : "included"));
}

function getEntriesByImpact(entries: AnswerChoiceWithQuestion[]) {
  return groupBy(entries, ({ question }) => question.metadata.impact);
}

type AnsweredQuestion = {
  question: Question;
  pickedChoices: AnswerChoice[];
};

function getAnsweredQuestions(entries: AnswerChoiceWithQuestion[]): AnsweredQuestion[] {
  const entriesByQuestion = groupBy(entries, ({ question }) => question.id);
  return Object.values(entriesByQuestion).map((entries) => ({
    question: entries[0].question,
    pickedChoices: entries.map(({ choice }) => choice),
  }));
}

function getFeedbackForAnsweredQuestions(answeredQuestions: AnsweredQuestion[]) {
  return answeredQuestions.map(({ question, pickedChoices }) =>
    getFeedbackForAnsweredQuestionSingle(question, pickedChoices),
  );
}

function getFeedbackForAnsweredQuestionSingle(question: Question, pickedChoices: AnswerChoice[]) {
  // Core feedback attached to the entire question rather than a specific choice
  const {
    metadata: { feedback: coreFeedback },
  } = question;

  // Individual feedback potentially attached to specific choices
  const individualFeedback = pickedChoices.map(({ feedback }) => feedback);

  // We want to include core feedback if there is at least one picked choice with non-positive weight
  const shouldIncludeCoreFeedback = pickedChoices.some(
    ({ weight, type }) => weight <= 0 && type !== "no answer",
  );
  const feedback = shouldIncludeCoreFeedback
    ? [coreFeedback, ...individualFeedback]
    : individualFeedback;

  return feedback.filter((it) => it !== null && it !== undefined && it.length > 0);
}

function getScoreForAnsweredQuestions(answeredQuestions: AnsweredQuestion[]) {
  let score = 0;
  for (const { pickedChoices } of answeredQuestions) {
    for (const choice of pickedChoices) {
      score += choice.weight;
    }
  }
  return score;
}
