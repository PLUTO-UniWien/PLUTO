<template>
  <div id="app" style="background-color: #f3f3f3; height: 100vh" >
    <Survey/>
  </div>
</template>

<script>
import Survey from './components/Survey.vue';

export default {
  name: 'App',
  components: {
    Survey
  },
  mounted() {
    // this.$store.dispatch('loadData');
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  padding-bottom: 40px;
  line-height: 1.6
}

p {line-height: 1.4}

/* Left-align the question header and response options */
.sd-question__header, .sd-selectbase {
  text-align: left;
}

</style>
