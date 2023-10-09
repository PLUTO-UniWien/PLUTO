<template>
  <div>
    <div class="result">
      <header-component />
      <h1>{{ resultsReadyLabel }}</h1>
      <div class="cursor-pointer">
        <b-button variant="primary" class="mb-4 w-4" @click="generatePDF">
          <span v-if="isExporting"
            >Export in progress <b-spinner type="grow" small label="Spinning"
          /></span>
          <span v-else>Export results</span>
        </b-button>
      </div>
      <p class="font-italic">
        You have answered {{ countAnswered }} out of {{ countTotal }} questions.
      </p>
      <p class="font-italic">
        {{ countAnsweredRisks || 'None' }} of your answers impact the riskiness
        rating and {{ countAnsweredBenefits || 'none' }} of your answers
        influence the benefit rating in your result.
      </p>
      <div class="plot-container">
        <b-tooltip target="resultPoint" triggers="hover">
          <div class="d-flex flex-column text-left">
            <span>Risk: {{ scoreTooltipLabel(scoreRisks) }}</span>
            <span>Benefit: {{ scoreTooltipLabel(scoreBenefits) }}</span>
          </div>
        </b-tooltip>
        <result-plot
          :x-lower-bound="-1"
          :x-upper-bound="1"
          :y-lower-bound="-1"
          :y-upper-bound="1"
          :point-coordinate="[
            isNaN(scoreRisks) ? 0 : scoreRisks,
            isNaN(scoreBenefits) ? 0 : scoreBenefits,
          ]"
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
        <feedback-list
          v-if="!!feedbackItemsBenefits.length"
          :title="feedbackTitleBenefits"
          :items="feedbackItemsBenefits"
        />
        <feedback-list
          v-if="!!feedbackItemsRisks.length"
          :title="feedbackTitleRisks"
          :items="feedbackItemsRisks"
        />
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
    <div class="bottom">
      <submission-progress-indicator
        class="bottom"
        :submit-error="submitError"
        :submit-success="submitSuccess"
        :submitting="submitting"
      />
    </div>
    <div class="result-export-container" ref="resultExportContainer">
      <result-export />
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
import { SurveyResultAnalysis } from '@pluto/survey-model';
import { mapGetters } from 'vuex';
import SubmissionProgressIndicator from '../../components/SubmissionProgressIndicator.vue';
import { scoreTooltipLabel } from './result.utils';
import ResultExport from './ResultExport.vue';
import { generatePDFExport } from './result-export.utils';

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
  methods: {
    scoreTooltipLabel,
    generatePDF() {
      this.isExporting = true;
      setTimeout(() => {
        const content = this.$refs.resultExportContainer as HTMLElement;
        generatePDFExport(content).finally(() => {
          this.isExporting = false;
        });
      }, 0);
    },
  },
  components: {
    ResultExport,
    SubmissionProgressIndicator,
    MarkdownRenderer,
    HeaderComponent,
    ResultPlot,
    FeedbackList,
  },
  computed: {
    ...mapGetters('submission', ['submitting', 'submitSuccess', 'submitError']),
  },
  data() {
    const tooltipElementId = 'resultPointTooltip';
    const { resultsReadyLabel, explanation, feedback } = getResultViewProps();

    const {
      feedback: { x: feedbackItemsRisks, y: feedbackItemsBenefits },
      scoreNormalized: { x: scoreRisks, y: scoreBenefits },
      counts: {
        included: { x: countAnsweredBenefits, y: countAnsweredRisks },
        total: { x: countTotalBenefits, y: countTotalRisks },
      },
    } = this.$store.getters['result/resultAnalysis'] as SurveyResultAnalysis;

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
      scoreBenefits,
      scoreRisks,
      countAnsweredBenefits,
      countAnsweredRisks,
      countAnswered: countAnsweredBenefits + countAnsweredRisks,
      countTotalBenefits,
      countTotalRisks,
      countTotal: countTotalBenefits + countTotalRisks,
      isExporting: false,
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
      width: 80%;
      @media (min-width: map-get($grid-breakpoints, sm)) {
        width: 70%;
      }
      @media (min-width: map-get($grid-breakpoints, md)) {
        width: 60%;
      }
      @media (min-width: map-get($grid-breakpoints, lg)) {
        width: 50%;
      }
      @media (min-width: map-get($grid-breakpoints, xl)) {
        width: 33%;
      }
    }
  }

  .feedback-container {
    @extend .mx-auto;
    max-width: 92.5vw;

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

.bottom {
  position: sticky;
  bottom: 0;
  z-index: 1000;
}

.result-export-container {
  position: absolute;
  left: -10000px;
  top: -10000px;
}
</style>
