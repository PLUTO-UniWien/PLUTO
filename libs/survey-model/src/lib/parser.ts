import { Question, Survey, SurveyGroup } from './survey.types';
import { StrapiResponseCollection } from './base.types';

export function parseSurvey(surveyData: object): Survey {
  const rawData = surveyData as StrapiResponseCollection<{
    version: Survey['version'];
    groups: {
      title: SurveyGroup['title'];
      questions: StrapiResponseCollection<Question>;
    }[];
  }>;
  const { data } = rawData;
  const {
    id,
    attributes: { version, groups },
  } = data[0];
  const parsedGroups = groups.map(({ title, questions }) => {
    const parsedQuestions = questions.data.map(({ id, attributes }) => {
      const { label, body, choices, metadata } = attributes;
      return { id, label, body, choices, metadata };
    });
    return { title, questions: parsedQuestions };
  });
  return { id, version, groups: parsedGroups };
}
