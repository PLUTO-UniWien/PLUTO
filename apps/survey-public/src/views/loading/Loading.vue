<template>
  <div class="loading-screen">
    <b-spinner class="loading-spinner" variant="primary" label="Loading..." />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadingView',
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.loading-spinner {
  width: 5rem;
  height: 5rem;
}
</style>
