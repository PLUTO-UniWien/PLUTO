<template>
  <div class="ml-3">
    <div id="question-info-box"></div>
    <i :id="popoverId" aria-describedby="popoverId">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide-info"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </i>
    <b-popover
      :target="popoverId"
      triggers="click"
      placement="top"
      container="question-info-box"
    >
      <markdown-renderer :content="explanation" />
    </b-popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MarkdownRenderer from './MarkdownRenderer.vue';

export default defineComponent({
  name: 'QuestionInfoBox',
  components: { MarkdownRenderer },
  props: {
    explanation: {
      type: String,
      required: true,
    },
  },
  setup() {
    const popoverId = ref(`popover-id`);
    return { popoverId };
  },
});
</script>

<style lang="scss">
@import '../styles/bootstrap.scss';
.lucide-info {
  color: $primary;
  cursor: pointer;
}
.popover {
  max-width: 85vw !important;
}
</style>
