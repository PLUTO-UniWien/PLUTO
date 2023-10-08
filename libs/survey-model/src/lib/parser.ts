import { Question, Survey, SurveyGroup } from './survey/survey.types';
import { StrapiResponseCollection } from './base.types';

/**
 * Utility method to extract a {@link Survey} from a Strapi response.
 * Always returns the first survey in the response.
 *
 * @param surveyData - The Strapi raw JSON response of Strapi's `/api/surveys` endpoint.
 */
export function parseSurvey(surveyData: object): Survey {
  const rawData = surveyData as StrapiResponseCollection<{
    version: Survey['version'];
    groups: {
      title: SurveyGroup['title'];
      questions: StrapiResponseCollection<Question>;
    }[];
  }>;
  const { data } = rawData;

  // Picking the first survey in the response.
  const {
    id,
    attributes: { version, groups },
  } = data[0];

  const parsedGroups = groups.map(({ title, questions }) => {
    const parsedQuestions = questions.data.map(({ id, attributes }) => {
      const { label, body, explanation, choices, metadata } = attributes;
      return { id, label, body, explanation, choices, metadata };
    });
    return { title, questions: parsedQuestions };
  });
  return { id, version, groups: parsedGroups };
}
