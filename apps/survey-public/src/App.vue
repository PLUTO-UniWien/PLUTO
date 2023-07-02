<template>
  <div id="app">
    <loading-view v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoadingView from './views/loading/Loading.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default Vue.extend({
  name: 'App',
  components: { LoadingView },
  methods: {
    ...mapActions('auth', ['verifyToken']),
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn']),
    ...mapState('auth', ['isLoading']),
  },
  created() {
    this.verifyToken();
  },
  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        if (this.isLoggedIn) {
          this.$router.push({ name: 'Home' }).catch(console.error);
        } else {
          this.$router.push({ name: 'Login' }).catch(console.error);
        }
      }
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
