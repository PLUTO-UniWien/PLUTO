<template>
  <main-layout>
    <markdown-renderer :content="content" />
    <div class="start-btn-container">
      <b-button
        variant="primary"
        @click="startSurvey"
        :size="$mq === 'xs' || $mq === 'sm' ? 'md' : 'lg'"
        >{{ launchButtonText }}</b-button
      >
    </div>
    <div class="flex-grow-1"></div>
    <footer id="contributors">
      <markdown-renderer :content="contributorsInfo" />
    </footer>
  </main-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import viewData from './home.json';
import { HomeViewData, HomeViewProps } from './home.types';
import MainLayout from '../../components/MainLayout.vue';

function getHomeViewProps(): HomeViewProps {
  const homeData = viewData as HomeViewData;
  const {
    data: {
      attributes: { content, launchButtonText, contributorsInfo },
    },
  } = homeData;
  return {
    content,
    launchButtonText,
    contributorsInfo,
  };
}

export default Vue.extend({
  name: 'HomeView',
  components: {
    MainLayout,
    MarkdownRenderer,
  },
  computed: {
    $mq() {
      return this.$store.state.layout.screenSize;
    },
  },
  methods: {
    startSurvey() {
      this.$router.push('/survey');
    },
  },
  data() {
    const { content, launchButtonText, contributorsInfo } = getHomeViewProps();
    return {
      content,
      launchButtonText,
      contributorsInfo,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

.start-btn-container {
  margin: 1rem 0;
}

#contributors {
  @extend .mt-5;
  color: gray;
  // smaller font size
  @extend .small;
}
</style>
