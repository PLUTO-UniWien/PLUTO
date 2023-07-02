import { testables } from './survey.calc';
import { AnswerChoice } from './survey.types';
import {
  TEST_QUESTION_MULTI_FEEDBACK,
  TEST_QUESTION_REGULAR,
} from './test-data/survey.test.data';

const {
  getCombinations,
  combinationsOfLength,
  getAnswerChoiceCombinations,
  getSums,
  getMinMax,
  getMinMaxForQuestion,
  getMinMaxForQuestions,
} = testables;

describe('survey.calc', () => {
  describe('getCombinations', () => {
    test('should return correct combinations with provided lower and upper bound', () => {
      const input = [1, 2, 3, 4];
      const lower = 2;
      const upper = 3;
      const expected = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
        [1, 2, 3],
        [1, 2, 4],
        [1, 3, 4],
        [2, 3, 4],
      ];
      expect(getCombinations(input, lower, upper)).toEqual(expected);
    });
  });

  describe('combinationsOfLength', () => {
    test('should return correct combinations of specified length', () => {
      const input = [1, 2, 3, 4];
      const length = 2;
      const expected = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ];
      expect(combinationsOfLength(input, length)).toEqual(expected);
    });
  });

  describe('getAnswerChoiceCombinations', () => {
    test('should return correct combinations of length 1', () => {
      const input: AnswerChoice[] = [
        { type: 'regular' },
        { type: 'regular' },
        { type: 'otherInclusive' },
        { type: 'otherExclusive' },
        { type: 'none' },
      ].map(({ type }, idx) => ({
        type: type as AnswerChoice['type'],
        body: idx.toString(),
        score: idx,
        feedback: null,
      }));
      const lower = 1;
      const upper = 1;
      const expected = [
        [input[0]],
        [input[1]],
        [input[2]],
        [input[3]],
        [input[4]],
      ];
      expect(getAnswerChoiceCombinations(input, lower, upper)).toEqual(
        expected
      );
    });
    test('should return correct combinations of length 2', () => {
      const input: AnswerChoice[] = [
        { type: 'regular' },
        { type: 'regular' },
        { type: 'otherInclusive' },
        { type: 'otherExclusive' },
        { type: 'none' },
      ].map(({ type }, idx) => ({
        type: type as AnswerChoice['type'],
        body: idx.toString(),
        score: idx,
        feedback: null,
      }));
      const lower = 1;
      const upper = 2;
      const expected = [
        [input[0]],
        [input[1]],
        [input[2]],
        [input[3]],
        [input[4]],
        [input[0], input[1]],
        [input[0], input[2]],
        [input[1], input[2]],
      ];
      expect(getAnswerChoiceCombinations(input, lower, upper)).toEqual(
        expected
      );
    });
    test('should return correct combinations of length 3', () => {
      const input: AnswerChoice[] = [
        { type: 'regular' },
        { type: 'otherInclusive' },
        { type: 'otherExclusive' },
        { type: 'none' },
      ].map(({ type }, idx) => ({
        type: type as AnswerChoice['type'],
        body: idx.toString(),
        score: idx,
        feedback: null,
      }));
      const lower = 1;
      const upper = 3;
      const expected = [
        [input[0]],
        [input[1]],
        [input[2]],
        [input[3]],
        [input[0], input[1]],
      ];
      expect(getAnswerChoiceCombinations(input, lower, upper)).toEqual(
        expected
      );
    });
    test('should return correct combinations of length 4', () => {
      const input: AnswerChoice[] = [
        { type: 'regular' },
        { type: 'regular' },
        { type: 'regular' },
        { type: 'none' },
      ].map(({ type }, idx) => ({
        type: type as AnswerChoice['type'],
        body: idx.toString(),
        score: idx,
        feedback: null,
      }));
      const lower = 1;
      const upper = 3;
      const expected = [
        [input[0]],
        [input[1]],
        [input[2]],
        [input[3]],
        [input[0], input[1]],
        [input[0], input[2]],
        [input[1], input[2]],
        [input[0], input[1], input[2]],
      ];
      expect(getAnswerChoiceCombinations(input, lower, upper)).toEqual(
        expected
      );
    });
  });

  describe('getSums', () => {
    it('returns an array with the sum of each sub-array', () => {
      const input = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const output = getSums(input);
      expect(output).toEqual([6, 15, 24]);
    });

    it('returns an array without duplicates', () => {
      const input = [
        [1, 2, 3],
        [2, 1, 3],
        [4, 5, 6],
        [6, 4, 5],
      ];
      const output = getSums(input);
      expect(output).toEqual([6, 15]);
    });

    it('returns an empty array when the input is an empty array', () => {
      const input: number[][] = [];
      const output = getSums(input);
      expect(output).toEqual([]);
    });

    it('returns [0] when the input contains only an empty sub-array', () => {
      const input = [[]];
      const output = getSums(input);
      expect(output).toEqual([0]);
    });
  });

  describe('getMinMax', () => {
    it('returns the correct min and max values', () => {
      const input = [1, 2, 3, 4, 5];
      const output = getMinMax(input);
      expect(output).toEqual({ min: 1, max: 5 });
    });

    it('returns correct values when all values are the same', () => {
      const input = [2, 2, 2, 2, 2];
      const output = getMinMax(input);
      expect(output).toEqual({ min: 2, max: 2 });
    });

    it('returns correct values when negative values are included', () => {
      const input = [-1, -2, 3, 4];
      const output = getMinMax(input);
      expect(output).toEqual({ min: -2, max: 4 });
    });

    it('throws an error when the array is empty', () => {
      const input: number[] = [];
      expect(() => getMinMax(input)).toThrow();
    });
  });

  describe('getMinMaxForQuestion', () => {
    test('returns the correct min and max values for single-choice question', () => {
      const question = TEST_QUESTION_REGULAR;

      const expectedResult = {
        min: -1,
        max: 2,
      };

      const result = getMinMaxForQuestion(question);
      expect(result).toEqual(expectedResult);
    });

    test('returns the correct min and max values for multi-choice question', () => {
      const question = TEST_QUESTION_MULTI_FEEDBACK;

      const expectedResult = {
        min: -2,
        max: 8,
      };

      const result = getMinMaxForQuestion(question);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMinMaxForQuestions', () => {
    test('returns the sum of min and max values for the questions', () => {
      const questions = [TEST_QUESTION_REGULAR, TEST_QUESTION_MULTI_FEEDBACK];

      const expectedResult = {
        min: -3,
        max: 10,
      };

      const result = getMinMaxForQuestions(questions);
      expect(result).toEqual(expectedResult);
    });
  });
});
