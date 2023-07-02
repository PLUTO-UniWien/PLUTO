<template>
  <div v-html="renderedContent" />
</template>

<script lang="ts">
import Vue from 'vue';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';

marked.use(mangle());
marked.use(gfmHeadingId({}));
export default Vue.extend({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    renderedContent(): string {
      // Transform Markdown to HTML
      const markdownHtml = marked.parse(this.content);
      // Sanitize the HTML
      return DOMPurify.sanitize(markdownHtml);
    },
  },
});
</script>
