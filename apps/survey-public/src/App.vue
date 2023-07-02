<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'App',
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
      if (isLoading) {
        this.$router.push({ name: 'Loading' }).catch(console.error);
      }
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

import { mapActions, mapGetters, mapState } from 'vuex';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
