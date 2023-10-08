<template>
  <main-layout>
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
  </main-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import MarkdownRenderer from '../../components/MarkdownRenderer.vue';
import viewData from './glossary.json';
import { GlossaryViewData, GlossaryViewProps } from './glossary.types';
import MainLayout from '../../components/MainLayout.vue';

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
    MainLayout,
    MarkdownRenderer,
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

.btn-info:focus {
  border-color: $app-green;
  box-shadow: 0 0 0 0.2rem $app-green;
}

.accordion {
  width: 100%;
  max-width: 800px;
}
</style>
