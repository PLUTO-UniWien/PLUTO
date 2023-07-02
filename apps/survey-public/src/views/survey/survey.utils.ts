import { Question as SurveyQuestion, SurveyModel } from 'survey-core';
import {
  questionByName,
  Question,
  getQuestionHasNone,
  ResultItem,
  SubmissionMetadata,
  SurveyResult,
  choiceLabelForSpecialOption,
  choiceByLabel,
  SURVEY_VERSION,
} from '@pluto/survey-model';
import { IQuestionPlainData } from 'survey-core/typings/question';

function surveyQuestionToQuestion(surveyQuestion: SurveyQuestion): Question {
  const questionName = surveyQuestion.getPlainData().name.toString();
  return questionByName(questionName);
}

export function moveNoneOptionToBottom(surveyQuestion: SurveyQuestion) {
  const question = surveyQuestionToQuestion(surveyQuestion);
  const questionHasNone = getQuestionHasNone(question);
  // move the none option to the bottom of the list
  if (questionHasNone) {
    const noneOption = surveyQuestion.visibleChoices.filter(
      (choice: { value: string }) => choice.value === 'none'
    )[0];
    const noneIndex = surveyQuestion.visibleChoices.indexOf(noneOption);
    surveyQuestion.visibleChoices.splice(noneIndex, 1);
    surveyQuestion.visibleChoices.push(noneOption);
  }
}

export function transformPlainSurveyData(
  plainData: IQuestionPlainData[]
): SurveyResult {
  const survey = SURVEY_VERSION;
  const items = plainData.flatMap(plainDataItemToResultItems);
  const metadata = getSubmissionMetadata();
  return { survey, items, metadata };
}

function getSubmissionMetadata(): SubmissionMetadata {
  return {
    userAgent: navigator.userAgent,
  };
}

function plainDataItemToResultItems(
  plainDataItem: IQuestionPlainData
): ResultItem[] {
  const question = questionByName(plainDataItem.name.toString());
  if (!plainDataItem.data) {
    throw new Error(`Question ${question.label} has no data`);
  }
  return plainDataItem.data.map(
    ({ value, displayValue }: { value: string; displayValue: string }) => {
      const choiceId =
        value === 'other' || value === 'none'
          ? choiceLabelForSpecialOption(question, value)
          : value;
      const answerChoice = choiceByLabel(question, choiceId);
      return {
        question: question.id,
        choice: choiceId,
        value: displayValue,
        type: answerChoice.type,
        score: answerChoice.score,
        impact: question.metadata.impact,
      };
    }
  );
}

const SurveyPreviewModeButton = `
<div id="sv-nav-preview" class="sv-action">
  <div class="sv-action__content">
    <input type="button" value="Preview" title="Preview" class="sd-btn sd-navigation__preview-btn">
  </div>
</div>
`;

export function addPreviewModeButtonToQuestion(surveyModel: SurveyModel) {
  // We only want to add the preview button if we are not at the page where the complete button is displayed
  const completeButtonDisplayed =
    document.querySelector('.sd-navigation__complete-btn') !== null;
  if (completeButtonDisplayed) {
    return;
  }
  // Otherwise we add the preview button
  const elementToReplace = document.getElementById('sv-nav-preview');
  if (elementToReplace) {
    elementToReplace.outerHTML = SurveyPreviewModeButton;
    // set the click handler
    const previewButton = document.getElementById('sv-nav-preview');
    if (previewButton) {
      previewButton.addEventListener('click', () => {
        surveyModel.showPreview();
      });
    }
  }
}
