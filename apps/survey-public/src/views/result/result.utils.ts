import * as d3 from 'd3';
import { formatScore } from '@pluto/survey-model';

/**
 * Returns the label for the score tooltip.
 * If the score is not NaN, the score is rounded to 2 decimals.
 * Otherwise, a string 'N/A' is returned.
 *
 * @param score - The score to get the label for.
 * @returns {string} - The label for the score.
 */
export function scoreTooltipLabel(score: number) {
  return isNaN(score) ? 'N/A' : formatScore(score);
}
