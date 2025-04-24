import type { StrapiSubmission } from "@/modules/submission/types";
import type { AnswerChoice, Question, StrapiSurvey } from "@/modules/survey/types";
import { groupBy } from "@/modules/common/collection-utils";
import { getScoreRangeForQuestions } from "./range";

type AnswerChoiceWithQuestion = {
  question: Question;
  choice: AnswerChoice;
};

type AnsweredQuestion = {
  question: Question;
  pickedChoices: AnswerChoice[];
};

/**
 * Analyzes a survey submission to calculate risk/benefit scores and feedback.
 * Returns normalized scores, feedback, and question count statistics.
 *
 * @param {StrapiSubmission} submission - The survey result to analyze
 * @param {StrapiSurvey} survey - The survey model containing questions and choices
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

  const resultType = determineResultType(scoreRiskNormalized, scoreBenefitNormalized);

  return {
    resultType,
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

export type AnalysisResult = ReturnType<typeof analyzeSubmission>;

/**
 * Creates a lookup map of answer choices indexed by their IDs.
 * Facilitates the mapping of submitted answer choice items to their full Strapi model objects.
 */
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
 * Processes answered questions to generate feedback arrays for each question
 */
function getFeedbackForAnsweredQuestions(answeredQuestions: AnsweredQuestion[]) {
  return answeredQuestions
    .flatMap(({ question, pickedChoices }) =>
      getFeedbackForAnsweredQuestionSingle(question, pickedChoices),
    )
    .filter((it) => it.length > 0);
}

/**
 * Generates feedback for a single answered question, combining core and choice-specific feedback
 */
function getFeedbackForAnsweredQuestionSingle(question: Question, pickedChoices: AnswerChoice[]) {
  // Core feedback attached to the entire question rather than a specific choice
  const {
    metadata: { feedback: coreFeedback, impact },
  } = question;

  // Individual feedback potentially attached to specific choices
  const individualFeedback = pickedChoices.map(({ feedback }) => feedback);

  // We want to include core feedback if there is at least one picked choice with sub-optimal weight
  // For questions with benefit impact a non-positive weight is sub-optimal, as higher benefit is desired
  // For questions with risk impact a non-negative weight is sub-optimal, as lower risk is desired
  const shouldIncludeCoreFeedback = pickedChoices.some(
    ({ weight, type }) =>
      type !== "no answer" &&
      ((impact === "benefit" && weight <= 0) || (impact === "risk" && weight >= 0)),
  );
  const feedback = shouldIncludeCoreFeedback
    ? [coreFeedback, ...individualFeedback]
    : individualFeedback;

  return feedback.filter(
    (it): it is NonNullable<typeof coreFeedback> =>
      it !== null && it !== undefined && it.length > 0,
  );
}

/**
 * Groups entries into included/excluded based on answer type
 */
function getEntriesByInclusion(entries: AnswerChoiceWithQuestion[]) {
  return groupBy(entries, ({ choice }) => (choice.type === "no answer" ? "excluded" : "included"));
}

/**
 * Groups entries by their impact type (risk/benefit)
 */
function getEntriesByImpact(entries: AnswerChoiceWithQuestion[]) {
  return groupBy(entries, ({ question }) => question.metadata.impact);
}

/**
 * Converts raw entries into AnsweredQuestion objects, grouping by question
 */
function getAnsweredQuestions(entries: AnswerChoiceWithQuestion[]): AnsweredQuestion[] {
  const entriesByQuestion = groupBy(entries, ({ question }) => question.id);
  return Object.values(entriesByQuestion).map((entries) => ({
    question: entries[0].question,
    pickedChoices: entries.map(({ choice }) => choice),
  }));
}

/**
 * Calculates the total score for a set of answered questions.
 * The score is the sum of the weights of the picked choices.
 */
function getScoreForAnsweredQuestions(answeredQuestions: AnsweredQuestion[]) {
  let score = 0;
  for (const { pickedChoices } of answeredQuestions) {
    for (const choice of pickedChoices) {
      score += choice.weight;
    }
  }
  return score;
}

/**
 * Returns the normalized score between -1 and 1.
 * This normalization enables the comparison of scores across different submissions.
 */
function normalizeScore(score: number, minScore: number, maxScore: number) {
  return ((score - minScore) / (maxScore - minScore)) * 2 - 1;
}

/**
 * Determines the result type based on the normalized scores, as defined by the data solidarity framework.
 */
function determineResultType(scoreRiskNormalized: number, scoreBenefitNormalized: number) {
  const x = scoreRiskNormalized;
  const y = scoreBenefitNormalized;
  if (x > 0 && y > 0) {
    return { id: "C", label: "High risk • High benefit" };
  }
  if (x < 0 && y > 0) {
    return { id: "A", label: "Low risk • High benefit" };
  }
  if (x < 0 && y < 0) {
    return { id: "B", label: "Low risk • Low benefit" };
  }
  if (x > 0 && y < 0) {
    return { id: "D", label: "High risk • Low benefit" };
  }

  return { id: "Neutral", label: "Neutral" };
}
