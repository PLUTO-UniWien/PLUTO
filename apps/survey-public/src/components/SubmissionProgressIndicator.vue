<template>
  <b-alert :show="shouldDisplay" :variant="variant" dismissible>
    <div v-if="submitting" class="d-flex justify-content-around items-center">
      <span>Submitting results...</span>
      <b-spinner type="grow" label="Spinning" />
    </div>
    <template v-if="submitSuccess">Submission succeeded!</template>
    <template v-else-if="submitError">{{ submitError }}</template>
  </b-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SubmissionProgressIndicator',
  props: {
    submitting: {
      type: Boolean,
      required: true,
    },
    submitSuccess: {
      type: Boolean,
      required: true,
    },
    submitError: {
      type: String,
      default: null,
    },
  },
  computed: {
    shouldDisplay(): boolean {
      const inDefaultState =
        !this.submitting && !this.submitSuccess && this.submitError === null;
      return !inDefaultState && !this.isAlertDismissed;
    },
    variant(): string {
      return this.submitSuccess
        ? 'success'
        : this.submitError
        ? 'danger'
        : 'info';
    },
  },
  methods: {
    dismissAlert() {
      this.isAlertDismissed = true;
    },
  },
  mounted() {
    setTimeout(() => {
      this.dismissAlert();
    }, 7500);
  },
  data() {
    return {
      isAlertDismissed: false,
    };
  },
});
</script>
