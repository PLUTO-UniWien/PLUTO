<template>
  <div class="d-flex flex-column justify-content-center items-center">
    <h5 class="mb-3 text-justify">{{ title }}</h5>
    <ul class="text-justify">
      <li class="mb-2" v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FeedbackList',
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array as unknown as () => string[],
      required: true,
    },
  },
});
</script>
