<template>
  <main-layout>
    <markdown-renderer :content="introduction" />
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
  components: { MainLayout, MarkdownRenderer },
  data() {
    const { introduction } = getAppendixWeightingViewProps();
    return {
      introduction,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';
</style>
