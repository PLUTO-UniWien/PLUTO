<template>
  <main-layout>
    <h1>{{ title }}</h1>
    <markdown-renderer class="mt-2" :content="introduction" />
    <div id="history-content">
      <markdown-renderer class="mt-2" :content="historyContent" />
    </div>
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
      attributes: { title, introduction, historyContent },
    },
  } = data;
  return {
    title,
    introduction,
    historyContent,
  };
}

export default Vue.extend({
  name: 'WeightingHistoryView',
  components: { MainLayout, MarkdownRenderer },
  data() {
    const { title, introduction, historyContent } = getViewProps();
    return {
      title,
      introduction,
      historyContent,
    };
  },
  mounted() {
    const tableRows = document
      .getElementById('history-content')
      ?.querySelectorAll('tbody tr');
    const tableRowElements = Array.from(tableRows ?? []);
    for (const tableRow of tableRowElements) {
      const tableCells = tableRow.querySelectorAll('td');
      const firstCell = tableCells.item(0);
      const secondCell = tableCells.item(1);
      const thirdCell = tableCells.item(2);
      const lastCellsEmpty =
        !secondCell?.innerHTML.trim() && !thirdCell?.innerHTML.trim();
      if (lastCellsEmpty) {
        tableRow.removeChild(secondCell);
        tableRow.removeChild(thirdCell);
        firstCell.setAttribute('colspan', '3');
      }
    }
  },
});
</script>

<style lang="scss">
@import '../../styles/bootstrap';

table {
  @extend .table;
  @extend .table-hover;

  background-color: #f8f9fa;
  border: 1px solid #dee2e6;

  th,
  td {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;

    &:last-child {
      border-right: 1px solid #dee2e6;
    }
  }

  thead {
    th {
      @extend .text-uppercase;
      background-color: $primary;
      color: #f8f9fa;
      border-bottom-width: 2px;
    }
  }

  tbody {
    tr:hover {
      background-color: rgba(52, 58, 64, 0.05);
    }

    td {
      vertical-align: middle;
    }
  }
}
</style>
