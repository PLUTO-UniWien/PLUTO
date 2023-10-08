<template>
  <div class="glossary">
    <header-component />
    <div class="d-flex flex-column flex-grow-1">
      <main id="intro">
        <markdown-renderer :content="introduction" />
        <div class="accordion mt-2" role="tablist">
          <b-card
            v-for="(item, index) in glossaryItems"
            :key="item.name"
            no-body
            class="mb-1"
          >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                :block="true"
                v-b-toggle="'accordion-' + (index + 1)"
                variant="info"
                class="bg-primary text-left font-weight-bold"
                >{{ item.name }}</b-button
              >
            </b-card-header>
            <b-collapse
              :id="'accordion-' + (index + 1)"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <markdown-renderer :content="item.description" />
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '../../components/Header.vue';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import viewData from './glossary.json';
import { GlossaryViewData, GlossaryViewProps } from './glossary.types';

function getGlossaryViewProps(): GlossaryViewProps {
  const glossaryData = viewData as GlossaryViewData;
  const {
    data: {
      attributes: { introduction, glossaryItems },
    },
  } = glossaryData;
  const glossaryItemsSorted = glossaryItems.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return {
    introduction,
    glossaryItems: glossaryItemsSorted,
  };
}

export default Vue.extend({
  name: 'GlossaryView',
  components: {
    MarkdownRenderer,
    HeaderComponent,
  },
  computed: {
    $mq() {
      return this.$store.state.layout.screenSize;
    },
  },
  data() {
    const { introduction, glossaryItems } = getGlossaryViewProps();
    return {
      introduction,
      glossaryItems,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

.glossary {
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

  .btn-info:focus {
    border-color: $app-green;
    box-shadow: 0 0 0 0.2rem $app-green;
  }

  .accordion {
    width: 100%;
    max-width: 800px;
  }
}
</style>
