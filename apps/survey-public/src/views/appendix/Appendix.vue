<template>
  <div class="appendix">
    <header-component />
    Appendix
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from '../../components/Header.vue';

export default Vue.extend({
  name: 'AppendixView',
  components: { HeaderComponent },
});
</script>
