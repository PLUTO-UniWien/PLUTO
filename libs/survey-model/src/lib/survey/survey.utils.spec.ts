import { testables } from './survey.utils';

const { normalizeScore } = testables;

describe('survey utilities', () => {
  describe('normalizeScore', () => {
    it('should correctly normalize a score', () => {
      const score = 5;
      const minScore = 0;
      const maxScore = 10;
      const expected = 0.5;

      const result = normalizeScore(score, minScore, maxScore);
      expect(result).toEqual(expected);
    });

    it('should return 0 for minimum score', () => {
      const score = 0;
      const minScore = 0;
      const maxScore = 10;

      const result = normalizeScore(score, minScore, maxScore);
      expect(result).toEqual(0);
    });

    it('should return 1 for maximum score', () => {
      const score = 10;
      const minScore = 0;
      const maxScore = 10;

      const result = normalizeScore(score, minScore, maxScore);
      expect(result).toEqual(1);
    });
  });
});
