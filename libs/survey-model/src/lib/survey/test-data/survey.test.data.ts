import surveyData from './survey.json';
import resultData from './result.json';
import { parseSurvey } from '../../parser';
import { SurveyResult } from '../survey.types';

const TEST_SURVEY = parseSurvey(surveyData);
const questions = TEST_SURVEY.groups.flatMap((group) => group.questions);
export const TEST_QUESTION_REGULAR = questions[3];
export const TEST_QUESTION_MULTI_FEEDBACK = questions[6];
export const TEST_SURVEY_RESULT = resultData as SurveyResult;
