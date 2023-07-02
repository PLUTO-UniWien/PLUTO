import surveyStats from './generated/survey-stats.json';

const { scoreRanges } = surveyStats;

type ScoreRange = {
  min: number;
  max: number;
};

export const STAT_SCORE_RANGES: Record<'x' | 'y', ScoreRange> = scoreRanges;
