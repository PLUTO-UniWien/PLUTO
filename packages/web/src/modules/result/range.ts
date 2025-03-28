import type { AnswerChoice, Question } from "@/modules/survey/types";

/**
 * Returns the minimum and maximum possible cumulative scores for the given array of {@link Question}s.
 *
 * @param questions - An array of {@link Question}s.
 */
export function getScoreRangeForQuestions(questions: Question[]) {
  const minMaxes = questions.map(getMinMaxForQuestion);
  const mins = minMaxes.map(({ min }) => min);
  const maxs = minMaxes.map(({ max }) => max);
  return {
    min: sum(mins),
    max: sum(maxs),
  };
}

/**
 * Returns an array of all combinations of elements from the input array `arr`,
 * where the number of elements in each combination is between `lower` and `upper` inclusive.
 *
 * @param arr - An array of elements from which combinations are to be formed.
 * @param lower - The lower bound for the length of the combinations.
 * @param upper - The upper bound for the length of the combinations.
 * @returns An array of arrays, each sub-array being a combination of elements from `arr`.
 * @template T the type of elements in the array.
 */
function getCombinations<T>(arr: T[], lower: number, upper: number): T[][] {
  let combinations: T[][] = [];
  for (let i = lower; i <= upper; i++) {
    combinations = combinations.concat(combinationsOfLength(arr, i));
  }
  return combinations;
}

/**
 * Returns all combinations of a specific length from the given array.
 *
 * @param arr - An array of elements from which combinations are to be formed.
 * @param len - The specific length of the combinations.
 * @returns An array of arrays, each sub-array being a combination of elements from `arr`.
 * @template T the type of elements in the array.
 */
function combinationsOfLength<T>(arr: T[], len: number): T[][] {
  if (len === 0) return [[]];
  if (arr.length === len) return [arr];

  const combinations: T[][] = [];

  for (let i = 0; i <= arr.length - len; i++) {
    const tailCombinations = combinationsOfLength(arr.slice(i + 1), len - 1);
    for (const tail of tailCombinations) {
      combinations.push([arr[i], ...tail]);
    }
  }
  return combinations;
}

/**
 * Returns the sum of the elements in the array.
 *
 * @param arr - An array of numbers.
 * @returns The sum of the elements in the array.
 */
function sum(arr: number[]) {
  return arr.reduce((acc, n) => acc + n, 0);
}

/**
 * Returns the allowed combinations of {@link AnswerChoice}s for the given lower and upper selection bounds.
 * The following constraints are applied over the combinations:
 *
 * - if the combination contains a {@link AnswerChoice} of type `none`, it must be the only {@link AnswerChoice} in the combination.
 * - if the combination contains a {@link AnswerChoice} of type `otherExclusive`, it must be the only {@link AnswerChoice} in the combination.
 *
 * @param arr - An array of {@link AnswerChoice}s.
 * @param lower - The lower bound for the number of {@link AnswerChoice}s in the combination.
 * @param upper - The upper bound for the number of {@link AnswerChoice}s in the combination.
 */
function getAnswerChoiceCombinations(arr: AnswerChoice[], lower: number, upper: number) {
  function combinationIsValid(combination: AnswerChoice[]) {
    const hasNone = combination.some((choice) => choice.type === "no answer");
    if (hasNone && combination.length > 1) return false;

    const hasOtherExclusive = combination.some((choice) => choice.type === "none of the above");
    if (hasOtherExclusive && combination.length > 1) return false;

    return true;
  }
  return getCombinations(arr, lower, upper).filter(combinationIsValid);
}

function getSums(combinations: number[][]) {
  const sums = combinations.map((combination) => sum(combination));
  return Array.from(new Set(sums));
}

function getAnswerChoiceSums(combinations: AnswerChoice[][]) {
  const weights = combinations.map((combination) => sum(combination.map(({ weight }) => weight)));
  return Array.from(new Set(weights));
}

function getMinMax(arr: number[]) {
  if (arr.length === 0) throw new Error("Cannot get min/max of empty array");
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return { min, max };
}

function getMinMaxForQuestion(question: Question) {
  const {
    choices,
    metadata: { selectionMin: lower, selectionMax: upper },
  } = question;
  const combinations = getAnswerChoiceCombinations(
    choices as unknown as AnswerChoice[],
    lower,
    upper || choices.length,
  );
  const sums = getAnswerChoiceSums(combinations);
  return getMinMax(sums);
}
