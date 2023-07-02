<template>
  <div class="home">
    <HeaderComponent />
  </div>
</template>

<script>
import Vue from 'vue';
import HeaderComponent from '../components/Header.vue';

export default Vue.extend({
  name: 'HomeView',
  components: {
    HeaderComponent,
  },
});
</script>
