<template>
  <main-layout>
    <h1>{{ title }}</h1>
    <markdown-renderer class="mt-2" :content="introduction" />
    <div
      class="mt-4"
      v-for="(group, groupIdx) in survey.groups"
      :key="'group-' + groupIdx"
    >
      <h4>{{ group.title }}</h4>
      <div
        v-for="(question, questionIdx) in group.questions"
        :key="'question-' + questionIdx"
        class="my-2"
      >
        <question-explained-item
          :weighting-appendix-description="
            question.weightingAppendixDescription || ''
          "
          :metadata="question.metadata"
          :choices="question.choices"
          :explanation="question.explanation || ''"
          :body="question.body"
          :label="getQuestionLabel(question)"
        />
      </div>
    </div>
  </main-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import MainLayout from '../../components/MainLayout.vue';
import viewData from './appendix-weighting.json';
import {
  AppendixWeightingViewData,
  AppendixWeightingViewProps,
} from './appendix-weighting.types';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import { CURRENT_SURVEY, Question, questionLabel } from '@pluto/survey-model';
import QuestionExplainedItem from '../../components/QuestionExplainedItem.vue';

function getAppendixWeightingViewProps(): AppendixWeightingViewProps {
  const appendixWeightingData = viewData as AppendixWeightingViewData;
  const {
    data: {
      attributes: { title, introduction },
    },
  } = appendixWeightingData;
  return {
    title,
    introduction,
  };
}

export default Vue.extend({
  name: 'AppendixWeightingView',
  methods: {
    getQuestionLabel(question: Question) {
      const questionIdx = this.questions.indexOf(question);
      return questionLabel(questionIdx + 1);
    },
  },
  components: { QuestionExplainedItem, MainLayout, MarkdownRenderer },
  data() {
    const { title, introduction } = getAppendixWeightingViewProps();
    const questions = CURRENT_SURVEY.groups.flatMap((group) => group.questions);
    return {
      title,
      introduction,
      survey: CURRENT_SURVEY,
      questions,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';
</style>
