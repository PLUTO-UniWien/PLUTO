<template>
  <main-layout>
    <h1>{{ title }}</h1>
    <markdown-renderer class="mt-2" :content="introduction" />
  </main-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import MainLayout from '../../components/MainLayout.vue';
import viewData from './weighting-history.json';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import {
  WeightingHistoryViewData,
  WeightingHistoryViewProps,
} from './weighting-history.types';

function getViewProps(): WeightingHistoryViewProps {
  const data = viewData as WeightingHistoryViewData;
  const {
    data: {
      attributes: { title, introduction },
    },
  } = data;
  return {
    title,
    introduction,
  };
}

export default Vue.extend({
  name: 'WeightingHistoryView',
  components: { MainLayout, MarkdownRenderer },
  data() {
    const { title, introduction } = getViewProps();
    return {
      title,
      introduction,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';
</style>
