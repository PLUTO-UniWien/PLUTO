<template>
  <div class="home">
    <HeaderComponent />
    <div class="d-flex flex-column flex-grow-1">
      <main id="intro">
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
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '../../components/Header.vue';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import viewData from './home.json';
import { HomeViewData, HomeViewProps } from './home.types';

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
    MarkdownRenderer,
    HeaderComponent,
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

.home {
  min-height: calc(100vh - 2rem);
  @extend .d-flex;
  @extend .flex-column;
}

#intro {
  @extend .flex-grow-1;
  @extend .d-flex;
  @extend .flex-column;
  @extend .align-items-center;
  @extend .shadow-lg;
  @extend .bg-white;
  @extend .text-justify;
  @extend .mx-auto;

  padding: 1rem 2.5rem;

  max-width: 800px;
  h1 {
    @extend .py-2;
    text-align: center;
    color: $primary;
  }

  .start-btn-container {
    margin: 0.5rem 0;
  }
}

#contributors {
  @extend .mt-5;
  color: gray;
  // smaller font size
  @extend .small;
}
</style>
