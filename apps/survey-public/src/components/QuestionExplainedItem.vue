<template>
  <div class="question-explained-item p-4 border rounded">
    <h6>
      <strong>{{ label }}</strong
      >. {{ body }}
    </h6>
    <p class="mt-2 text-muted">{{ explanation }}</p>
    <p><strong>Impact:</strong> {{ metadata.impact }}</p>
    <ul class="list-group mt-2">
      <li
        v-for="(choice, index) in choices"
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span class="mr-4">{{ choice.body }}</span>
        <span
          class="badge"
          :class="
            choice.score > 0
              ? 'badge-success'
              : choice.score < 0
              ? 'badge-danger'
              : 'badge-secondary'
          "
          >{{
            (choice.score > 0 ? '+' : '') +
            (choice.score == 0 ? '&nbsp;' : '') +
            choice.score
          }}</span
        >
      </li>
    </ul>
    <p class="mt-4">
      <strong>Explanation:</strong> {{ weightingAppendixDescription }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { AnswerChoice, QuestionMetadata } from '@pluto/survey-model';

export default Vue.extend({
  name: 'QuestionExplainedItem',
  props: {
    label: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    choices: {
      type: Array as unknown as () => AnswerChoice[],
      required: true,
    },
    metadata: {
      type: Object as unknown as () => QuestionMetadata,
      required: true,
    },
    weightingAppendixDescription: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
@import '../styles/bootstrap';

.question-explained-item {
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  font-family: 'Roboto Mono', monospace;
}
</style>
