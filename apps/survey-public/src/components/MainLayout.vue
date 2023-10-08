<template>
  <div class="main-layout">
    <header-component />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeaderComponent from './Header.vue';

export default Vue.extend({
  name: 'MainLayout',
  components: { HeaderComponent },
});
</script>

<style lang="scss">
@import '../styles/bootstrap';

.main-layout {
  min-height: calc(100vh - 2rem);
  @extend .d-flex;
  @extend .flex-column;
}

.main-content {
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
}
</style>
