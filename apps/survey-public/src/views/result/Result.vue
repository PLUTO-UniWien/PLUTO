<template>
  <div class="result">
    <HeaderComponent />
    <h1>{{ resultsReadyLabel }}</h1>
    <div class="plot-container">
      <b-tooltip target="resultPoint" triggers="hover">
        <div class="d-flex flex-column text-left">
          <span>Risk: {{ 0.5 }}</span>
          <span>Benefit: {{ 0.75 }}</span>
        </div>
      </b-tooltip>
      <ResultPlot
        :x-lower-bound="-1"
        :x-upper-bound="1"
        :y-lower-bound="-1"
        :y-upper-bound="1"
        :point-coordinate="[0.5, 0.75]"
        :quadrant-labels="[
          'High benefit',
          'High risk',
          'Low risk',
          'Low benefit',
        ]"
        :tooltip-element-id="tooltipElementId"
      />
    </div>
    <div class="feedback-container">
      <FeedbackList
        :title="feedbackTitleBenefits"
        :items="feedbackItemsBenefits"
      />
      <FeedbackList :title="feedbackTitleRisks" :items="feedbackItemsRisks" />
    </div>
    <div class="content-container">
      <main>
        <article>
          <markdown-renderer :content="explanation" />
        </article>
        <article>
          <markdown-renderer :content="feedback" />
        </article>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '../../components/Header.vue';
import { ResultViewData, ResultViewProps } from './result.types';
import viewData from './result.json';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import ResultPlot from '../../components/ResultPlot.vue';
import FeedbackList from '../../components/FeedbackList.vue';
function getResultViewProps(): ResultViewProps {
  const resultData = viewData as ResultViewData;
  const {
    data: {
      attributes: { resultsReadyLabel, explanation, feedback },
    },
  } = resultData;
  return {
    resultsReadyLabel,
    explanation,
    feedback,
  };
}

export default Vue.extend({
  name: 'ResultView',
  components: { MarkdownRenderer, HeaderComponent, ResultPlot, FeedbackList },
  data() {
    const tooltipElementId = 'resultPointTooltip';
    const { resultsReadyLabel, explanation, feedback } = getResultViewProps();

    const { feedbackX: feedbackItemsBenefits, feedbackY: feedbackItemsRisks } =
      this.$store.getters['result/resultFeedback'];

    const feedbackTitleBenefits =
      'The benefits of the data use would be higher...';
    const feedbackTitleRisks = 'The risks of the data use would be lower...';

    return {
      resultsReadyLabel,
      explanation,
      feedback,
      tooltipElementId,
      feedbackTitleBenefits,
      feedbackItemsBenefits,
      feedbackTitleRisks,
      feedbackItemsRisks,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

.result {
  @extend .d-flex;
  @extend .flex-column;

  h1 {
    @extend .py-4;
    @extend .px-2;
    font-size: 2rem;
  }

  .plot-container {
    @extend .d-flex;
    @extend .flex-column;
    @extend .justify-content-center;
    @extend .align-items-center;
    @extend .pb-4;

    #resultPlot {
      display: block;
      width: 75%;
      @media (min-width: map-get($grid-breakpoints, sm)) {
        width: 50%;
      }
      @media (min-width: map-get($grid-breakpoints, xl)) {
        width: 25%;
      }
    }
  }

  .feedback-container {
    @extend .mx-auto;
    max-width: 100vw;
    @media (min-width: map-get($grid-breakpoints, sm)) {
      width: 75vw;
    }
    @media (min-width: map-get($grid-breakpoints, md)) {
      width: 60vw;
    }
    @media (min-width: map-get($grid-breakpoints, lg)) {
      width: 50vw;
    }
    @media (min-width: map-get($grid-breakpoints, xl)) {
      width: 25vw;
    }
    margin: auto;
  }

  .content-container {
    @extend .bg-white;

    main {
      @extend .d-flex;
      @extend .flex-column;
      @extend .align-items-center;
      @extend .text-justify;
      @extend .mx-auto;

      padding: 1rem 2.5rem;

      max-width: 800px;

      h3 {
        @extend .py-2;
        color: $primary;
      }

      h4 {
        font-size: 1.3rem;
      }
    }
  }
}
</style>
