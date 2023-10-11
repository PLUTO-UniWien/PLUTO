<template>
  <survey :survey="survey" id="surveyElement" />
</template>

<script lang="ts">
import Vue from 'vue';
import { Survey } from 'survey-vue-ui';
import { StylesManager, Model, SurveyModel } from 'survey-core';
import 'survey-core/defaultV2.min.css';
StylesManager.applyTheme('defaultV2');

import { SurveyProps } from './survey.types';
import { surveyModel } from '@pluto/survey-model';
import { AfterRenderQuestionEvent } from 'survey-core/typings/survey-events-api';
import {
  addExplanationInfoBox,
  addPreviewModeButtonToQuestion,
  moveNoneOptionToBottom,
  transformPlainSurveyData,
} from './survey.utils';

function getSurveyProps(): SurveyProps {
  return {
    surveyModelRaw: surveyModel(),
  };
}

export default Vue.extend({
  name: 'SurveyView',
  components: {
    Survey,
  },
  data(): { survey: Model } {
    const { surveyModelRaw } = getSurveyProps();

    const survey = new Model(surveyModelRaw);
    survey.onComplete.add((surveyModel: SurveyModel) => {
      this.$router.push('/result');
      const payload = transformPlainSurveyData(surveyModel.getPlainData());
      this.$store.dispatch('survey/resetState');
      this.$store.dispatch('result/updateResult', payload);
      this.$store.dispatch('submission/submitResult', payload);
    });
    survey.onAfterRenderQuestion.add(
      (surveyModel: SurveyModel, event: AfterRenderQuestionEvent) => {
        const question = event.question;
        moveNoneOptionToBottom(question);
        addExplanationInfoBox(question);
      }
    );
    survey.onAfterRenderQuestion.add((surveyModel: SurveyModel) => {
      if (this.$store.state.survey.inPreviewMode) {
        addPreviewModeButtonToQuestion(surveyModel);
      }
    });
    survey.onCurrentPageChanged.add((surveyModel: SurveyModel) => {
      const payload = surveyModel.currentPageNo + 1;
      this.$store.dispatch('survey/updateCurrentPage', payload);
    });
    survey.onShowingPreview.add(() => {
      this.$store.dispatch('survey/updateInPreviewMode', true);
    });

    return {
      survey,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

#surveyElement {
  --primary: #3e85c7;
  --background: #ffffff;
  --background-dim: #f3f3f3;
  --background-dim-light: #f9f9f9;
  --primary-foreground: #ffffff;
  --foreground: #161616;
  --base-unit: 8px;

  .sd-root-modern {
    min-height: 100vh;
  }
  .sd-question__header,
  .sd-selectbase {
    text-align: left;
  }
}
</style>
