<template>
  <div class="result-export">
    <router-link to="/">
      <b-row
        class="bg-app-green d-flex justify-content-center align-items-center py-2 py-md-4"
      >
        <b-img
          src="/logo/logo-pluto.png"
          alt="Logo of PLUTO"
          fluid
          class="logo"
          width="150px"
        />
        <b-img
          src="/logo/logo-digitize.png"
          alt="Logo of Digizize! Computational Social Sciences"
          fluid
          class="logo"
          width="150px"
        />
        <b-img
          src="/logo/logo-uniwien.png"
          alt="Logo of the University of Vienna, Insitute of Political Sciences"
          fluid
          class="logo"
          width="150px"
        />
      </b-row>
    </router-link>
    <h1>Your results</h1>
    <p class="font-italic">
      You have answered {{ countAnswered }} out of {{ countTotal }} questions.
    </p>
    <p class="font-italic mx-2">
      {{ countAnsweredRisks || 'None' }} of your answers impact the riskiness
      rating and {{ countAnsweredBenefits || 'none' }} of your answers influence
      the benefit rating in your result.
    </p>
    <div class="plot-container my-4">
      <result-plot
        root-id="resultExport"
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
      />
    </div>
    <div class="feedback-container my-2">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ResultPlot from '../../components/ResultPlot.vue';
import FeedbackList from '../../components/FeedbackList.vue';
import { SurveyResultAnalysis } from '@pluto/survey-model';
import { scoreTooltipLabel } from './result.utils';

export default Vue.extend({
  name: 'ResultExport',
  methods: { scoreTooltipLabel },
  components: {
    ResultPlot,
    FeedbackList,
  },
  data() {
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
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

.logo {
  margin: 0 1.25rem;
}

.result-export {
  @extend .d-flex;
  @extend .flex-column;
  width: 595px;
  background: $body-bg;

  h1 {
    @extend .py-2;
    @extend .px-2;
    font-size: 1.75rem;
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
    }
  }

  .feedback-container {
    @extend .mx-auto;
    max-width: 95vw;
    width: 90%;
  }
}
</style>
